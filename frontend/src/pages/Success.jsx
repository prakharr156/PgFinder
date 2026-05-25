import React from "react";
import "./success.css";
import { Link } from "react-router-dom";

const Success = ({ success, user }) => {
  const dashboardLink =
    user && user.role !== "admin" ? `/${user.role}/dashboard` : "/";

  return (
    <section className="success-page d-flex align-items-center">
      <div className="container">
        <div className="success-shell">
          <div className="success-card">
            <div className="success-grid">
              
              <div className="success-copy">
                <p className="success-eyebrow">Success State</p>

                <h1 className="success-title">
                  Everything went through cleanly.
                </h1>

                <div className="success-message">
                  {success}
                </div>

                <div className="success-points">
                  <div className="success-point">
                    <i className="fa-solid fa-circle-check"></i>
                    <span>
                      Your latest action has been saved successfully.
                    </span>
                  </div>

                  <div className="success-point">
                    <i className="fa-solid fa-envelope-open-text"></i>
                    <span>
                      Any related confirmation details should already be on
                      their way.
                    </span>
                  </div>

                  <div className="success-point">
                    <i className="fa-solid fa-hand-pointer"></i>
                    <span>
                      Use the actions below whenever you’re ready to continue.
                    </span>
                  </div>
                </div>

                <div className="success-actions">
                  <Link to="/" className="btn btn-primary">
                    Go To Home
                  </Link>

                  {user && user.role !== "admin" && (
                    <Link
                      to={dashboardLink}
                      className="btn btn-outline-secondary"
                    >
                      Open Dashboard
                    </Link>
                  )}

                  <Link to="/" className="success-secondary-link">
                    Continue browsing StayVista
                  </Link>
                </div>
              </div>

              <div className="success-visual">
                <div className="success-visual-content">
                  <div className="success-icon">
                    <i className="fa-solid fa-check"></i>
                  </div>

                  <div>
                    <h2>Confirmed</h2>

                    <p>
                      The flow is complete and the next step is already lined
                      up for the user.
                    </p>
                  </div>

                  <div className="success-meta">
                    <div className="success-meta-row">
                      <span className="success-meta-label">Brand</span>
                      <span className="success-meta-value">StayVista</span>
                    </div>

                    <div className="success-meta-row">
                      <span className="success-meta-label">Status</span>
                      <span className="success-meta-value">Completed</span>
                    </div>

                    <div className="success-meta-row">
                      <span className="success-meta-label">Redirect</span>
                      <span className="success-meta-value">Manual</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Success;
