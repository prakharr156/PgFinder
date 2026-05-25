import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./registerPg.css";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const RegisterPg = () => {
  const navigate = useNavigate();
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    tagLine: "",
    maxOccupancy: "",
    availableRooms: "",
    since: "",
    desc: "",
    type: "",
    occupancy: [],
    addBuilding: "",
    addL1: "",
    addL2: "",
    landmark: "",
    state: "",
    city: "",
    zipCode: "",
    exactLocationLink: "",
    rate: "",
    bookingMoney: "",
  });
  const [propertyImages, setPropertyImages] = useState([]);
  const [propertyVideos, setPropertyVideos] = useState([]);

  useEffect(() => {
    fetch(`${backendUrl}/state-list`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setStates(data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleStateChange = async (e) => {
    const value = e.target.value;
    setSelectedState(value);

    if (!value) {
      setCities([]);
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/city/${value}`, {
        credentials: "include",
      });
      const data = await response.json();
      setCities(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: checked
        ? [...prevData[name], value]
        : prevData[name].filter((item) => item !== value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submitData = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => submitData.append(key, item));
      } else {
        submitData.append(key, value);
      }
    });

    for (const image of propertyImages) {
      submitData.append("property-image", image);
    }

    for (const video of propertyVideos) {
      submitData.append("property-videos", video);
    }

    try {
      const response = await fetch(`${backendUrl}/property`, {
        method: "POST",
        credentials: "include",
        body: submitData,
      });

      if (response.ok) {
        const data = await response.json();
        alert("PG registered successfully!");
        navigate(`/property/${data.propertyCreated?._id || data.propertyCreated?.id}`);
      } else {
        const data = await response.json().catch(() => ({}));
        const message =
          data?.errors?.map((error) => error.msg).join("\n") ||
          data?.error ||
          "Failed to register PG. Please try again.";
        alert(message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <section className="pg-form-page">
      <div className="container">
        <div className="pg-form-shell">
          {/* HERO */}
          <div className="pg-form-card pg-form-hero">
            <div className="pg-form-hero-grid">
              <div>
                <p className="pg-form-eyebrow">Property Details</p>
                <h1>Register your PG listing.</h1>
                <p>
                  Create a property page that feels complete from day one: clear
                  details, exact location, rules, pricing, and strong visuals.
                </p>
              </div>
              <div className="pg-hero-stat">
                <h2>Listing Checklist</h2>
                <p>
                  Add a Google Maps pin, describe the stay properly, upload
                  images, and include charges and rules.
                </p>
              </div>
            </div>
          </div>

          {/* FORM */}
          <div className="pg-form-card pg-form-body">
            <form className="validation-required" onSubmit={handleSubmit} noValidate>
              {/* BASIC INFO */}
              <div className="pg-form-section">
                <h2>Basic Information</h2>
                <p>Start with the essentials riders see first.</p>
                <div className="pg-form-grid">
                  <div className="pg-field">
                    <label>PG Name</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter PG name"
                      className="form-control"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="pg-field">
                    <label>Tag Line</label>
                    <input
                      type="text"
                      name="tagLine"
                      placeholder="Safe stay near campus"
                      className="form-control"
                      value={formData.tagLine}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="pg-field">
                    <label>Max Occupancy</label>
                    <input
                      type="number"
                      name="maxOccupancy"
                      className="form-control"
                      value={formData.maxOccupancy}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="pg-field">
                    <label>Available Rooms</label>
                    <input
                      type="number"
                      name="availableRooms"
                      className="form-control"
                      value={formData.availableRooms}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="pg-field">
                    <label>Operating Since</label>
                    <input
                      type="number"
                      name="since"
                      className="form-control"
                      value={formData.since}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="pg-field full">
                    <label>Description</label>
                    <textarea
                      rows="5"
                      name="desc"
                      className="form-control"
                      placeholder="Describe your property"
                      value={formData.desc}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* PROPERTY TYPE */}
              <div className="pg-form-section">
                <h2>Property Type</h2>
                <div className="pg-chip-list">
                  <div className="pg-chip">
                    <input
                      type="radio"
                      name="type"
                      value="male"
                      checked={formData.type === "male"}
                      onChange={handleInputChange}
                    />
                    <label>Male</label>
                  </div>

                  <div className="pg-chip">
                    <input
                      type="radio"
                      name="type"
                      value="female"
                      checked={formData.type === "female"}
                      onChange={handleInputChange}
                    />
                    <label>Female</label>
                  </div>

                  <div className="pg-chip">
                    <input
                      type="radio"
                      name="type"
                      value="co"
                      checked={formData.type === "co"}
                      onChange={handleInputChange}
                    />
                    <label>Co-Living</label>
                  </div>
                </div>
              </div>

              <div className="pg-form-section">
                <h2>Occupancy</h2>
                <div className="pg-chip-list">
                  <div className="pg-chip">
                    <input
                      type="checkbox"
                      name="occupancy"
                      value="single"
                      checked={formData.occupancy.includes("single")}
                      onChange={handleCheckboxChange}
                    />
                    <label>Single</label>
                  </div>

                  <div className="pg-chip">
                    <input
                      type="checkbox"
                      name="occupancy"
                      value="double"
                      checked={formData.occupancy.includes("double")}
                      onChange={handleCheckboxChange}
                    />
                    <label>Double</label>
                  </div>
                </div>
              </div>

              {/* ADDRESS */}
              <div className="pg-form-section">
                <h2>Address Details</h2>
                <div className="pg-form-grid three">
                  <div className="pg-field full">
                    <label>Building Address</label>
                    <input
                      type="text"
                      name="addBuilding"
                      className="form-control"
                      value={formData.addBuilding}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="pg-field">
                    <label>Address Line 1</label>
                    <input
                      type="text"
                      name="addL1"
                      className="form-control"
                      value={formData.addL1}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="pg-field">
                    <label>Address Line 2</label>
                    <input
                      type="text"
                      name="addL2"
                      className="form-control"
                      value={formData.addL2}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="pg-field">
                    <label>Landmark</label>
                    <input
                      type="text"
                      name="landmark"
                      className="form-control"
                      value={formData.landmark}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="pg-field">
                    <label>State</label>
                    <select
                      className="form-select"
                      name="state"
                      value={selectedState}
                      onChange={(e) => {
                        handleStateChange(e);
                        handleInputChange(e);
                      }}
                    >
                      <option value="">Select state</option>
                      {states.map((state, index) => (
                        <option key={index} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="pg-field">
                    <label>City</label>
                    <select
                      className="form-select"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                    >
                      <option value="">Select city</option>
                      {cities.map((city, index) => (
                        <option key={index} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="pg-field">
                    <label>Zip Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      className="form-control"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="pg-field full">
                    <label>Exact Google Maps Pin Link</label>
                    <input
                      type="text"
                      name="exactLocationLink"
                      className="form-control"
                      value={formData.exactLocationLink}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              {/* MONEY */}
              <div className="pg-form-section">
                <h2>Money Details</h2>
                <div className="pg-form-grid">
                  <div className="pg-field">
                    <label>Rate Per Month</label>
                    <input
                      type="number"
                      name="rate"
                      className="form-control"
                      value={formData.rate}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="pg-field">
                    <label>Booking Amount</label>
                    <input
                      type="number"
                      name="bookingMoney"
                      className="form-control"
                      value={formData.bookingMoney}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              {/* FILES */}
              <div className="pg-form-section">
                <h2>Images & Videos</h2>
                <div className="pg-gallery-upload">
                  <div className="pg-field">
                    <label>Property Images</label>
                    <input
                      type="file"
                      name="property-image"
                      multiple
                      className="form-control"
                      onChange={(e) => setPropertyImages(Array.from(e.target.files))}
                    />
                  </div>
                </div>

                <div
                  className="pg-gallery-upload"
                  style={{ marginTop: "1rem" }}
                >
                  <div className="pg-field">
                    <label>Property Videos</label>
                    <input
                      type="file"
                      name="property-videos"
                      multiple
                      className="form-control"
                      onChange={(e) => setPropertyVideos(Array.from(e.target.files))}
                    />
                  </div>
                </div>
              </div>

              <div className="pg-submit">
                <button type="submit" className="btn btn-primary">
                  Register PG
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterPg;
