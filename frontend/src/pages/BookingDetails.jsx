import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./bookingDetails.css";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
const OTP_REQUEST_TIMEOUT_MS = 60000;

const loadRazorpayCheckout = () =>
  new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error("Could not load Razorpay checkout."));
    document.body.appendChild(script);
  });

const BookingDetails = ({ property: initialProperty }) => {
  const { propertyID } = useParams();
  const [property, setProperty] = useState(initialProperty || null);
  const [pageLoading, setPageLoading] = useState(!initialProperty);
  const [pageError, setPageError] = useState("");

  const [formData, setFormData] = useState({
    checkInDate: "",
    roomsBooked: 1,
    otp: "",
    termsCheckbox: false,
  });

  const [otpKey, setOtpKey] = useState("");
  const [otpEnabled, setOtpEnabled] = useState(false);

  const [loadingOtp, setLoadingOtp] = useState(false);
  const [loadingPay, setLoadingPay] = useState(false);

  const [alert, setAlert] = useState({
    type: "",
    message: "",
    active: false,
  });

  useEffect(() => {
    if (initialProperty) {
      setProperty(initialProperty);
      setPageLoading(false);
      setPageError("");
      return;
    }

    if (!propertyID) {
      setPageLoading(false);
      setPageError("Property details are missing from this booking link.");
      return;
    }

    let isMounted = true;

    const loadProperty = async () => {
      setPageLoading(true);
      setPageError("");

      try {
        const res = await axios.get(`${backendUrl}/booking/${propertyID}/new`, {
          withCredentials: true,
        });

        if (!isMounted) return;
        setProperty(res.data.property);
      } catch (err) {
        if (!isMounted) return;
        setPageError(
          err.response?.data?.error ||
            "Could not load booking details for this property."
        );
      } finally {
        if (isMounted) setPageLoading(false);
      }
    };

    loadProperty();

    return () => {
      isMounted = false;
    };
  }, [initialProperty, propertyID]);

  const showAlert = (type, message) => {
    setAlert({
      type,
      message,
      active: true,
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSendOtp = async () => {
    if (!formData.checkInDate) {
      showAlert("error", "Please select move-in date.");
      return;
    }

    setLoadingOtp(true);

    try {
      const res = await axios.post(
        `${backendUrl}/booking/${property._id}/send-otp`,
        {
          checkInDate: formData.checkInDate,
          roomsBooked: formData.roomsBooked,
        },
        {
          withCredentials: true,
          timeout: OTP_REQUEST_TIMEOUT_MS,
        }
      );

      setOtpKey(res.data.otpKey);
      setOtpEnabled(true);

      const roomsLeft = res.data.availability.availableRooms;           

      showAlert(
        "success",
        `Availability confirmed. OTP sent to your email. ${roomsLeft} room(s) remain available from selected move-in date.`
      );
    } catch (err) {
      showAlert(
        "error",
        err.response?.data?.error ||
          (err.code === "ECONNABORTED"
            ? "OTP email is still taking too long. Please try again in a moment."
            : "") ||
          "Could not verify booking details."
      );
    } finally {
      setLoadingOtp(false);
    }
  };

  const handlePayment = async () => {
    if (!formData.termsCheckbox) {
      showAlert(
        "error",
        "Please accept terms and conditions."
      );
      return;
    }

    if (!otpKey) {
      showAlert(
        "error",
        "Please request OTP first."
      );
      return;
    }

    if (!formData.otp.trim()) {
      showAlert("error", "Please enter OTP.");
      return;
    }

    setLoadingPay(true);

    try {
      const verifyRes = await axios.post(
        `${backendUrl}/booking/${property._id}/verify-and-pay`,
        {
          checkInDate: formData.checkInDate,
          roomsBooked: formData.roomsBooked,
          otp: formData.otp,
          otpKey,
        },
        {
          withCredentials: true,
        }
      );

      const bookingData = verifyRes.data.bookingData;

      const paymentRes = await axios.get(
        `${backendUrl}/property/${property._id}/makePayment`,
        {
          params: {
            checkInDate: bookingData.checkInDate,
            roomsBooked: bookingData.roomsBooked,
            verificationKey: bookingData.verificationKey,
          },
          withCredentials: true,
        }
      );

      await loadRazorpayCheckout();

      const paymentData = paymentRes.data;

      await new Promise((resolve, reject) => {
        const checkout = new window.Razorpay({
          key: paymentData.key,
          amount: paymentData.order.amount,
          currency: paymentData.order.currency,
          name: "StayVista",
          description: `Booking payment for ${paymentData.property.name}`,
          order_id: paymentData.order.id,
          prefill: {
            name: paymentData.customer?.name || "",
            email: paymentData.customer?.email || "",
            contact: paymentData.customer?.contact || "",
          },
          notes: {
            propertyID: property._id,
          },
          theme: {
            color: "#2d7396",
          },
          handler: async (response) => {
            try {
              const bookingRes = await axios.post(
                `${backendUrl}/booking/payment-successful`,
                {
                  propertyID: property._id,
                  key: paymentData.paymentKey,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                },
                {
                  withCredentials: true,
                }
              );

              alert(bookingRes.data.success || "Booking confirmed successfully.");
              window.location.href = `/rider/${bookingRes.data.riderID}`;
              resolve();
            } catch (err) {
              reject(err);
            }
          },
          modal: {
            ondismiss: () => reject(new Error("Payment was cancelled.")),
          },
        });

        checkout.open();
      });
    } catch (err) {
      showAlert(
        "error",
        err.response?.data?.error ||
          err.message ||
          "Could not continue to payment."
      );
    } finally {
      setLoadingPay(false);
    }
  };

  if (pageLoading) {
    return (
      <section className="booking-page">
        <div className="container">
          <div className="booking-status-card">
            <p className="booking-eyebrow">Booking Details</p>
            <h1>Loading your stay...</h1>
          </div>
        </div>
      </section>
    );
  }

  if (pageError || !property) {
    return (
      <section className="booking-page">
        <div className="container">
          <div className="booking-status-card">
            <p className="booking-eyebrow">Booking Details</p>
            <h1>Unable to open this booking page.</h1>
            <p className="booking-subtitle">
              {pageError || "Property details were not found."}
            </p>
          </div>
        </div>
      </section>
    );
  }

  const heroImage =
    property.images && property.images.length > 0
      ? property.images[0]
      : "/images/stayvista-logo.png";
  const address = property.address || {};
  const owner = property.owner || {};
  const maxRooms = property.availableRooms || property.maxOcc || 1;

  return (
    <section className="booking-page">
      <div className="container">
        <div className="booking-shell">

          {/* LEFT SECTION */}

          <div className="booking-card">
            <p className="booking-eyebrow">
              Booking Details
            </p>

            <h1>Confirm your stay before payment.</h1>

            <p className="booking-subtitle">
              Choose your move-in date, enter the
              number of rooms you want, verify OTP,
              and continue to Razorpay checkout.
            </p>

            <div className="booking-form">

              <div className="booking-grid">

                <div className="booking-field full">
                  <label>Move-in Date</label>

                  <input
                    type="date"
                    name="checkInDate"
                    className="form-control"
                    value={formData.checkInDate}
                    onChange={handleChange}
                  />
                </div>

                <div className="booking-field">
                  <label>Rooms Required</label>

                  <input
                    type="number"
                    name="roomsBooked"
                    min="1"
                    max={maxRooms}
                    className="form-control"
                    value={formData.roomsBooked}
                    onChange={handleChange}
                  />
                </div>

                <div className="booking-field">
                  <label>Booking Amount</label>

                  <input
                    type="text"
                    className="form-control"
                    value={`Rs. ${property.bookingMoney || 0}`}
                    readOnly
                  />
                </div>

              </div>

              {/* Availability */}

              <div className="booking-check-card">

                <h3>Availability Check</h3>

                <p className="booking-help">
                  We'll verify room availability
                  before payment starts.
                </p>

                <div className="booking-actions mt-3">

                  <button
                    className="btn btn-primary"
                    onClick={handleSendOtp}
                    disabled={loadingOtp}
                  >
                    {loadingOtp
                      ? "Checking availability and sending OTP..."
                      : "Check Availability And Send OTP"}
                  </button>

                </div>

              </div>

              {/* OTP */}

              <div className="booking-otp-card">

                <h3>Email Verification</h3>

                <p className="booking-help">
                  Enter OTP sent to your email.
                </p>

                <div className="booking-grid mt-3">

                  <div className="booking-field full">

                    <label>Booking OTP</label>

                    <input
                      type="text"
                      name="otp"
                      className="form-control"
                      placeholder="Enter OTP"
                      value={formData.otp}
                      onChange={handleChange}
                      disabled={!otpEnabled}
                    />

                  </div>

                </div>

                <div className="booking-actions mt-3">

                  <button
                    className="btn btn-success"
                    onClick={handlePayment}
                    disabled={loadingPay || !otpEnabled}
                  >
                    {loadingPay
                      ? "Verifying OTP..."
                      : "Verify OTP And Continue To Payment"}
                  </button>

                </div>

              </div>

              {/* Terms */}

              <div className="booking-check-card booking-terms">

                <div className="form-check">

                  <input
                    type="checkbox"
                    name="termsCheckbox"
                    checked={formData.termsCheckbox}
                    onChange={handleChange}
                  />

                  <label>
                    I agree to Terms and Conditions.
                  </label>

                </div>

              </div>

              {/* Alert */}

              {alert.active && (
                <div
                  className={`booking-alert active ${alert.type}`}
                >
                  {alert.message}
                </div>
              )}

            </div>
          </div>

          {/* RIGHT SECTION */}

          <div className="booking-side">

            <div className="booking-side-inner">

              <p className="booking-eyebrow">
                StayVista
              </p>

              <img
                src={heroImage}
                alt={property.name}
                className="booking-summary-image"
              />

              <h2>{property.name}</h2>

              <p>
                {[address.addL1, address.city, address.state]
                  .filter(Boolean)
                  .join(", ")}
              </p>

              <div className="booking-summary-card">

                <div className="booking-summary-row">
                  <span>Monthly Rate</span>
                  <strong>Rs. {property.rate || 0}</strong>
                </div>

                <div className="booking-summary-row">
                  <span>Booking Amount</span>
                  <strong>
                    Rs. {property.bookingMoney || 0}
                  </strong>
                </div>

                <div className="booking-summary-row">
                  <span>Owner</span>
                  <strong>
                    {owner.name || "StayVista provider"}
                  </strong>
                </div>

              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default BookingDetails;
