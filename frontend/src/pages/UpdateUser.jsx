import React, { useState } from "react";
import "./updateUser.css";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const UpdateUser = () => {
    const [formData, setFormData] = useState({
        name: "John Doe",
        email: "john@example.com",
        phone: "",
        dob: "",
        gender: "",
        occupation: "",
        emContactName: "",
        emContactRelation: "",
        emContactPhone: "",
    });

    const [profilePic, setProfilePic] = useState(null);
    const [covidCert, setCovidCert] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = new FormData();

            Object.keys(formData).forEach((key) => {
                data.append(key, formData[key]);
            });

            if (profilePic) {
                data.append("profile-pic", profilePic);
            }

            if (covidCert) {
                data.append("covid-cert", covidCert);
            }

            await axios.post(`${backendUrl}/rider/update`, data, {
                withCredentials: true,
            });

            alert("Your data has been successfully updated!");
        } catch (error) {
            console.error(error);
            alert("Could not update your profile.");
        }
    };

    return (
        <section className="user-form-page">
            <div className="container">
                <div className="user-form-shell">

                    <div className="user-form-card user-form-hero">
                        <div className="user-form-hero-content">
                            <p className="user-form-eyebrow">User Details</p>

                            <h1>Update your rider profile.</h1>

                            <p>
                                Edit your personal details, refresh uploaded files,
                                and keep your emergency contact information up to date.
                            </p>
                        </div>
                    </div>

                    <div className="user-form-card user-form-body">

                        <form onSubmit={handleSubmit}>

                            {/* BASIC INFO */}
                            <div className="user-form-section">

                                <h2>Basic Information</h2>

                                <p>
                                    Review and update the details shown on your rider dashboard.
                                </p>

                                <div className="user-form-grid">

                                    <div className="user-field">
                                        <label>Name</label>

                                        <input
                                            type="text"
                                            name="name"
                                            className="form-control"
                                            value={formData.name}
                                            readOnly
                                        />
                                    </div>

                                    <div className="user-field">
                                        <label>Email</label>

                                        <input
                                            type="email"
                                            name="email"
                                            className="form-control"
                                            value={formData.email}
                                            readOnly
                                        />
                                    </div>

                                    <div className="user-field">
                                        <label>Phone</label>

                                        <input
                                            type="text"
                                            name="phone"
                                            className="form-control"
                                            placeholder="Enter Phone Number"
                                            value={formData.phone}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="user-field">
                                        <label>Date of Birth</label>

                                        <input
                                            type="date"
                                            name="dob"
                                            className="form-control"
                                            value={formData.dob}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="user-field full">
                                        <div className="user-radio-group">

                                            <span>Gender</span>

                                            <div className="user-radio-options">

                                                <div className="user-radio-chip">
                                                    <input
                                                        type="radio"
                                                        name="gender"
                                                        value="male"
                                                        checked={formData.gender === "male"}
                                                        onChange={handleChange}
                                                    />

                                                    <label>Male</label>
                                                </div>

                                                <div className="user-radio-chip">
                                                    <input
                                                        type="radio"
                                                        name="gender"
                                                        value="female"
                                                        checked={formData.gender === "female"}
                                                        onChange={handleChange}
                                                    />

                                                    <label>Female</label>
                                                </div>

                                                <div className="user-radio-chip">
                                                    <input
                                                        type="radio"
                                                        name="gender"
                                                        value="trans"
                                                        checked={formData.gender === "trans"}
                                                        onChange={handleChange}
                                                    />

                                                    <label>Trans</label>
                                                </div>

                                            </div>
                                        </div>
                                    </div>

                                    <div className="user-field full">
                                        <label>Occupation</label>

                                        <input
                                            type="text"
                                            name="occupation"
                                            className="form-control"
                                            placeholder="Software Engineer, Student, etc."
                                            value={formData.occupation}
                                            onChange={handleChange}
                                        />
                                    </div>

                                </div>
                            </div>

                            {/* FILE UPLOADS */}
                            <div className="user-form-section">

                                <h2>File Uploads</h2>

                                <p>
                                    Replace your existing uploads only if you want to update them.
                                </p>

                                <div className="user-form-grid">

                                    <div className="user-field">
                                        <label>Profile Picture</label>

                                        <input
                                            type="file"
                                            className="form-control"
                                            onChange={(e) =>
                                                setProfilePic(e.target.files[0])
                                            }
                                        />
                                    </div>

                                    <div className="user-field">
                                        <label>Covid Certificate</label>

                                        <input
                                            type="file"
                                            className="form-control"
                                            accept=".pdf,.png,.jpg,.jpeg"
                                            onChange={(e) =>
                                                setCovidCert(e.target.files[0])
                                            }
                                        />
                                    </div>

                                </div>
                            </div>

                            {/* EMERGENCY CONTACT */}
                            <div className="user-form-section">

                                <h2>Emergency Contact</h2>

                                <p>
                                    Keep this information updated for quick access if needed.
                                </p>

                                <div className="user-form-grid three">

                                    <div className="user-field">
                                        <label>Name</label>

                                        <input
                                            type="text"
                                            name="emContactName"
                                            className="form-control"
                                            placeholder="Emergency Contact Name"
                                            value={formData.emContactName}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="user-field">
                                        <label>Relation</label>

                                        <input
                                            type="text"
                                            name="emContactRelation"
                                            className="form-control"
                                            placeholder="Emergency Contact Relation"
                                            value={formData.emContactRelation}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="user-field">
                                        <label>Phone Number</label>

                                        <input
                                            type="text"
                                            name="emContactPhone"
                                            className="form-control"
                                            placeholder="Emergency Contact Phone"
                                            value={formData.emContactPhone}
                                            onChange={handleChange}
                                        />
                                    </div>

                                </div>
                            </div>

                            <div className="user-submit">
                                <button type="submit" className="btn-primary-custom">
                                    Save Changes
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default UpdateUser;
