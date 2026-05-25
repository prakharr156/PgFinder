
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./editPg.css";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const EditPg = ({ property }) => {
    const address = property?.address || {};

    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    const [formData, setFormData] = useState({
        name: property?.name || "",
        tagLine: property?.tagline || "",
        maxOccupancy: property?.maxOcc || "",
        availableRooms: property?.availableRooms || "",
        since: property?.since || "",
        desc: property?.desc || "",
        type: property?.type || "",
        occupancy: property?.occupancy || [],
        addBuilding: address?.building || "",
        addL1: address?.addL1 || "",
        addL2: address?.addL2 || "",
        landmark: address?.landmark || "",
        state: address?.state || "",
        city: address?.city || "",
        zipCode: address?.zipcode || "",
        exactLocationLink: property?.exactLocationLink || "",
        amenities:
            property?.amenities?.map((a) => a.name) || [],
        rules:
            property?.rules
                ?.filter((r) => r.allowed)
                ?.map((r) => r.name) || [],
        food: property?.food || [],
        otherCharges: property?.otherCharges || [],
        rate: property?.rate || "",
        bookingMoney: property?.bookingMoney || "",
    });

    const [images, setImages] = useState([]);
    const [videos, setVideos] = useState([]);

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
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCheckbox = (e) => {
        const { name, value, checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: checked
                ? [...prev[name], value]
                : prev[name].filter((item) => item !== value),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (images.length > 20) {
            alert("Maximum 20 images allowed");
            return;
        }

        if (videos.length > 5) {
            alert("Maximum 5 videos allowed");
            return;
        }

        const submitData = new FormData();

        Object.keys(formData).forEach((key) => {
            if (Array.isArray(formData[key])) {
                formData[key].forEach((item) => {
                    submitData.append(key, item);
                });
            } else {
                submitData.append(key, formData[key]);
            }
        });

        for (const img of images) {
            submitData.append("property-image", img);
        }

        for (const vid of videos) {
            submitData.append("property-videos", vid);
        }

        try {
            await axios.patch(
                `${backendUrl}/property/${property.id}`,
                submitData,
                {
                    withCredentials: true,
                }
            );

            alert("Property updated successfully");

            window.location.href = `/property/${property.id}`;
        } catch (err) {
            console.log(err);
            alert("Could not update property");
        }
    };

    return (
        <section className="pg-form-page">
            <div className="container">
                <div className="pg-form-shell">

                    <div className="pg-form-card pg-form-hero">
                        <div className="pg-form-hero-grid">

                            <div>
                                <p className="pg-form-eyebrow">
                                    Property Details
                                </p>

                                <h1>Edit your PG listing.</h1>

                                <p>
                                    Update every part of the listing:
                                    property details, exact location,
                                    rules, amenities, pricing, and images.
                                </p>
                            </div>

                            <div className="pg-hero-stat">
                                <h2>Editing Checklist</h2>

                                <p>
                                    Refresh address, pricing,
                                    images and location link.
                                </p>
                            </div>

                        </div>
                    </div>

                    <div className="pg-form-card pg-form-body">

                        <form onSubmit={handleSubmit}>

                            <div className="pg-form-grid">

                                <div className="pg-field">
                                    <label>PG Name</label>

                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                                </div>

                                <div className="pg-field">
                                    <label>Tag Line</label>

                                    <input
                                        type="text"
                                        name="tagLine"
                                        value={formData.tagLine}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                                </div>

                                <div className="pg-field">
                                    <label>State</label>

                                    <select
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        className="form-select"
                                    >
                                        <option value="">
                                            Select State
                                        </option>

                                        {states.map((state) => (
                                            <option
                                                key={state}
                                                value={state}
                                            >
                                                {state}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="pg-field">
                                    <label>City</label>

                                    <select
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className="form-select"
                                    >
                                        <option value="">
                                            Select City
                                        </option>

                                        {cities.map((city) => (
                                            <option
                                                key={city}
                                                value={city}
                                            >
                                                {city}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="pg-field full">
                                    <label>Description</label>

                                    <textarea
                                        rows="5"
                                        name="desc"
                                        value={formData.desc}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                                </div>

                            </div>

                            <div className="pg-chip-group">

                                <span>Amenities</span>

                                <div className="pg-chip-list">

                                    {[
                                        "wifi",
                                        "power-backup",
                                        "room-cleaning",
                                        "tv",
                                        "lift",
                                        "laundary",
                                        "fridge",
                                    ].map((item) => (

                                        <div
                                            className="pg-chip"
                                            key={item}
                                        >
                                            <input
                                                type="checkbox"
                                                name="amenities"
                                                value={item}
                                                checked={formData.amenities.includes(item)}
                                                onChange={handleCheckbox}
                                            />

                                            <label>{item}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pg-field">
                                <label>Images</label>

                                <input
                                    type="file"
                                    multiple
                                    className="form-control"
                                    onChange={(e) =>
                                        setImages(e.target.files)
                                    }
                                />
                            </div>

                            <div className="pg-field">
                                <label>Videos</label>

                                <input
                                    type="file"
                                    multiple
                                    className="form-control"
                                    onChange={(e) =>
                                        setVideos(e.target.files)
                                    }
                                />
                            </div>

                            <div className="pg-submit">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                >
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

export default EditPg;
