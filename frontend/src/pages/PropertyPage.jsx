import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./propertyPage.css";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

function normalizeExternalUrl(value) {
  const rawValue = String(value || "").trim();

  if (!rawValue) return "";
  if (/^https?:\/\//i.test(rawValue)) return rawValue;
  if (/^(www\.|maps\.app\.goo\.gl|goo\.gl|maps\.google\.)/i.test(rawValue)) {
    return `https://${rawValue}`;
  }

  return "";
}

const PropertyPage = ({ property }) => {
  const { id } = useParams();
  const [loadedProperty, setLoadedProperty] = useState(property || null);
  const [mainImage, setMainImage] = useState(
    property?.images?.[0] || "/images/house-fallback.svg"
  );
  const [isLoading, setIsLoading] = useState(!property);
  const [errorMessage, setErrorMessage] = useState("");

  const currentProperty = property || loadedProperty;
  const safeMapUrl = normalizeExternalUrl(currentProperty?.exactLocationLink);

  useEffect(() => {
    if (property?.images?.[0]) {
      setMainImage(property.images[0]);
    }
  }, [property]);

  useEffect(() => {
    const fetchProperty = async () => {
      if (property || !id) return;

      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await fetch(`${backendUrl}/property/${id}`, {
          credentials: "include",
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Could not load property details.");
        }

        setLoadedProperty(data.property);
        setMainImage(data.property?.images?.[0] || "/images/house-fallback.svg");
      } catch (error) {
        console.log(error);
        setErrorMessage(error.message || "Could not load property details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [id, property]);

  const propertyType =
    currentProperty?.type === "co"
      ? "Co-Living"
      : currentProperty?.type === "male"
        ? "Male"
        : currentProperty?.type === "female"
          ? "Female"
          : "Not specified";

  const occupancyLabel =
    currentProperty?.occupancy?.length > 0
      ? currentProperty.occupancy
          .map((value) => value.charAt(0).toUpperCase() + value.slice(1))
          .join(", ")
      : "Not specified";

  if (isLoading) {
    return (
      <section className="property-page">
        <div className="container">
          <div className="property-shell">
            <div className="property-card property-empty">
              Loading property details...
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (errorMessage || !currentProperty) {
    return (
      <section className="property-page">
        <div className="container">
          <div className="property-shell">
            <div className="property-card property-empty">
              <h2>Property not found.</h2>
              <p>{errorMessage || "This property could not be loaded."}</p>
              <Link to="/property/search" className="btn btn-primary">
                Back to Search
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="property-page">
      <div className="container">
        <div className="property-shell">
          <div className="property-card property-hero">
            <div className="property-hero-grid">
              <div className="property-media">
                <img
                  src={mainImage}
                  alt={currentProperty?.name || "Property"}
                  className="property-main-image"
                />

                {currentProperty?.images?.length > 0 && (
                  <div className="property-gallery">
                    {currentProperty.images.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt="property"
                        onClick={() => setMainImage(img)}
                      />
                    ))}
                  </div>
                )}

                {currentProperty?.videos?.length > 0 && (
                  <div className="property-videos-section">
                    <span className="property-videos-label">Videos</span>
                    <div className="property-videos-gallery">
                      {currentProperty.videos.map((video, index) => (
                        <video key={index} controls className="property-video">
                          <source src={video} type="video/mp4" />
                        </video>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="property-copy">
                <p>Property Details</p>
                <h1>{currentProperty?.name || "Untitled property"}</h1>

                <div className="property-address">
                  {[
                    currentProperty?.address?.addL1,
                    currentProperty?.address?.city,
                    currentProperty?.address?.state,
                  ].filter(Boolean).join(", ") || "Address not added"}
                </div>

                {currentProperty?.tagline && (
                  <div className="property-tagline">
                    {currentProperty.tagline}
                  </div>
                )}

                <p className="property-description">
                  {currentProperty?.desc || "No description added yet."}
                </p>

                <div className="property-pill-row">
                  <span className="property-pill">{propertyType}</span>
                  <span className="property-pill">
                    Rs. {currentProperty?.rate || 0} / month
                  </span>
                  <span className="property-pill">
                    {currentProperty?.maxOcc || 0} max occupancy
                  </span>
                  <span className="property-pill">
                    {currentProperty?.availableRooms || 0} rooms available
                  </span>
                  <span className="property-pill">
                    {currentProperty?.since || "Year not added"} onwards
                  </span>
                </div>

                <div className="property-actions">
                  <Link
                    to={`/booking/${currentProperty._id || currentProperty.id}/new`}
                    className="btn-primary"
                  >
                    Book Now
                  </Link>

                  {safeMapUrl && (
                    <a
                      href={safeMapUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-outline"
                    >
                      Open Map
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="property-card property-stats-panel">
            <div className="property-stats-grid">
              <div className="property-stat">
                <span>Owner</span>
                <strong>{currentProperty?.owner?.name || "Not available"}</strong>
              </div>
              <div className="property-stat">
                <span>Rate</span>
                <strong>Rs. {currentProperty?.rate || 0}</strong>
              </div>
              <div className="property-stat">
                <span>Booking Amount</span>
                <strong>Rs. {currentProperty?.bookingMoney || 0}</strong>
              </div>
              <div className="property-stat">
                <span>Rooms Available</span>
                <strong>{currentProperty?.availableRooms || 0}</strong>
              </div>
              <div className="property-stat">
                <span>Rating</span>
                <strong>{currentProperty?.rating || 0} star</strong>
              </div>
              <div className="property-stat">
                <span>Occupancy</span>
                <strong>{occupancyLabel}</strong>
              </div>
            </div>
          </div>

          <div className="property-card property-about-panel">
            <div className="property-section-head">
              <p>Stay Snapshot</p>
              <h2>What this PG offers.</h2>
            </div>

            <div className="property-about-grid">
              <div className="property-about-card">
                <h3>Amenities</h3>
                <div className="property-feature-grid">
                  {currentProperty?.amenities?.length ? (
                    currentProperty.amenities.map((item, index) => (
                      <div className="property-feature-item" key={index}>
                        <img src={`/${item.path}.svg`} alt={item.name} />
                        <div>
                          <strong>{item.name}</strong>
                          <span>Included in stay</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="property-empty">No amenities added.</div>
                  )}
                </div>
              </div>

              <div className="property-about-card">
                <h3>House Rules</h3>
                <div className="property-feature-grid">
                  {currentProperty?.rules?.length ? (
                    currentProperty.rules.map((item, index) => (
                      <div className="property-feature-item" key={index}>
                        <img src={`/${item.path}.svg`} alt={item.name} />
                        <div>
                          <strong>{item.name}</strong>
                          <span>{item.allowed ? "Allowed" : "Not Allowed"}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="property-empty">No rules added.</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="property-card property-review-panel">
            <div className="property-section-head">
              <p>Reviews</p>
              <h2>What residents are saying.</h2>
            </div>

            {currentProperty?.reviews?.length > 0 ? (
              <div className="property-review-list">
                {currentProperty.reviews.map((review, index) => (
                  <div className="property-review-item" key={index}>
                    <div className="property-review-head">
                      <span>
                        By <strong>{review?.userID?.name || "Resident"}</strong>
                      </span>
                      <span>{review?.rating || 0} star</span>
                    </div>
                    <div className="property-review-body">
                      <p>{review?.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="property-empty">No reviews yet.</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PropertyPage;
