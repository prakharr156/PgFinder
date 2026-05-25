import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./bookingCancel.css";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

function BookingCancel() {
  const { id } = useParams();
  const navigate = useNavigate();

  const userRoleID = "";
  const booking = {
    id,
    property: {
      name: "Property Name",
      bookingMoney: 0,
    },
    checkInDate: null,
    roomsBooked: 1,
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    const reason = form.reason.value.trim();
    const acceptedTerms = form.cancelTermsCheckbox.checked;

    if (!acceptedTerms) {
      alert("Please acknowledge and check the terms and conditions to confirm cancellation.");
      return;
    }

    if (reason.length < 10) {
      alert("Please enter a cancellation reason with at least 10 characters.");
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/booking/${booking.id}/cancel`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason }),
      });

      if (response.ok) {
        alert("Booking cancelled successfully.");
        setTimeout(() => {
          navigate(`/rider/${userRoleID}`);
        }, 1200);
      } else {
        alert("Could not cancel booking. Please try again.");
      }
    } catch (error) {
      console.error("Error during booking cancellation:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <section className="cancel-page">
      <div className="container">
        <div className="cancel-shell">
          <div className="cancel-card">
            <div className="cancel-head">
              <p>Cancellation</p>
              <h1>Cancel this confirmed booking?</h1>
              <p className="lead">
                This action is final. The booking amount will not be refunded once
                you confirm cancellation.
              </p>
            </div>

            <div className="cancel-body">
              <div className="cancel-warning">
                Are you sure you want to cancel this booking? The booking amount
                already paid for this stay will not be refunded.
              </div>

              <div className="cancel-summary">
                <div className="cancel-summary-row">
                  <span>Property</span>
                  <strong>{booking.property?.name}</strong>
                </div>

                <div className="cancel-summary-row">
                  <span>Booking ID</span>
                  <strong>{booking.id}</strong>
                </div>

                <div className="cancel-summary-row">
                  <span>Move-in Date</span>
                  <strong>
                    {booking.checkInDate ? formatDate(booking.checkInDate) : "Not available"}
                  </strong>
                </div>

                <div className="cancel-summary-row">
                  <span>Rooms</span>
                  <strong>{booking.roomsBooked || 1}</strong>
                </div>

                <div className="cancel-summary-row">
                  <span>Booking Amount</span>
                  <strong>₹ {booking.property?.bookingMoney}</strong>
                </div>
              </div>

              <form id="cancel-booking-form" onSubmit={handleSubmit}>
                <label className="form-label" htmlFor="reason">
                  Reason for cancellation
                </label>
                <textarea
                  id="reason"
                  name="reason"
                  minLength="10"
                  maxLength="1000"
                  placeholder="Tell the provider why you are cancelling this booking..."
                  required
                />

                <div className="cancel-terms-box">
                  <div className="form-check cancel-terms-check">
                    <input
                      id="cancelTermsCheckbox"
                      name="cancelTermsCheckbox"
                      type="checkbox"
                      className="form-check-input"
                      required
                    />
                    <label htmlFor="cancelTermsCheckbox" className="form-check-label">
                      I understand that the booking amount will not be refunded and
                      I confirm my cancellation request.
                    </label>
                  </div>
                </div>

                <div className="cancel-actions">
                  <Link to={`/rider/${userRoleID}`} className="btn btn-outline-secondary">
                    Go Back
                  </Link>
                  <button type="submit" className="btn btn-danger">
                    Confirm Cancellation
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default BookingCancel;
