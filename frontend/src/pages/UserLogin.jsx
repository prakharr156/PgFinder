
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./userLogin.css";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const UserLogin = ({ onLogin }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [attempt, setAttempt] = useState(searchParams.get("attempt") || "");
  const [statusMessage, setStatusMessage] = useState(
    searchParams.get("message") || ""
  );
  const [verifiedStatus, setVerifiedStatus] = useState(
    searchParams.get("verified") || ""
  );
  const [captchaQuestion, setCaptchaQuestion] = useState("");
  const [captchaKey, setCaptchaKey] = useState("");
  const captchaRequestId = useRef(0);

  useEffect(() => {
    const fetchCaptcha = async () => {
      const requestId = captchaRequestId.current + 1;
      captchaRequestId.current = requestId;

      try {
        const res = await axios.get(`${backendUrl}/auth/login`, {
          withCredentials: true,
        });

        if (requestId !== captchaRequestId.current) return;

        setCaptchaQuestion(res.data.captchaQuestion || "");
        setCaptchaKey(res.data.captchaKey || "");
      } catch (error) {
        if (requestId !== captchaRequestId.current) return;

        setStatusMessage(
          error.response?.data?.error || "Could not load login captcha."
        );
        setVerifiedStatus("error");
      }
    };

    fetchCaptcha();
  }, []);

  const toggleVisibility = () => {
    setShowPassword(!showPassword);
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const payload = {
      email: formData.get("email"),
      pass: formData.get("pass"),
      captchaAnswer: formData.get("captchaAnswer"),
      captchaKey,
    };

    try {
      const res = await axios.post(`${backendUrl}/auth/login`, payload, {
        withCredentials: true,
      });

      onLogin?.({
        user: res.data.user,
      });

      navigate(res.data.redirectTo || "/");
    } catch (error) {
      const data = error.response?.data || {};

      setAttempt(data.attempt || "failed");
      setStatusMessage(data.error || "Login failed. Please try again.");
      setVerifiedStatus("error");

      if (data.captchaQuestion) {
        setCaptchaQuestion(data.captchaQuestion);
      }

      if (data.captchaKey) {
        setCaptchaKey(data.captchaKey);
      }
    }
  };

  return (
    <section className="auth-page">
      <div className="container">
        <div className="auth-shell">
          <div className="auth-showcase">
            <div className="auth-showcase-content">
              <p className="auth-eyebrow">StayVista</p>

              <h1>Sign in and continue your stay search.</h1>

              <p>
                Access your dashboard, track bookings, and revisit shortlisted
                properties through one cleaner login flow.
              </p>

              <div className="auth-points">
                <div className="auth-point">
                  <i className="fa-solid fa-house"></i>

                  <span>
                    Open your saved property activity and current booking status
                    instantly.
                  </span>
                </div>

                <div className="auth-point">
                  <i className="fa-solid fa-shield-halved"></i>

                  <span>
                    Keep your verified profile details and uploaded documents in
                    one place.
                  </span>
                </div>

                <div className="auth-point">
                  <i className="fa-solid fa-location-dot"></i>

                  <span>
                    Resume your search across cities without starting over every
                    time.
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="auth-card">
            <h2>Login</h2>

            <p className="auth-card-subtitle">
              Enter your email and password to continue.
            </p>

            {attempt === "failed" && (
              <div className="auth-alert">
                Invalid email ID or password.
              </div>
            )}

            {statusMessage && (
              <div
                className={`auth-alert ${
                  verifiedStatus === "success" || verifiedStatus === "already"
                    ? "success"
                    : ""
                }`}
              >
                {statusMessage}
              </div>
            )}

            {attempt === "captcha-failed" && (
              <div className="auth-alert">
                Captcha verification failed. Try again.
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="auth-form"
              noValidate
            >
              <div className="auth-field">
                <label htmlFor="email">Email</label>

                <div className="input-group">
                  <div className="input-group-prepend">
                    <div className="input-group-text">
                      <i className="fa fa-link"></i>
                    </div>
                  </div>

                  <input
                    id="email"
                    name="email"
                    placeholder="Enter Email"
                    type="email"
                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                    className="form-control"
                    required
                  />
                </div>
              </div>

              <div className="auth-field">
                <label htmlFor="pass">Password</label>

                <div className="input-group">
                  <input
                    id="pass"
                    name="pass"
                    placeholder="Enter Password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="form-control"
                    pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,12}$"
                  />

                  <div className="input-group-append">
                    <div
                      className="input-group-text password-toggle"
                      onClick={toggleVisibility}
                    >
                      <i
                        className={`fa ${
                          showPassword ? "fa-eye-slash" : "fa-eye"
                        }`}
                      ></i>
                    </div>
                  </div>
                </div>

                <p className="auth-help">
                  Minimum 8 characters with one uppercase letter, one number,
                  and one special character.
                </p>
              </div>

              <div className="auth-field">
                <label htmlFor="captchaAnswer">Captcha</label>

                <div className="input-group">
                  <div className="input-group-prepend">
                    <div className="input-group-text">
                      {captchaQuestion || "Loading..."}
                    </div>
                  </div>

                  <input
                    id="captchaAnswer"
                    name="captchaAnswer"
                    placeholder="Answer to continue"
                    type="text"
                    className="form-control"
                    autoComplete="off"
                    spellCheck="false"
                    required
                  />
                </div>

                <p className="auth-help">
                  Challenges now vary between multi-step math, sequence,
                  reverse-text, and character-position prompts.
                </p>
              </div>

              <div className="auth-actions">
                <button type="submit" className="btn-login">
                  Login
                </button>

                <a href="/auth/forget-password">Forgot Password?</a>
              </div>

              <div className="auth-links">
                <a href="/auth/registration">
                  New user? Register now.
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserLogin;
