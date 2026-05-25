import "./home.css";

export default function Home() {
  return (
    <section className="overflow-x-hidden">

      {/* HERO SECTION */}
      <section id="hero" className="hero-section">
        <div className="container">
          <div className="hero-shell">
            <div className="row align-items-center g-4">

              <div className="col-lg-6">
                <div className="hero-copy">
                  <p className="hero-eyebrow">StayVista</p>

                  <h1>
                    Welcome to <span>StayVista</span>
                  </h1>

                  <p>
                    A softer, simpler way to explore PGs and hostels
                    across cities, compare the details that matter,
                    and move toward booking with more confidence.
                  </p>

                  <div className="hero-actions">
                    <a
                      href="/property/search"
                      className="btn btn-primary hero-primary-btn"
                    >
                      Search PGs
                    </a>

                    <span className="hero-inline-note">
                      Search, compare, review, and book in one place.
                    </span>
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="hero-visual">
                  <div className="hero-visual-card">
                    <img
                      src="/images/stayvista-logo.png"
                      alt="StayVista logo"
                      className="img-fluid"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="about-section">
        <div className="container">

          <div className="about-shell row g-0 align-items-stretch">

            <div className="col-lg-7">
              <div className="about-copy">

                <p className="about-eyebrow">About Us</p>

                <h2>
                  Designed to make PG hunting feel simple.
                </h2>

                <p className="about-lead">
                  Whether you're a student, a working professional,
                  or someone relocating to a new city, StayVista helps
                  you find a place that feels right without wasting time
                  on scattered listings.
                </p>

                <p className="about-body">
                  Search across cities, compare options, review
                  amenities, and move from discovery to booking in
                  one place.
                </p>

                <div className="about-points">

                  <div className="about-point">
                    <i className="fa-solid fa-shield-halved"></i>

                    <span>
                      Each listed PG owner goes through a verification
                      process before their property is presented.
                    </span>
                  </div>

                  <div className="about-point">
                    <i className="fa-solid fa-filter-circle-check"></i>

                    <span>
                      Listings are reviewed regularly so outdated
                      options can be filtered out quickly.
                    </span>
                  </div>

                  <div className="about-point">
                    <i className="fa-solid fa-headset"></i>

                    <span>
                      Support stays available when users need help
                      with search or booking.
                    </span>
                  </div>

                </div>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="about-panel">

                <div className="about-stat-grid">

                  <div className="about-stat">
                    <strong>City-wise</strong>
                    <span>
                      Explore listings across multiple cities.
                    </span>
                  </div>

                  <div className="about-stat">
                    <strong>Preference-led</strong>
                    <span>
                      Filter by budget, amenities, and stay needs.
                    </span>
                  </div>

                  <div className="about-stat">
                    <strong>Review-ready</strong>
                    <span>
                      Check images and feedback before booking.
                    </span>
                  </div>

                  <div className="about-stat">
                    <strong>Booking flow</strong>
                    <span>
                      Move from shortlisting to booking smoothly.
                    </span>
                  </div>

                </div>

                <p className="about-note">
                  StayVista is built around clarity:
                  less friction, better discovery,
                  and a calmer way to find accommodation.
                </p>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="features-section section-block">

        <div className="container">

          <div className="section-heading">
            <p>Features</p>

            <h3>
              Built around the parts users actually need.
            </h3>

            <p>
              Each feature is meant to make the decision
              process lighter and easier.
            </p>
          </div>

          <div className="row g-4">

            <div className="col-md-6 col-xl-3">
              <div className="feature-card">

                <div className="feature-icon">
                  <i className="fa-solid fa-magnifying-glass"></i>
                </div>

                <h4>Accommodation search</h4>

                <p>
                  Search PGs and hostels in different cities
                  and filter results based on your preferences.
                </p>

              </div>
            </div>

            <div className="col-md-6 col-xl-3">
              <div className="feature-card">

                <div className="feature-icon">
                  <i className="fa-solid fa-money-bill"></i>
                </div>

                <h4>Accommodation booking</h4>

                <p>
                  Book your accommodation with just a few clicks.
                </p>

              </div>
            </div>

            <div className="col-md-6 col-xl-3">
              <div className="feature-card">

                <div className="feature-icon">
                  <i className="fa-solid fa-phone"></i>
                </div>

                <h4>24/7 support</h4>

                <p>
                  Our team is available round the clock
                  to resolve your queries.
                </p>

              </div>
            </div>

            <div className="col-md-6 col-xl-3">
              <div className="feature-card">

                <div className="feature-icon">
                  <i className="fa-regular fa-circle-check"></i>
                </div>

                <h4>Verified listings</h4>

                <p>
                  We only list verified and reliable PGs
                  and hostels on our platform.
                </p>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* TEAM */}
      <section
        id="team"
        className="team-section d-flex flex-column align-items-center bg-dark-subtle"
      >

        <h3 className="display-3 text-center fst-italic fw-bold team-heading">
          Team
        </h3>

        <div className="container d-flex justify-content-center align-items-center">

          <div className="col-md-4">

            <div className="card profile-card-3 shadow-lg">

              <div className="background-block">
                <img
                  src="/images/proback1.jpg"
                  alt="background"
                  className="background"
                />
              </div>

              <div className="profile-thumb-block">
                <img
                  src="/images/shreyas.jpeg"
                  alt="profile"
                  className="profile"
                />
              </div>

              <div className="card-content">

                <h2>
                  Shreyas Patil
                  <small>Software Developer</small>
                </h2>

                <div className="icon-block">

                  <a
                    href="https://www.linkedin.com/in/shreyaspatil18/"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="fa fa-linkedin"></i>
                  </a>

                  <a
                    href="https://github.com/PatilShreyas7103"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <i className="fa fa-github"></i>
                  </a>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

    </section>
  );
}
