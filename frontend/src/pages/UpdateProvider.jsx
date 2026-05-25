// UpdateProvider.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './updateProvider.css';

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const UpdateProvider = ({ userInfo, userRoleID, addFlash }) => {
    const address = userInfo?.address || {};

    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    const [profilePreview, setProfilePreview] = useState(
        userInfo?.profilePic || '/images/man.svg'
    );

    const [formData, setFormData] = useState({
        phone: userInfo?.phone || '',
        dob: userInfo?.dob
            ? new Date(userInfo.dob).toISOString().split('T')[0]
            : '',
        gst: userInfo?.gst || '',
        licenseValidUpto: userInfo?.licenseValidUpto
            ? new Date(userInfo.licenseValidUpto)
                  .toISOString()
                  .split('T')[0]
            : '',
        addBuilding: address?.building || '',
        addL1: address?.addL1 || '',
        addL2: address?.addL2 || '',
        landmark: address?.landmark || '',
        state: address?.state || '',
        city: address?.city || '',
        zipCode: address?.zipcode || '',
    });

    const [profilePic, setProfilePic] = useState(null);
    const [licenseFile, setLicenseFile] = useState(null);

    useEffect(() => {
        fetchStates();
    }, []);

    useEffect(() => {
        if (formData.state) {
            fetchCities(formData.state);
        }
    }, [formData.state]);

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

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleProfileChange = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        setProfilePic(file);
        setProfilePreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const sendData = new FormData();

            Object.keys(formData).forEach((key) => {
                sendData.append(key, formData[key]);
            });

            if (profilePic) {
                sendData.append('profile-pic', profilePic);
            }

            if (licenseFile) {
                sendData.append('license-validity', licenseFile);
            }

            await axios.post(
                `${backendUrl}/provider/${userRoleID}?_method=patch`,
                sendData,
                {
                    withCredentials: true,
                }
            );

            addFlash &&
                addFlash(
                    'success',
                    'Your data has been successfully updated!'
                );

            setTimeout(() => {
                window.location = `/provider/${userRoleID}`;
            }, 2000);
        } catch (error) {
            const errors = error.response?.data?.errors;

            if (errors && errors.length > 0) {
                errors.forEach((err) => {
                    addFlash && addFlash('error', err.msg);
                });
                return;
            }

            const message =
                error.response?.data?.error ||
                error.message ||
                'Could not update your profile.';

            addFlash && addFlash('error', message);
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

                                <h1>Update your provider profile.</h1>

                                <p>
                                    Refresh your account photo, business
                                    details, and license information so your
                                    dashboard stays complete and trustworthy.
                                </p>
                            </div>

                            <div className="provider-profile-card">
                                <img
                                    src={profilePreview}
                                    alt="Provider"
                                    className="provider-avatar"
                                />

                                <h2>{userInfo?.name}</h2>

                                <p>Property Provider</p>
                            </div>
                        </div>
                    </div>

                    <div className="provider-form-card provider-form-body">

                        <form onSubmit={handleSubmit}>

                            <div className="provider-form-section">
                                <h2>Basic Information</h2>

                                <p>
                                    Review the information shown on your
                                    provider dashboard.
                                </p>

                                <div className="provider-form-grid">

                                    <div className="provider-field">
                                        <label>Name</label>

                                        <input
                                            type="text"
                                            value={userInfo?.name}
                                            readOnly
                                        />
                                    </div>

                                    <div className="provider-field">
                                        <label>Email</label>

                                        <input
                                            type="text"
                                            value={userInfo?.email}
                                            readOnly
                                        />
                                    </div>

                                    <div className="provider-field">
                                        <label>Phone</label>

                                        <div className="provider-input-group">
                                            <span>+91</span>

                                            <input
                                                type="text"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
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
                                            required
                                        />
                                    </div>

                                    <div className="provider-field">
                                        <label>Provider Photo</label>

                                        <input
                                            type="file"
                                            accept=".png,.jpg,.jpeg"
                                            onChange={handleProfileChange}
                                        />

                                        <p className="provider-file-note">
                                            Upload only if you want to replace
                                            the existing profile photo.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="provider-form-section">
                                <h2>License Information</h2>

                                <p>
                                    Replace the certificate only when needed.
                                </p>

                                <div className="provider-form-grid">

                                    <div className="provider-field">
                                        <label>
                                            License Certificate
                                        </label>

                                        <input
                                            type="file"
                                            onChange={(e) =>
                                                setLicenseFile(
                                                    e.target.files[0]
                                                )
                                            }
                                        />
                                    </div>

                                    <div className="provider-field">
                                        <label>
                                            License Valid Upto
                                        </label>

                                        <input
                                            type="date"
                                            name="licenseValidUpto"
                                            value={
                                                formData.licenseValidUpto
                                            }
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="provider-form-section">
                                <h2>Address Details</h2>

                                <p>
                                    Keep your business location aligned with
                                    your latest records.
                                </p>

                                <div className="provider-form-grid three">

                                    <div className="provider-field full">
                                        <label>Building Address</label>

                                        <input
                                            type="text"
                                            name="addBuilding"
                                            value={
                                                formData.addBuilding
                                            }
                                            onChange={handleChange}
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
                                            <option value="">
                                                Select State
                                            </option>

                                            {states.map((state, index) => (
                                                <option
                                                    key={index}
                                                    value={state}
                                                >
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
                                            <option value="">
                                                Select City
                                            </option>

                                            {cities.map((city, index) => (
                                                <option
                                                    key={index}
                                                    value={city}
                                                >
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
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="provider-submit">
                                <button type="submit">
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

export default UpdateProvider;
