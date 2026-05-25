
import React, { useState } from "react";
import "./resetPass.css";

const ResetPass = () => {
  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#!%~]).{8,12}$/;

    if (pass.trim().length === 0) {
      setError("Password length must be greater than 0 without spaces.");
      return;
    }

    if (!passwordPattern.test(pass)) {
      setError(
        "Password must contain uppercase, lowercase, number and special character."
      );
      return;
    }

    if (pass !== confirmPass) {
      setError("Password and confirm password do not match.");
      return;
    }

    console.log("Password Changed:", pass);

    // API CALL HERE
  };

  return (
    <section className="auth-page">
      <div className="container">
        <div className="auth-shell">
          <div className="auth-showcase">
            <div className="auth-showcase-content">
              <p className="auth-eyebrow">StayVista</p>

              <h1>Set a stronger password and continue.</h1>

              <p>
                Create a new password for your account and use it the next time
                you sign in. Once updated, the previous password will stop
                working immediately.
              </p>

              <div className="auth-points">
                <div className="auth-point">
                  <i className="fa-solid fa-lock"></i>
                  <span>
                    Use a password that is hard to guess and different from the
                    one you used before.
                  </span>
                </div>

                <div className="auth-point">
                  <i className="fa-solid fa-user-shield"></i>
                  <span>
                    This reset is tied to your secure link, so finish it only on
                    a trusted device.
                  </span>
                </div>

                <div className="auth-point">
                  <i className="fa-solid fa-arrow-right-to-bracket"></i>
                  <span>
                    After saving the new password, you can return to login and
                    access your account normally.
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="auth-card">
            <h2>Welcome User</h2>

            <p className="auth-card-subtitle">
              Enter your new password below to complete the reset process.
            </p>

            {error && <div className="auth-alert">{error}</div>}

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="auth-field">
                <label htmlFor="pass">New Password</label>

                <div className="input-group">
                  <input
                    type={showPass ? "text" : "password"}
                    className="form-control"
                    id="pass"
                    placeholder="Enter new password"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                  />

                  <div className="input-group-append">
                    <div
                      className="input-group-text"
                      onClick={() => setShowPass(!showPass)}
                    >
                      <i
                        className={`fa ${
                          showPass ? "fa-eye-slash" : "fa-eye"
                        }`}
                      ></i>
                    </div>
                  </div>
                </div>

                <p className="auth-help">
                  Use 8 to 12 characters with one uppercase letter, one number,
                  and one special character.
                </p>
              </div>

              <div className="auth-field">
                <label htmlFor="confirm-pass">
                  Confirm New Password
                </label>

                <div className="input-group">
                  <input
                    type={showConfirm ? "text" : "password"}
                    className="form-control"
                    id="confirm-pass"
                    placeholder="Confirm new password"
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                  />

                  <div className="input-group-append">
                    <div
                      className="input-group-text"
                      onClick={() => setShowConfirm(!showConfirm)}
                    >
                      <i
                        className={`fa ${
                          showConfirm ? "fa-eye-slash" : "fa-eye"
                        }`}
                      ></i>
                    </div>
                  </div>
                </div>
              </div>

              <div className="auth-actions">
                <button type="submit" className="btn-primary-custom">
                  Change Password
                </button>

                <a href="/login">Back to Login</a>
              </div>

              <div className="auth-links">
                <a href="/forget-password">
                  Need a different reset link? Request one again.
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResetPass;