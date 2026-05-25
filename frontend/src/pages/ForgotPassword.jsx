import React, { useState } from "react";
import "./forgotPassword.css";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${backendUrl}/auth/forget-password`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        alert("Reset link sent successfully!");
      } else {
        alert("Failed to send reset link. Please try again.");
      }
    } catch (error) {
      console.error("Error sending reset link:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <section className="auth-page">
      <div className="container">
        <div className="auth-shell">

          {/* LEFT SIDE */}
          <div className="auth-showcase">
            <div className="auth-showcase-content">

              <p className="auth-eyebrow">StayVista</p>

              <h1>Reset access without friction.</h1>

              <p>
                Enter the email address linked to your account and
                we’ll send you a secure password reset link so you can
                continue without starting over.
              </p>

              <div className="auth-points">

                <div className="auth-point">
                  <i className="fa-solid fa-envelope"></i>
                  <span>
                    The reset link is delivered to your registered inbox
                    in a few moments.
                  </span>
                </div>

                <div className="auth-point">
                  <i className="fa-solid fa-shield-halved"></i>
                  <span>
                    Only the account owner with email access can continue
                    the password change flow.
                  </span>
                </div>

                <div className="auth-point">
                  <i className="fa-solid fa-key"></i>
                  <span>
                    Once your password is updated, you can return to login
                    and resume your stay search normally.
                  </span>
                </div>

              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="auth-card">

            <h2>Forgot Password</h2>

            <p className="auth-card-subtitle">
              Enter your registered email address to receive a password reset link.
            </p>

            <form className="auth-form" onSubmit={handleSubmit}>

              <div className="auth-field">

                <label htmlFor="email">Email address</label>

                <div className="input-group">

                  <div className="input-group-prepend">
                    <div className="input-group-text">
                      <i className="fa fa-link"></i>
                    </div>
                  </div>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="form-control"
                    placeholder="Enter your email"
                    required
                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <p className="auth-help">
                  We’ll only use this address to send your secure reset link.
                </p>

              </div>

              <div className="auth-actions">

                <button type="submit" className="btn-primary-custom">
                  Send Reset Link
                </button>

                <a href="/login">Back to Login</a>

              </div>

              <div className="auth-links">
                <a href="/register">
                  Need an account? Register now.
                </a>
              </div>

            </form>

          </div>

        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
