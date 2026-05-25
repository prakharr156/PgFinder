
import React, { useState } from "react";
import "./registerUser.css";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const RegisterUser = ({ userInfo, userRoleID }) => {
  const [formData, setFormData] = useState({
    phone: "",
    dob: "",
    gender: "",
    occupation: "",
    emContactName: "",
    emContactRelation: "",
    emContactPhone: "",
  });

  const [files, setFiles] = useState({
    profilePic: null,
    covidCert: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;

    setFiles((prev) => ({
      ...prev,
      [name]: selectedFiles[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      data.append("profile-pic", files.profilePic);
      data.append("covid-cert", files.covidCert);

      await axios.post(`${backendUrl}/rider/${userRoleID}?_method=patch`, data, {
        withCredentials: true,
      });

      alert("Your data has been successfully updated!");

      setTimeout(() => {
        window.location.href = `/rider/${userRoleID}`;
      }, 2000);
    } catch (error) {
      console.error(error);

      const errors = error.response?.data?.errors;

      if (errors && errors.length > 0) {
        errors.forEach((err) => alert(err.msg));
        return;
      }

      alert(
        error.response?.data?.error ||
          error.message ||
          "Could not update your profile."
      );
    }
  };

  return (
    <section className="user-form-page">
      <div className="container">
        <div className="user-form-shell">
          <div className="user-form-card user-form-hero">
            <div className="user-form-hero-content">
              <p className="user-form-eyebrow">User Details</p>

              <h1>Complete your rider profile.</h1>

              <p>
                Add your personal details, upload the required files, and
                include an emergency contact so your account is ready to use.
              </p>
            </div>
          </div>

          <div className="user-form-card user-form-body">
            <form onSubmit={handleSubmit}>
              {/* Basic Information */}
              <div className="user-form-section">
                <h2>Basic Information</h2>

                <p>These details help build your core rider profile.</p>

                <div className="user-form-grid">
                  <div className="user-field">
                    <label>Name</label>

                    <div className="input-group">
                      <div className="input-group-text">
                        <i className="fa fa-user"></i>
                      </div>

                      <input
                        type="text"
                        className="form-control"
                        value={userInfo?.name || ""}
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="user-field">
                    <label>Email</label>

                    <div className="input-group">
                      <div className="input-group-text">
                        <i className="fa fa-link"></i>
                      </div>

                      <input
                        type="text"
                        className="form-control"
                        value={userInfo?.email || ""}
                        readOnly
                      />
                    </div>
                  </div>

                  <div className="user-field">
                    <label>Phone</label>

                    <div className="input-group">
                      <div className="input-group-text">+91</div>

                      <input
                        type="text"
                        name="phone"
                        placeholder="Enter Phone Number"
                        className="form-control"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="user-field">
                    <label>Date of Birth</label>

                    <div className="input-group">
                      <div className="input-group-text">
                        <i className="fa fa-birthday-cake"></i>
                      </div>

                      <input
                        type="date"
                        name="dob"
                        className="form-control"
                        value={formData.dob}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="user-field full">
                    <div className="user-radio-group">
                      <span>Gender</span>

                      <div className="user-radio-options">
                        {["male", "female", "trans"].map((gender) => (
                          <div className="user-radio-chip" key={gender}>
                            <input
                              type="radio"
                              name="gender"
                              value={gender}
                              checked={formData.gender === gender}
                              onChange={handleChange}
                            />

                            <label>{gender}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="user-field full">
                    <label>Occupation</label>

                    <input
                      type="text"
                      name="occupation"
                      placeholder="Software Engineer, Policeman, Student, etc."
                      className="form-control"
                      value={formData.occupation}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* File Uploads */}
              <div className="user-form-section">
                <h2>File Uploads</h2>

                <p>
                  Upload a profile photo and your certificate in supported
                  formats.
                </p>

                <div className="user-form-grid">
                  <div className="user-field">
                    <label>Profile Picture</label>

                    <input
                      type="file"
                      name="profilePic"
                      className="form-control"
                      accept=".png,.jpg,.jpeg"
                      onChange={handleFileChange}
                      required
                    />
                  </div>

                  <div className="user-field">
                    <label>Covid Certificate</label>

                    <input
                      type="file"
                      name="covidCert"
                      className="form-control"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={handleFileChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="user-form-section">
                <h2>Emergency Contact</h2>

                <p>Add someone who can be contacted if needed.</p>

                <div className="user-form-grid three">
                  <div className="user-field">
                    <label>Name</label>

                    <input
                      type="text"
                      name="emContactName"
                      placeholder="Emergency Contact Name"
                      className="form-control"
                      value={formData.emContactName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="user-field">
                    <label>Relation</label>

                    <input
                      type="text"
                      name="emContactRelation"
                      placeholder="Emergency Contact Relation"
                      className="form-control"
                      value={formData.emContactRelation}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="user-field">
                    <label>Phone Number</label>

                    <div className="input-group">
                      <div className="input-group-text">+91</div>

                      <input
                        type="text"
                        name="emContactPhone"
                        placeholder="Emergency Contact Phone"
                        className="form-control"
                        value={formData.emContactPhone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="user-submit">
                <button type="submit" className="btn-primary-custom">
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

export default RegisterUser;
