import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./adminDashboard.css";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const initialData = {
  totalProperties: 0,
  totalBookings: 0,
  totalRiders: 0,
  totalProviders: 0,
  totalBalance: 0,
  totalContacts: 0,
};

function AdminDashboard() {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function fetchDashboardData() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${backendUrl}/admin`, {
          credentials: "include",
          signal: controller.signal,
        });

        const result = await res.json();

        if (!res.ok) {
          throw new Error(result.error || "Could not fetch dashboard data");
        }

        setData({
          ...initialData,
          ...(result.data || {}),
        });
      } catch (err) {
        if (err.name === "AbortError") return;
        setError(err.message || "Could not fetch dashboard data");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchDashboardData();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <section>
      <h1 className="text-center my-4">Admin Dashboard</h1>

      <hr className="admin-dashboard-divider" />

      {error && (
        <div className="alert alert-danger col-10 col-md-6 mx-auto" role="alert">
          {error}
        </div>
      )}

      <div className="row mx-0">
        <div className="card col-12 my-auto border-0">
          <div className="card-body">
            <div className="mb-5">
              <h2 className="card-title mb-0 text-center">Running Details</h2>
              <h3 className="card-title small text-muted mt-1 text-center">
                {loading ? "Loading latest details..." : "Refresh the page to see latest details"}
              </h3>
            </div>

            <div className="container d-flex flex-column row-gap-4 justify-content-center column-gap-2">
              <div className="row d-flex row-gap-4">
                <div className="col-md-6">
                  <div className="card l-bg-cherry card-inner border-0">
                    <div className="card-icon card-icon-large">
                      <i className="fas fa-solid fa-house" />
                    </div>
                    <div className="card-header bg-danger-subtle admin-card-header" />
                    <div className="card-body">
                      <h4 className="card-title">Properties Count</h4>
                      <div className="d-flex w-50 align-items-center justify-content-between">
                        <h3 className="card-title m-0">{data.totalProperties}</h3>
                        <Link to="/property/all" className="btn btn-sm btn-outline-warning">
                          See All Properties
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="card l-bg-green-dark card-inner border-0">
                    <div className="card-icon card-icon-large">
                      <i className="fas fa-solid fa-handshake" />
                    </div>
                    <div className="card-header bg-success-subtle" />
                    <div className="card-body">
                      <h4 className="card-title">Total Bookings</h4>
                      <div className="d-flex w-50 align-items-center justify-content-between">
                        <h3 className="card-title m-0">{data.totalBookings}</h3>
                        <Link to="/booking" className="btn btn-sm btn-outline-light">
                          See All Bookings
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row row-gap-4">
                <div className="col-md-6">
                  <div className="card l-bg-blue-dark card-inner border-0">
                    <div className="card-icon card-icon-large">
                      <i className="fas fa-binoculars" />
                    </div>
                    <div className="card-header bg-primary-subtle z-2" />
                    <div className="card-body">
                      <h4 className="card-title">Rider Count</h4>
                      <div className="d-flex w-50 align-items-center justify-content-between">
                        <h3 className="card-title m-0">{data.totalRiders}</h3>
                        <Link to="/rider" className="btn btn-sm btn-outline-danger text-white">
                          See All Riders
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="card l-bg-blue-dark card-inner border-0">
                    <div className="card-icon card-icon-large">
                      <i className="fas fa-users" />
                    </div>
                    <div className="card-header bg-primary-subtle z-2" />
                    <div className="card-body">
                      <h4 className="card-title">Provider Count</h4>
                      <div className="d-flex w-50 align-items-center justify-content-between">
                        <h3 className="card-title m-0">{data.totalProviders}</h3>
                        <Link to="/provider" className="btn btn-sm btn-outline-danger text-white">
                          See All Providers
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="card l-bg-orange-dark card-inner border-0">
                    <div className="card-icon card-icon-large">
                      <i className="far fa-solid fa-indian-rupee-sign" />
                    </div>
                    <div className="card-header bg-warning z-2" />
                    <div className="card-body">
                      <h4 className="card-title">Amount Generated</h4>
                      <div className="d-flex w-50 align-items-center justify-content-between">
                        <h3 className="card-title m-0">{data.totalBalance}</h3>
                        <a
                          href="https://dashboard.razorpay.com/"
                          className="btn btn-sm btn-outline-dark"
                          target="_blank"
                          rel="noreferrer"
                        >
                          See Razorpay Profile
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="card l-bg-cherry card-inner border-0">
                    <div className="card-icon card-icon-large">
                      <i className="fas fa-solid fa-address-book" />
                    </div>
                    <div className="card-header bg-danger-subtle admin-card-header" />
                    <div className="card-body">
                      <h4 className="card-title">Total Contacts</h4>
                      <div className="d-flex w-50 align-items-center justify-content-between">
                        <h3 className="card-title m-0">{data.totalContacts}</h3>
                        <Link to="/contact" className="btn btn-sm btn-outline-warning">
                          All Contacts
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminDashboard;
