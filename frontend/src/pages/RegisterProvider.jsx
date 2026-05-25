// RegisterProvider.jsx

import React, { useEffect, useState } from "react";
import "./registerProvider.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const RegisterProvider = () => {
  const navigate = useNavigate();
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    gst: "",
    licenseValidUpto: "",
    addBuilding: "",
    addL1: "",
    addL2: "",
    landmark: "",
    state: "",
    city: "",
    zipCode: "",
  });

  const [profilePic, setProfilePic] = useState(null);
  const [profilePreview, setProfilePreview] = useState(
    "/images/man.svg"
  );

  const [licenseFile, setLicenseFile] = useState(null);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitStatus, setSubmitStatus] = useState("");

  useEffect(() => {
    fetchStates();
  }, []);

  const fetchStates = async () => {
    try {
      const res = await axios.get(`${backendUrl}/state-list`, {
        withCredentials: true,
      });
      setStates(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCities = async (state) => {
    try {
      const res = await axios.get(`${backendUrl}/city/${state}`, {
        withCredentials: true,
      });
      setCities(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    const normalizedValue =
      name === "gst"
        ? value.toUpperCase()
        : name === "phone" || name === "zipCode"
          ? value.replace(/\D/g, "")
          : value;

    setFormData((prev) => ({
      ...prev,
      [name]: normalizedValue,
    }));

    if (name === "state") {
      setFormData((prev) => ({
        ...prev,
        state: normalizedValue,
        city: "",
      }));

      fetchCities(normalizedValue);
    }
  };

  const handleProfilePic = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setProfilePic(file);
    setProfilePreview(URL.createObjectURL(file));
  };

  const handleLicenseFile = (e) => {
    setLicenseFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitMessage("");
    setSubmitStatus("");

    try {
      const sendData = new FormData();

      Object.keys(formData).forEach((key) => {
        sendData.append(key, formData[key]);
      });

      if (profilePic) {
        sendData.append("profile-pic", profilePic);
      }

      if (licenseFile) {
        sendData.append("license-validity", licenseFile);
      }

      const res = await axios.post(`${backendUrl}/provider/register`, sendData, {
        withCredentials: true,
      });

      setSubmitStatus("success");
      setSubmitMessage("Provider Registered Successfully!");
      alert("Provider Registered Successfully!");

      navigate(res.data?.redirectTo || "/property/new");
    } catch (err) {
      console.log(err);

      const data = err.response?.data;
      const message =
        data?.errors?.map((error) => error.msg).join("\n") ||
        data?.error ||
        err.message ||
        "Something went wrong!";

      setSubmitStatus("error");
      setSubmitMessage(message);
      alert(message);
    }
  };

  return (
    <section className="provider-form-page">
      <div className="container">
        <div className="provider-form-shell">

          <div className="provider-form-card provider-form-hero">
            <div className="provider-form-hero-grid">

              <div>
                <p className="provider-form-eyebrow">
                  Provider Details
                </p>

                <h1>Complete your provider profile.</h1>

                <p>
                  Add your business details, upload a provider photo,
                  and keep your license information ready before you
                  start listing properties.
                </p>
              </div>

              <div className="provider-profile-card">
                <img
                  src={profilePreview}
                  alt="Provider"
                  className="provider-avatar"
                />

                <h2>{formData.name || "Your Name"}</h2>

                <p>Property Provider</p>
              </div>

            </div>
          </div>

          <div className="provider-form-card provider-form-body">

            <form onSubmit={handleSubmit}>
              {submitMessage && (
                <div className={`provider-form-alert ${submitStatus}`}>
                  {submitMessage}
                </div>
              )}

              <div className="provider-form-section">

                <h2>Basic Information</h2>

                <p>
                  These details appear across your provider profile and
                  dashboard.
                </p>

                <div className="provider-form-grid">

                  <div className="provider-field">
                    <label>Name</label>

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="provider-field">
                    <label>Email</label>

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="provider-field">
                    <label>Phone</label>

                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      maxLength="10"
                      pattern="[6-9][0-9]{9}"
                      title="Enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9."
                      required
                    />
                  </div>

                  <div className="provider-field">
                    <label>Date of Birth</label>

                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="provider-field">
                    <label>GST Number</label>

                    <input
                      type="text"
                      name="gst"
                      value={formData.gst}
                      onChange={handleChange}
                      maxLength="15"
                      pattern="[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]"
                      title="Enter a valid 15-character GST number, for example 22AAAAA0000A1Z5."
                      required
                    />
                  </div>

                  <div className="provider-field">
                    <label>Provider Photo</label>

                    <input
                      type="file"
                      accept=".png,.jpg,.jpeg"
                      onChange={handleProfilePic}
                      required
                    />

                    <p className="provider-file-note">
                      This photo will appear on your provider dashboard.
                    </p>
                  </div>

                </div>
              </div>

              <div className="provider-form-section">

                <h2>License Information</h2>

                <p>
                  Upload your license certificate and add the validity.
                </p>

                <div className="provider-form-grid">

                  <div className="provider-field">
                    <label>License Certificate</label>

                    <input
                      type="file"
                      onChange={handleLicenseFile}
                      required
                    />
                  </div>

                  <div className="provider-field">
                    <label>License Valid Upto</label>

                    <input
                      type="date"
                      name="licenseValidUpto"
                      value={formData.licenseValidUpto}
                      onChange={handleChange}
                      required
                    />
                  </div>

                </div>
              </div>

              <div className="provider-form-section">

                <h2>Address Details</h2>

                <p>
                  Add the business location details associated with your
                  provider account.
                </p>

                <div className="provider-form-grid three">

                  <div className="provider-field full">
                    <label>Building Address</label>

                    <input
                      type="text"
                      name="addBuilding"
                      value={formData.addBuilding}
                      onChange={handleChange}
                      minLength="2"
                      required
                    />
                  </div>

                  <div className="provider-field">
                    <label>Address Line 1</label>

                    <input
                      type="text"
                      name="addL1"
                      value={formData.addL1}
                      onChange={handleChange}
                      minLength="3"
                      required
                    />
                  </div>

                  <div className="provider-field">
                    <label>Address Line 2</label>

                    <input
                      type="text"
                      name="addL2"
                      value={formData.addL2}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="provider-field">
                    <label>Landmark</label>

                    <input
                      type="text"
                      name="landmark"
                      value={formData.landmark}
                      onChange={handleChange}
                      minLength="2"
                      required
                    />
                  </div>

                  <div className="provider-field">
                    <label>State</label>

                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select State</option>

                      {states.map((state, index) => (
                        <option key={index} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="provider-field">
                    <label>City</label>

                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select City</option>

                      {cities.map((city, index) => (
                        <option key={index} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="provider-field">
                    <label>Zip Code</label>

                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      maxLength="6"
                      minLength="6"
                      pattern="[0-9]{6}"
                      title="Enter a valid 6-digit zip code."
                      required
                    />
                  </div>

                </div>
              </div>

              <div className="provider-submit">
                <button type="submit">
                  Save Details
                </button>
              </div>

            </form>

          </div>

        </div>
      </div>
    </section>
  );
};

export default RegisterProvider;
