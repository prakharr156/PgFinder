
import React, { useState } from "react";
import "./searchHome.css";

const SearchHome = ({ topProperty = [] }) => {
    const [searchType, setSearchType] = useState("text");
    const [searchText, setSearchText] = useState("");

    const cityCards = [
        { name: "Bengaluru", image: "/images/bengaluru.jpg" },
        { name: "Pune", image: "/images/pune.png" },
        { name: "Hyderabad", image: "/images/hyderabad.webp" },
        { name: "Gurgaon", image: "/images/gurgaon.jpg" },
        { name: "Noida", image: "/images/noida.jpg" },
        { name: "Mumbai", image: "/images/mumbai.jpg" },
        { name: "Chennai", image: "/images/chennai.jpg" },
        { name: "Delhi", image: "/images/delhi.jpg" },
        { name: "Ahmedabad", image: "/images/ahmedabad.jpg" },
        { name: "Kolkata", image: "/images/kolkata.jpeg" },
        { name: "Jaipur", image: "/images/jaipur.jpg" },
        { name: "Bhopal", image: "/images/bhopal.jpg" },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();

        const params = new URLSearchParams({
            searchType,
            searchText,
        });

        window.location.href = `/property?${params.toString()}`;
    };

    return (
        <section className="search-home-page">
            <div className="container">
                <section className="search-hero">
                    <div className="search-hero-copy">
                        <p>Find Your Next Stay</p>

                        <h1>
                            Search homes across top cities with a calmer start.
                        </h1>

                        <blockquote>
                            "Where you live determines how you live. What you do
                            determines how well you live."
                        </blockquote>

                        <p className="quote-author">Lou Holtz</p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="search-searchbox"
                    >
                        <div className="row g-2 align-items-center">
                            <div className="col-sm-3">
                                <select
                                    value={searchType}
                                    onChange={(e) =>
                                        setSearchType(e.target.value)
                                    }
                                    className="form-select"
                                >
                                    <option value="text">Text</option>
                                    <option value="zip">ZIP Code</option>
                                </select>
                            </div>

                            <div className="col-sm-6">
                                <input
                                    type="text"
                                    value={searchText}
                                    onChange={(e) =>
                                        setSearchText(e.target.value)
                                    }
                                    className="form-control"
                                    placeholder={
                                        searchType === "text"
                                            ? "Search by city, area, or ZIP code"
                                            : "Enter 6-digit ZIP code"
                                    }
                                    minLength={
                                        searchType === "text" ? 2 : 6
                                    }
                                    maxLength={
                                        searchType === "text" ? 32 : 6
                                    }
                                    pattern={
                                        searchType === "zip"
                                            ? "\\d{6}"
                                            : undefined
                                    }
                                    required
                                />
                            </div>

                            <div className="col-sm-3 d-grid">
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                >
                                    Find Homes
                                </button>
                            </div>
                        </div>
                    </form>
                </section>

                <section className="search-section">
                    <div className="search-section-head">
                        <p>Top Cities</p>

                        <h2>
                            Browse by city before you narrow the details.
                        </h2>

                        <p>
                            Jump into the cities people search most often and
                            start from a cleaner, more direct shortlist.
                        </p>
                    </div>

                    <div className="city-grid">
                        {cityCards.map((city, index) => (
                            <a
                                key={index}
                                href={`/property?searchType=text&searchText=${encodeURIComponent(city.name)}`}
                                className="city-card"
                            >
                                <img
                                    src={city.image}
                                    alt={city.name}
                                />

                                <div className="city-card-body">
                                    <h3>{city.name}</h3>

                                    <p>
                                        Explore PGs in {city.name}
                                    </p>
                                </div>
                            </a>
                        ))}
                    </div>
                </section>

                <section className="search-section">
                    <div className="search-section-head">
                        <p>Top Properties</p>

                        <h2>
                            Featured properties worth checking first.
                        </h2>

                        <p>
                            These highlighted stays surface first when curated
                            data is available, so the page stays useful even
                            before a full search.
                        </p>
                    </div>

                    {topProperty.length ? (
                        <div className="property-grid">
                            {topProperty.map((prop, index) => (
                                <a
                                    key={index}
                                    href={`/property/${prop.id}`}
                                    className="property-card"
                                >
                                    <img
                                        src={prop.img}
                                        alt={prop.name}
                                    />

                                    <div className="property-card-body">
                                        <h3>{prop.name}</h3>

                                        <p>
                                            Open property details and continue
                                            to the full listing page.
                                        </p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-properties">
                            Top properties are not available yet. You can still
                            search by city or ZIP code above.
                        </div>
                    )}
                </section>
            </div>
        </section>
    );
};

export default SearchHome;
