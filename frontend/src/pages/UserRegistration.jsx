
import React, { useState } from "react";
import "./userRegistration.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const UserRegistration = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    pass: "",
    role: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${backendUrl}/auth/registration`, formData, {
        withCredentials: true,
      });

      alert("Check your email to validate your account!");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.log(error);

      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;

        errors.forEach((err) => {
          alert(err.msg);
        });
      } else if (error.response?.data?.error) {
        alert(error.response.data.error);
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

              <h1>
                Create your account and start with the right role.
              </h1>

              <p>
                Register once, verify your email, and continue either as a
                rider searching for stays or as a provider listing your own
                properties.
              </p>

              <div className="auth-points">
                <div className="auth-point">
                  <i className="fa-solid fa-user-check"></i>

                  <span>
                    Keep one account to manage searches, bookings,
                    and your profile details.
                  </span>
                </div>

                <div className="auth-point">
                  <i className="fa-solid fa-building"></i>

                  <span>
                    Choose provider if you want to post and manage
                    PG listings of your own.
                  </span>
                </div>

                <div className="auth-point">
                  <i className="fa-solid fa-envelope-circle-check"></i>

                  <span>
                    Your account activation continues through email
                    verification after signup.
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="auth-card">
            <h2>Registration</h2>

            <p className="auth-card-subtitle">
              Fill in your account details and choose your role.
            </p>

            <form
              className="auth-form"
              onSubmit={handleSubmit}
            >
              <div className="auth-field">
                <label htmlFor="name">Name</label>

                <div className="input-group">
                  <div className="input-group-prepend">
                    <div className="input-group-text">
                      <i className="fa fa-id-card-o"></i>
                    </div>
                  </div>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter Name"
                    className="form-control"
                    required
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
              </div>

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
                    type="email"
                    placeholder="Enter Email"
                    className="form-control"
                    required
                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="auth-field">
                <label htmlFor="pass">Password</label>

                <div className="input-group">
                  <input
                    id="pass"
                    name="pass"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter Password"
                    className="form-control"
                    required
                    pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,12}$"
                    value={formData.pass}
                    onChange={handleChange}
                  />

                  <div className="input-group-append">
                    <div
                      className="input-group-text"
                      onClick={toggleVisibility}
                    >
                      <i className="fa fa-eye"></i>
                    </div>
                  </div>
                </div>

                <p className="auth-help">
                  Minimum 8 characters with one uppercase letter,
                  one number, and one special character.
                </p>
              </div>

              <div className="auth-role-group">
                <span>Role</span>

                <div className="auth-role-options">
                  <div className="auth-role-chip">
                    <input
                      type="radio"
                      id="role_0"
                      name="role"
                      value="rider"
                      className="form-check-input"
                      required
                      checked={formData.role === "rider"}
                      onChange={handleChange}
                    />

                    <label htmlFor="role_0">Rider</label>
                  </div>

                  <div className="auth-role-chip">
                    <input
                      type="radio"
                      id="role_1"
                      name="role"
                      value="provider"
                      className="form-check-input"
                      required
                      checked={formData.role === "provider"}
                      onChange={handleChange}
                    />

                    <label htmlFor="role_1">Provider</label>
                  </div>
                </div>

                <p className="auth-help">
                  Rider: you want to search for properties.
                  Provider: you want to post and manage your own properties.
                </p>
              </div>

              <div className="auth-actions">
                <button type="submit" className="btn btn-primary">
                  Create Account
                </button>
              </div>

              <div className="auth-links">
                <Link to="/login">
                  Already a user? Login.
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserRegistration;
