import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "./searchResult.css";

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

const SearchResult = ({
  results: initialResults = [],
  query: initialQuery = {},
  isFirst: initialIsFirst = false,
  isLast: initialIsLast = false,
}) => {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState(initialResults);
  const [query, setQuery] = useState(initialQuery);
  const [isFirst, setIsFirst] = useState(initialIsFirst);
  const [isLast, setIsLast] = useState(initialIsLast);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const queryString = useMemo(
    () => searchParams.toString(),
    [searchParams]
  );

  useEffect(() => {
    modifyInput();
  }, [query.searchType]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!queryString) return;

      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await fetch(`${backendUrl}/property?${queryString}`, {
          credentials: "include",
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Could not load search results.");
        }

        setResults(data.results || []);
        setQuery(data.query || Object.fromEntries(searchParams.entries()));
        setIsFirst(Boolean(data.isFirst));
        setIsLast(Boolean(data.isLast));
      } catch (error) {
        console.log(error);
        setResults([]);
        setQuery(Object.fromEntries(searchParams.entries()));
        setErrorMessage(error.message || "Could not load search results.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [queryString, searchParams]);

  const modifyInput = () => {
    const search = document.getElementById("search-text");
    if (!search) return;

    if (query.searchType === "text") {
      search.removeAttribute("pattern");
    } else {
      search.setAttribute("pattern", "\\d{6}");
    }
  };

  const getStars = (rating) => {
    rating = Math.round(rating * 2) / 2;

    const stars = [];

    for (let i = rating; i >= 1; i--) {
      stars.push(
        <i
          key={`full-${i}`}
          className="fa fa-star"
          aria-hidden="true"
          style={{ color: "gold" }}
        ></i>
      );
    }

    if (rating % 1 !== 0) {
      stars.push(
        <i
          key="half"
          className="fa fa-star-half-o"
          aria-hidden="true"
          style={{ color: "gold" }}
        ></i>
      );
    }

    const emptyStars = Math.floor(5 - rating);

    for (let j = emptyStars; j >= 1; j--) {
      stars.push(
        <i
          key={`empty-${j}`}
          className="fa fa-star-o"
          aria-hidden="true"
          style={{ color: "gold" }}
        ></i>
      );
    }

    return stars;
  };

  return (
    <section className="search-results-page">
      <div className="container">
        <div className="search-results-shell">
          {/* HERO */}
          <div className="search-card search-hero">
            <div className="search-hero-grid">
              <div className="search-hero-copy">
                <p>Search Results</p>
                <h1>Find the right PG with cleaner comparisons.</h1>
                <p>
                  Browse structured listings, compare rate, rating, booking
                  amount, and property type quickly.
                </p>
              </div>

              <div className="search-summary">
                <div className="search-summary-stat">
                  <span className="search-summary-badge">
                    <i className="fa-solid fa-house"></i>
                  </span>

                  <div>
                    <strong>{results.length} Listings</strong>
                    <span>Currently visible for this search</span>
                  </div>
                </div>

                <div className="search-summary-stat">
                  <span className="search-summary-badge">
                    <i className="fa-solid fa-location-dot"></i>
                  </span>

                  <div>
                    <strong>{query.searchText || "Location"}</strong>
                    <span>Search target</span>
                  </div>
                </div>

                <div className="search-summary-stat">
                  <span className="search-summary-badge">
                    <i className="fa-solid fa-sliders"></i>
                  </span>

                  <div>
                    <strong>
                      {query.gender ? "Filtered" : "Open Search"}
                    </strong>

                    <span>
                      {query.gender
                        ? `Type: ${query.gender}`
                        : "All property types included"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FILTERS */}
          <div className="search-card search-filter-panel">
            <form className="search-toolbar">
              <div className="search-primary-row">
                <div className="search-field">
                  <label>Search Type</label>

                  <select
                    name="searchType"
                    className="form-select"
                    defaultValue={query.searchType || "text"}
                  >
                    <option value="text">Text</option>
                    <option value="zip">ZIP Code</option>
                  </select>
                </div>

                <div className="search-field">
                  <label>Location or ZIP</label>

                  <input
                    type="text"
                    name="searchText"
                    id="search-text"
                    className="form-control"
                    defaultValue={query.searchText}
                  />
                </div>
              </div>

              <div className="search-filter-row">
                <div className="search-field">
                  <label>Property Type</label>

                  <select
                    name="gender"
                    className="form-select"
                    defaultValue={query.gender || ""}
                  >
                    <option value="">All Types</option>
                    <option value="co">Co-Living</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                <div className="search-field">
                  <label>Minimum Rating</label>

                  <select
                    name="rating"
                    className="form-select"
                    defaultValue={query.rating || ""}
                  >
                    <option value="">Any Rating</option>
                    <option value="1">1 star+</option>
                    <option value="2">2 star+</option>
                    <option value="3">3 star+</option>
                    <option value="4">4 star+</option>
                    <option value="5">5 star</option>
                  </select>
                </div>

                <div className="search-field">
                  <label>Maximum Rate</label>

                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fa-solid fa-rupee"></i>
                    </span>

                    <input
                      type="number"
                      name="rate"
                      className="form-control"
                      defaultValue={query.rate}
                      placeholder="Enter max price"
                    />
                  </div>
                </div>

                <div className="search-sort">
                  <label>Sort by Price</label>

                  <div className="search-sort-options">
                    <div className="form-check">
                      <input
                        type="radio"
                        name="sort"
                        value="asc"
                        defaultChecked={query.sort === "asc"}
                      />
                      <label>Low to High</label>
                    </div>

                    <div className="form-check">
                      <input
                        type="radio"
                        name="sort"
                        value="desc"
                        defaultChecked={query.sort === "desc"}
                      />
                      <label>High to Low</label>
                    </div>
                  </div>
                </div>

                <div className="search-submit-wrap">
                  <button type="submit" className="btn btn-primary">
                    Find Homes
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* RESULTS */}
          <div className="search-card search-results-panel">
            <div className="search-results-top">
              <div className="search-section-intro">
                <p>Available PGs</p>
                <h2>Structured listings for faster browsing.</h2>

                <p className="search-meta-text">
                  Compare the most important details at a glance.
                </p>
              </div>

              <div className="search-query-badge">
                Search:
                <strong>{query.searchText || "All"}</strong>
              </div>
            </div>

            {isLoading ? (
              <div className="empty-search-state">
                <div className="empty-search-copy">
                  <h2>Loading matching PGs...</h2>
                  <p>Please wait while we fetch current listings.</p>
                </div>
              </div>
            ) : errorMessage ? (
              <div className="empty-search-state">
                <div className="empty-search-copy">
                  <h2>Could not load PGs.</h2>
                  <p>{errorMessage}</p>
                </div>
              </div>
            ) : results.length === 0 ? (
              <div className="empty-search-state">
                <img
                  src="/images/no-result-found.png"
                  alt="No results"
                />

                <div className="empty-search-copy">
                  <h2>No matching PGs found yet.</h2>

                  <p>
                    There are no properties matching your current filters.
                  </p>

                  <div className="empty-search-actions">
                    <button className="btn btn-primary">
                      Browse Cities
                    </button>

                    <button className="btn btn-outline-primary">
                      Clear Filters
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <ul className="results-grid">
                  {results.map((res) => {
                    const safeMapUrl = normalizeExternalUrl(res.exactLocationLink);

                    return (
                    <li key={res._id || res.id}>
                      <article className="result-card">
                        <img
                          src={
                            (res.images && res.images[0]) ||
                            "/images/house-fallback.svg"
                          }
                          alt={res.name}
                          className="result-card-image"
                        />

                        <div className="result-card-body">
                          <div className="result-card-top">
                            <div>
                              <h3>{res.name}</h3>

                              <p className="result-card-address">
                                {res.address?.addL1},{" "}
                                {res.address?.city},{" "}
                                {res.address?.state}
                              </p>
                            </div>

                            <span className="result-pill">
                              {res.type === "co"
                                ? "Co-Living"
                                : res.type}
                            </span>
                          </div>

                          <div className="result-highlights">
                            <div className="result-highlight">
                              <span>Monthly Rate</span>
                              <strong>₹ {res.rate}</strong>
                            </div>

                            <div className="result-highlight">
                              <span>Booking Amount</span>
                              <strong>₹ {res.bookingMoney}</strong>
                            </div>

                            <div className="result-highlight">
                              <span>Rating</span>

                              <strong>{getStars(res.rating)}</strong>
                            </div>

                            <div className="result-highlight">
                              <span>Interested</span>
                              <strong>{res.interested} people</strong>
                            </div>

                            <div className="result-highlight">
                              <span>Property ID</span>
                              <strong>{res.id}</strong>
                            </div>

                            <div className="result-highlight">
                              <span>Operating Since</span>
                              <strong>{res.since}</strong>
                            </div>
                          </div>

                          <div className="result-card-footer">
                            <div className="result-card-links">
                              <Link to={`/property/${res._id || res.id}`} className="btn btn-primary">
                                View Property
                              </Link>

                              {safeMapUrl && (
                                <a
                                  href={safeMapUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="btn btn-outline-primary"
                                >
                                  Map Pin
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </article>
                    </li>
                  );
                  })}
                </ul>

                <nav className="search-pagination">
                  <ul className="pagination justify-content-end">
                    <li className="page-item">
                      <button
                        className={`page-link ${
                          isFirst ? "disabled" : ""
                        }`}
                      >
                        Previous
                      </button>
                    </li>

                    <li className="page-item">
                      <button
                        className={`page-link ${
                          isLast ? "disabled" : ""
                        }`}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchResult;
