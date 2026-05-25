import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./riderDashboard.css";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const RiderDashboard = ({ userInfo, userRoleID }) => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("bookings");
  const [loadedUserInfo, setLoadedUserInfo] = useState(userInfo || null);
  const [loadedUserRoleID, setLoadedUserRoleID] = useState(userRoleID || id || "");
  const [errorMessage, setErrorMessage] = useState("");
  const [submittingBookingID, setSubmittingBookingID] = useState("");
  const currentUserInfo = userInfo || loadedUserInfo;
  const currentUserRoleID = userRoleID || loadedUserRoleID;
  const getMongoID = (item) => item?._id || item?.id || "";

  const hasDob =
    currentUserInfo?.dob && !isNaN(new Date(currentUserInfo.dob).getTime());

  const emergencyContact = currentUserInfo?.emergencyContact || {};

  const profilePic = currentUserInfo?.profilePic || "/images/man.svg";

  useEffect(() => {
    const riderID = userRoleID || id;

    if (userInfo || !riderID) return;

    fetch(`${backendUrl}/rider/${riderID}`, {
      credentials: "include",
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || data.message || "Could not load rider profile.");
        }

        setLoadedUserInfo(data.userInfo);
        setLoadedUserRoleID(riderID);
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage(error.message || "Could not load rider profile.");
      });
  }, [id, userInfo, userRoleID]);

  const refreshRiderProfile = async () => {
    const riderID = currentUserRoleID || id;

    if (!riderID) return;

    const res = await fetch(`${backendUrl}/rider/${riderID}`, {
      credentials: "include",
    });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || data.message || "Could not refresh rider profile.");
    }

    setLoadedUserInfo(data.userInfo);
    setLoadedUserRoleID(riderID);
  };

  const canCancelBooking = (book) => {
    return Boolean(book && !book.cancelledAt && !book.checkedOutAt);
  };

  const cancelBooking = async (bookingId) => {
    const reason = window.prompt(
      "Please enter a cancellation reason of at least 10 characters. Booking amount will not be refunded."
    );

    if (reason === null) return;

    const trimmedReason = reason.trim();

    if (trimmedReason.length < 10) {
      alert("Please provide a cancellation reason with at least 10 characters.");
      return;
    }

    try {
      setSubmittingBookingID(bookingId);

      const res = await fetch(`${backendUrl}/booking/${bookingId}/cancel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ reason: trimmedReason }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.message || "Could not cancel booking.");
      }

      alert(data.success || "Booking cancelled successfully.");
      await refreshRiderProfile();
    } catch (err) {
      alert(err.message || "Could not cancel booking.");
    } finally {
      setSubmittingBookingID("");
    }
  };

  const checkoutBooking = async (bookingId) => {
    try {
      setSubmittingBookingID(bookingId);

      const res = await fetch(`${backendUrl}/booking/${bookingId}/checkout`, {
        method: "POST",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.message || "Could not complete checkout.");
      }

      alert(data.success || "Checked out successfully!");
      await refreshRiderProfile();
    } catch (err) {
      alert(err.message || "Could not complete checkout.");
    } finally {
      setSubmittingBookingID("");
    }
  };

  if (errorMessage) {
    return (
      <section className="rider-dashboard-page">
        <div className="container">
          <div className="dashboard-shell">
            <div className="dashboard-card dashboard-empty">
              {errorMessage}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!currentUserInfo) {
    return (
      <section className="rider-dashboard-page">
        <div className="container">
          <div className="dashboard-shell">
            <div className="dashboard-card dashboard-empty">
              Loading rider profile...
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="rider-dashboard-page">
      <div className="container">
        <div className="dashboard-shell">

          {/* HERO */}
          <div className="dashboard-card dashboard-hero">
            <div className="dashboard-hero-content">
              <p className="dashboard-eyebrow">Rider Dashboard</p>

              <h1>
                Welcome back, {currentUserInfo?.name}.
              </h1>

              <p>
                Review your profile details, track bookings,
                and revisit saved properties from one place.
              </p>
            </div>
          </div>

          {/* PROFILE */}
          <div className="dashboard-card">
            <div className="dashboard-profile">

              <div className="dashboard-profile-card">
                <img
                  src={profilePic}
                  alt="avatar"
                  className="dashboard-avatar"
                />

                <h2>{currentUserInfo?.name}</h2>

                <p>
                  {currentUserInfo?.occupation || "Occupation not added yet"}
                </p>

                {currentUserInfo?.id === currentUserRoleID && (
                  <>
                    <a
                      className="dashboard-btn primary-btn"
                      href={`/rider/${currentUserRoleID}/edit`}
                    >
                      Edit Profile
                    </a>

                    <a
                      className="dashboard-btn outline-btn"
                      href="/messages"
                    >
                      Open Inbox
                    </a>
                  </>
                )}
              </div>

              <div className="dashboard-details">

                <div className="dashboard-details-grid">

                  <div className="dashboard-detail">
                    <span className="dashboard-detail-label">
                      Full Name
                    </span>

                    <p className="dashboard-detail-value">
                      {currentUserInfo?.name}
                    </p>
                  </div>

                  <div className="dashboard-detail">
                    <span className="dashboard-detail-label">
                      Email
                    </span>

                    <p className="dashboard-detail-value">
                      {currentUserInfo?.email}
                    </p>
                  </div>

                  <div className="dashboard-detail">
                    <span className="dashboard-detail-label">
                      Phone
                    </span>

                    <p className="dashboard-detail-value">
                      {currentUserInfo?.phone
                        ? `+91 ${currentUserInfo.phone}`
                        : "Not added yet"}
                    </p>
                  </div>

                  <div className="dashboard-detail">
                    <span className="dashboard-detail-label">
                      Gender
                    </span>

                    <p className="dashboard-detail-value text-capitalize">
                      {currentUserInfo?.gender || "Not added yet"}
                    </p>
                  </div>

                  <div className="dashboard-detail">
                    <span className="dashboard-detail-label">
                      Date of Birth
                    </span>

                    <p className="dashboard-detail-value">
                      {hasDob
                        ? new Date(currentUserInfo.dob).toLocaleDateString("fr")
                        : "Not added yet"}
                    </p>
                  </div>

                  <div className="dashboard-detail">
                    <span className="dashboard-detail-label">
                      Covid Certificate
                    </span>

                    <p className="dashboard-detail-value">
                      {currentUserInfo?.covidCert ? (
                        <>
                          Uploaded |
                          <a
                            href={currentUserInfo.covidCert}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {" "}
                            View File
                          </a>
                        </>
                      ) : (
                        "Not uploaded yet"
                      )}
                    </p>
                  </div>

                  <div
                    className="dashboard-detail"
                    style={{ gridColumn: "1 / -1" }}
                  >
                    <span className="dashboard-detail-label">
                      Emergency Contact
                    </span>

                    <p className="dashboard-detail-value">
                      {emergencyContact?.name || "Not added yet"}
                      <br />
                      {emergencyContact?.phone || "Not added yet"}
                      <br />
                      {emergencyContact?.relation || "Not added yet"}
                    </p>
                  </div>

                </div>
              </div>
            </div>
          </div>

          {/* TABS */}
          <div className="dashboard-card dashboard-tabs">

            <div className="dashboard-tab-buttons">

              <button
                className={`dashboard-tab-btn ${
                  activeTab === "bookings" ? "active-tab" : ""
                }`}
                onClick={() => setActiveTab("bookings")}
              >
                Bookings
              </button>

              <button
                className={`dashboard-tab-btn ${
                  activeTab === "likes" ? "active-tab" : ""
                }`}
                onClick={() => setActiveTab("likes")}
              >
                Liked Properties
              </button>

            </div>

            {/* BOOKINGS */}
            {activeTab === "bookings" && (
              <div className="dashboard-tab-pane">

                {(currentUserInfo?.bookings?.length || 0) === 0 ? (
                  <div className="dashboard-empty">
                    No bookings yet. Start exploring properties
                    and make your first booking.
                  </div>
                ) : (
                  <div className="dashboard-list">

                    {currentUserInfo?.bookings?.map((book) => {
                      const bookingID = getMongoID(book);
                      const propertyID = getMongoID(book.property);
                      const isSubmitting = submittingBookingID === bookingID;
                      const canCancel = canCancelBooking(book);

                      return (
                      <div className="dashboard-item" key={bookingID}>

                        <div className="dashboard-item-top">

                          <span className="dashboard-item-badge">
                            Booking ID: {bookingID}
                          </span>

                          <span
                            className={`dashboard-status ${
                              book.cancelledAt
                                ? "status-declined"
                                : book.checkedOutAt
                                ? "status-pending"
                                : "status-accepted"
                            }`}
                          >
                            {book.cancelledAt
                              ? "Cancelled"
                              : book.checkedOutAt
                              ? "Checked Out"
                              : "Confirmed"}
                          </span>

                        </div>

                        <div className="dashboard-item-body">

                          <img
                            src={
                              (book.property?.images &&
                                book.property.images[0]) ||
                              "/images/stayvista-logo.png"
                            }
                            alt={book.property?.name}
                            className="dashboard-item-image"
                          />

                          <div className="dashboard-item-content">

                            <h3>{book.property?.name}</h3>

                            <p>
                              {book.property?.address?.addL1},{" "}
                              {book.property?.address?.addL2},{" "}
                              {book.property?.address?.city},{" "}
                              {book.property?.address?.state}
                            </p>

                            <div className="dashboard-inline-meta">

                              <span>
                                Status date:{" "}
                                {new Date(book.date).toLocaleDateString("en")}
                              </span>

                              {book.paymentID && (
                                <span>
                                  Payment Ref: {book.paymentID}
                                </span>
                              )}

                              {book.checkInDate && (
                                <span>
                                  Move-in:{" "}
                                  {new Date(
                                    book.checkInDate
                                  ).toLocaleDateString("en-IN")}
                                </span>
                              )}

                              {book.roomsBooked && (
                                <span>
                                  Rooms: {book.roomsBooked}
                                </span>
                              )}

                              <span>
                                Booking amount:{" "}
                                {book.property?.bookingMoney} Rs.
                              </span>

                            </div>

                            <div className="dashboard-comment">

                              {book.cancelledAt ? (
                                <>
                                  <strong>Cancellation Reason:</strong>{" "}
                                  {book.cancellationReason ||
                                    "No reason shared."}
                                </>
                              ) : (
                                <>
                                  <strong>Booking Details:</strong>{" "}
                                  Payment completed successfully.
                                </>
                              )}

                            </div>

                            <div className="dashboard-item-actions">

                              <a
                                href={`/property/${propertyID}`}
                                target="_blank"
                                rel="noreferrer"
                                className="dashboard-btn primary-btn"
                              >
                                See Property
                              </a>

                              {!book.cancelledAt &&
                                !book.checkedOutAt && (
                                  <a
                                    href={`/messages/property/${propertyID}`}
                                    className="dashboard-btn outline-btn"
                                  >
                                    Contact Owner
                                  </a>
                                )}

                              {!book.cancelledAt &&
                                !book.checkedOutAt && (
                                  <button
                                    className="dashboard-btn success-btn"
                                    disabled={isSubmitting}
                                    onClick={() =>
                                      checkoutBooking(bookingID)
                                    }
                                  >
                                    {isSubmitting ? "Working..." : "Check Out"}
                                  </button>
                                )}

                              {canCancel && (
                                <button
                                  className="dashboard-btn danger-btn"
                                  disabled={isSubmitting}
                                  onClick={() => cancelBooking(bookingID)}
                                >
                                  {isSubmitting ? "Working..." : "Cancel Booking"}
                                </button>
                              )}

                            </div>

                          </div>
                        </div>
                      </div>

                    );
                    })}

                  </div>
                )}
              </div>
            )}

            {/* LIKES */}
            {activeTab === "likes" && (
              <div className="dashboard-tab-pane">

                {(currentUserInfo?.likes?.length || 0) === 0 ? (
                  <div className="dashboard-empty">
                    No liked properties yet.
                  </div>
                ) : (
                  <div className="dashboard-list">

                    {currentUserInfo?.likes?.map((prop) => {
                      const propertyID = getMongoID(prop);

                      return (
                      <div className="dashboard-item" key={propertyID}>

                        <div className="dashboard-item-top">

                            <span className="dashboard-item-badge">
                            Property ID: {propertyID}
                          </span>

                        </div>

                        <div className="dashboard-item-body">

                          <img
                            src={
                              (prop.images && prop.images[0]) ||
                              "/images/stayvista-logo.png"
                            }
                            alt={prop.name}
                            className="dashboard-item-image"
                          />

                          <div className="dashboard-item-content">

                            <h3>{prop.name}</h3>

                            <p>
                              {prop.address?.addL1},{" "}
                              {prop.address?.addL2},{" "}
                              {prop.address?.city},{" "}
                              {prop.address?.state}
                            </p>

                            <div className="dashboard-inline-meta">
                              <span>Rate: {prop.rate} Rs.</span>

                              <span>
                                Type: {prop.type}
                              </span>

                              <span>
                                Booking amount: {prop.bookingMoney} Rs.
                              </span>
                            </div>

                            <div className="dashboard-item-actions">
                              <a
                                href={`/property/${propertyID}`}
                                target="_blank"
                                rel="noreferrer"
                                className="dashboard-btn primary-btn"
                              >
                                See Property
                              </a>
                            </div>

                          </div>
                        </div>
                      </div>

                    );
                    })}

                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
};

export default RiderDashboard;
