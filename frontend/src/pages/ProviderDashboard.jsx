
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./providerDashboard.css";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const ProviderDashboard = ({ userInfo, userRoleID, deleteProperty }) => {
  const { id } = useParams();
  const [loadedUserInfo, setLoadedUserInfo] = useState(userInfo || null);
  const [loadedUserRoleID, setLoadedUserRoleID] = useState(userRoleID || id || "");
  const [errorMessage, setErrorMessage] = useState("");
  const currentUserInfo = userInfo || loadedUserInfo;
  const currentUserRoleID = userRoleID || loadedUserRoleID;
  const profilePic = currentUserInfo?.profilePic || "/images/man.svg";

  const cancelledBookingsCount =
    currentUserInfo?.bookingCompleted?.filter(
      (booking) => booking.cancelledAt
    ).length || 0;

  useEffect(() => {
    const providerID = userRoleID || id;

    if (userInfo || !providerID) return;

    fetch(`${backendUrl}/provider/${providerID}`, {
      credentials: "include",
    })
      .then(async (res) => {
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || data.message || "Could not load provider profile.");
        }

        setLoadedUserInfo(data.userInfo);
        setLoadedUserRoleID(providerID);
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage(error.message || "Could not load provider profile.");
      });
  }, [id, userInfo, userRoleID]);

  const handleDeleteProperty = (propertyID) => {
    if (deleteProperty) {
      deleteProperty(propertyID);
      return;
    }

    alert("Delete action is not connected on this page yet.");
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
              Loading provider profile...
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
              <p className="dashboard-eyebrow">Provider Dashboard</p>
              <h1>Welcome back, {currentUserInfo?.name}.</h1>
              <p>
                Manage your properties, bookings, and business insights from one
                place.
              </p>
            </div>
          </div>

          {/* PROFILE */}
          <div className="dashboard-card">
            <div className="dashboard-profile">

              <div className="dashboard-profile-card">
                <img
                  src={profilePic}
                  alt="profile"
                  className="dashboard-avatar"
                />

                <h2>{currentUserInfo?.name}</h2>
                <p>Property Provider</p>

                <Link
                  className="btn btn-primary"
                  to={`/provider/${currentUserRoleID}/edit`}
                >
                  Edit Profile
                </Link>

                <Link className="btn btn-outline-success" to="/messages">
                  Open Inbox
                </Link>

                <Link className="btn btn-outline-secondary" to="/property/new">
                  Register PG
                </Link>
              </div>

              <div className="dashboard-details">
                <div className="dashboard-details-grid">

                  <div className="dashboard-detail">
                    <span className="dashboard-detail-label">Email</span>
                    <p className="dashboard-detail-value">
                      {currentUserInfo?.email}
                    </p>
                  </div>

                  <div className="dashboard-detail">
                    <span className="dashboard-detail-label">Phone</span>
                    <p className="dashboard-detail-value">
                      +91 {currentUserInfo?.phone}
                    </p>
                  </div>

                  <div className="dashboard-detail">
                    <span className="dashboard-detail-label">GST</span>
                    <p className="dashboard-detail-value">
                      {currentUserInfo?.gst || "Not added"}
                    </p>
                  </div>

                  <div className="dashboard-detail">
                    <span className="dashboard-detail-label">
                      License Certificate
                    </span>

                    <p className="dashboard-detail-value">
                      {currentUserInfo?.licenseValidity ? (
                        <a
                          href={currentUserInfo.licenseValidity}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View certificate
                        </a>
                      ) : (
                        "Not added"
                      )}
                    </p>
                  </div>

                  <div className="dashboard-detail">
                    <span className="dashboard-detail-label">
                      License Valid Upto
                    </span>

                    <p className="dashboard-detail-value">
                      {currentUserInfo?.licenseValidUpto
                        ? new Date(
                            currentUserInfo.licenseValidUpto
                          ).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "Not added"}
                    </p>
                  </div>

                  <div className="dashboard-detail">
                    <span className="dashboard-detail-label">Location</span>

                    <p className="dashboard-detail-value">
                      {currentUserInfo?.address?.city},{" "}
                      {currentUserInfo?.address?.state}
                    </p>
                  </div>

                  <div className="dashboard-detail">
                    <span className="dashboard-detail-label">
                      Total Properties
                    </span>

                    <p className="dashboard-detail-value">
                      {currentUserInfo?.properties?.length}
                    </p>
                  </div>

                  <div className="dashboard-detail">
                    <span className="dashboard-detail-label">
                      Bookings
                    </span>

                    <p className="dashboard-detail-value">
                      {currentUserInfo?.bookingCompleted?.length}
                    </p>
                  </div>

                  <div className="dashboard-detail">
                    <span className="dashboard-detail-label">
                      Cancelled Bookings
                    </span>

                    <p className="dashboard-detail-value">
                      {cancelledBookingsCount}
                    </p>
                  </div>

                </div>
              </div>

            </div>
          </div>

          {/* PROPERTIES */}
          <div className="dashboard-card dashboard-tabs">

            <h2 className="dashboard-section-title">
              Properties
            </h2>

            {currentUserInfo?.properties?.length === 0 ? (
              <div className="dashboard-empty">
                No properties added yet.
              </div>
            ) : (
              <div className="dashboard-list">

                {currentUserInfo?.properties?.map((prop) => (
                  <div className="dashboard-item" key={prop._id}>

                    <div className="dashboard-item-top">
                      <span className="dashboard-item-badge">
                        ID: {prop._id}
                      </span>
                    </div>

                    <div className="dashboard-item-body">

                      <img
                        src={
                          (prop.images && prop.images[0]) ||
                          "/images/stayvista-logo.png"
                        }
                        alt="property"
                        className="dashboard-item-image"
                      />

                      <div className="dashboard-item-content">

                        <h3>{prop.name}</h3>

                        <div className="dashboard-inline-meta">
                          <span>₹ {prop.rate}</span>
                          <span className="text-capitalize">
                            {prop.type}
                          </span>
                        </div>

                        <div className="dashboard-item-actions">

                          <a
                            href={`/property/${prop._id}`}
                            className="btn btn-primary"
                          >
                            View
                          </a>

                          <a
                            href={`/property/${prop._id}/edit`}
                            className="btn btn-secondary"
                          >
                            Edit
                          </a>

                          <button
                            className="btn btn-danger"
                            onClick={() => handleDeleteProperty(prop._id)}
                          >
                            Delete
                          </button>

                        </div>
                      </div>
                    </div>
                  </div>
                ))}

              </div>
            )}

            {/* BOOKINGS */}
            <h2 className="dashboard-section-title">
              Bookings
            </h2>

            {currentUserInfo?.bookingCompleted?.length === 0 ? (
              <div className="dashboard-empty">
                No confirmed bookings yet.
              </div>
            ) : (
              <div className="dashboard-list">

                {currentUserInfo?.bookingCompleted?.map((com) => (

                  <div className="dashboard-item" key={com.id}>

                    <div className="dashboard-item-top">

                      <span className="dashboard-item-badge">
                        Booking: {com.id}
                      </span>

                      <span
                        className={`dashboard-status ${
                          com.cancelledAt
                            ? "status-declined"
                            : com.checkedOutAt
                            ? "status-pending"
                            : "status-accepted"
                        }`}
                      >
                        {com.cancelledAt
                          ? "Cancelled"
                          : com.checkedOutAt
                          ? "Checked Out"
                          : "Confirmed"}
                      </span>

                    </div>

                    <div className="dashboard-item-body">

                      <img
                        src={com?.property?.images?.[0]}
                        alt="property"
                        className="dashboard-item-image"
                      />

                      <div className="dashboard-item-content">

                        <h3>{com?.property?.name}</h3>

                        <div className="dashboard-inline-meta">

                          <span>User: {com?.by?.name}</span>

                          <span>
                            ₹ {com?.property?.bookingMoney}
                          </span>

                          {com?.paymentID && (
                            <span>
                              Payment Ref: {com.paymentID}
                            </span>
                          )}

                          {com?.checkInDate && (
                            <span>
                              Move-in:{" "}
                              {new Date(
                                com.checkInDate
                              ).toLocaleDateString("en-IN")}
                            </span>
                          )}

                          {com?.roomsBooked && (
                            <span>
                              {com.roomsBooked} room(s)
                            </span>
                          )}

                          {com?.checkedOutAt && (
                            <span>
                              Checked out:{" "}
                              {new Date(
                                com.checkedOutAt
                              ).toLocaleDateString("en-IN")}
                            </span>
                          )}

                          {com?.cancelledAt && (
                            <span>
                              Cancelled on:{" "}
                              {new Date(
                                com.cancelledAt
                              ).toLocaleDateString("en-IN")}
                            </span>
                          )}

                        </div>

                        <div className="dashboard-comment">

                          {com?.cancelledAt ? (
                            <>
                              <strong>Cancellation Reason:</strong>{" "}
                              {com?.cancellationReason ||
                                "No reason shared."}
                            </>
                          ) : (
                            <>
                              <strong>Comment:</strong>{" "}
                              {com?.comment || "No comment"}
                            </>
                          )}

                        </div>

                        <div
                          className="dashboard-item-actions"
                          style={{ marginTop: "0.8rem" }}
                        >

                          <a
                            href={`/messages?rider=${com?.by?._id}`}
                            className="btn btn-outline-primary"
                          >
                            Contact Rider
                          </a>

                        </div>

                      </div>
                    </div>
                  </div>

                ))}

              </div>
            )}

          </div>
        </div>
      </div>
    </section>
  );
};

export default ProviderDashboard;
