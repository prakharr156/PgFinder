import { useEffect, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import axios from "axios";
import "./adminDetails.css";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

function AdminDetails() {
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const type = getDetailsType(location.pathname, searchParams.get("type"));
  const skip = Number(searchParams.get("skip") || 0);
  const [results, setResults] = useState([]);
  const [isFirst, setIsFirst] = useState(skip <= 0);
  const [isLast, setIsLast] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const endpoint = getDetailsEndpoint(type);
    const controller = new AbortController();

    if (!endpoint) {
      return () => controller.abort();
    }

    async function fetchDetails() {
      try {
        setLoading(true);
        setError("");

        const res = await axios.get(`${backendUrl}${endpoint}`, {
          params: { skip },
          signal: controller.signal,
          withCredentials: true,
        });

        setResults(res.data.results || []);
        setIsFirst(Boolean(res.data.isFirst));
        setIsLast(Boolean(res.data.isLast));
      } catch (err) {
        if (err.code === "ERR_CANCELED" || err.name === "CanceledError") return;

        setResults([]);
        setIsFirst(skip <= 0);
        setIsLast(true);
        setError(err.response?.data?.error || err.message || "Could not fetch details");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchDetails();

    return () => {
      controller.abort();
    };
  }, [type, skip]);

  const deleteItem = async (url, successMessage, errorMessage) => {
    const confirmed = window.confirm("Are you sure you want to delete this?");
    if (!confirmed) return;

    try {
      await axios.post(`${backendUrl}${url}`, undefined, {
        withCredentials: true,
      });
      alert(successMessage);
      window.location.reload();
    } catch {
      alert(errorMessage);
    }
  };

  if (type === "property") {
    return (
      <DetailsShell
        title="Property Details"
        previousHref={`/property/all?skip=${skip - 10}`}
        nextHref={`/property/all?skip=${skip + 10}`}
        isFirst={isFirst}
        isLast={isLast}
      >
        <thead>
          <tr className="table-primary">
            <th>Name</th>
            <th>Location</th>
            <th>Booking Money</th>
            <th>Since</th>
            <th>Interested Count</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody className="table-group-divider border-dark align-middle">
          {renderStateRows({ loading, error, results, colSpan: 6 }) ||
            results.map((det) => (
            <tr key={det._id || det.id}>
              <td>
                <Link to={`/property/${det._id || det.id}`} target="_blank">
                  {det.name}
                </Link>
              </td>
              <td>
                {det.address?.city || "No Data"}, {det.address?.state || "No Data"}
              </td>
              <td>{det.bookingMoney || "No Data yet"}</td>
              <td>{det.since || "No Data"}</td>
              <td>{det.interested || "No Data"}</td>
              <td>
                <button
                  className="btn btn-sm btn-outline-danger mb-0"
                  onClick={() =>
                    deleteItem(
                      `/property/${det._id || det.id}?_method=delete`,
                      "Property deleted successfully!",
                      "Could not delete property, some error occurred!"
                    )
                  }
                >
                  Delete!
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </DetailsShell>
    );
  }

  if (type === "rider") {
    return (
      <DetailsShell
        title="User Details"
        previousHref={`/rider?skip=${skip - 10}`}
        nextHref={`/rider?skip=${skip + 10}`}
        isFirst={isFirst}
        isLast={isLast}
      >
        <thead>
          <tr className="table-primary">
            <th>Name</th>
            <th>Occupation</th>
            <th>Age</th>
            <th>Covid Certificate</th>
            <th>Booking Count</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody className="table-group-divider border-dark align-middle">
          {renderStateRows({ loading, error, results, colSpan: 6 }) ||
            results.map((det) => (
            <tr key={det._id || det.id}>
              <td>
                <Link to={`/rider/${det._id || det.id}`} target="_blank">
                  {det.name}
                </Link>
              </td>
              <td>{det.occupation || "No Data yet!"}</td>
              <td>{getAge(det.dob)}</td>
              <td>
                <a href={det.covidCert || "#"} target="_blank" rel="noreferrer">
                  Link
                </a>
              </td>
              <td>{det.bookings?.length || 0}</td>
              <td>
                <button
                  className="btn btn-sm btn-outline-danger mb-0"
                  onClick={() =>
                    deleteItem(
                      `/rider/${det._id || det.id}?_method=delete`,
                      "User deleted successfully!",
                      "Could not delete user, some error occurred!"
                    )
                  }
                >
                  Delete!
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </DetailsShell>
    );
  }

  if (type === "provider") {
    return (
      <DetailsShell
        title="Provider Details"
        previousHref={`/provider?skip=${skip - 10}`}
        nextHref={`/provider?skip=${skip + 10}`}
        isFirst={isFirst}
        isLast={isLast}
      >
        <thead>
          <tr className="table-primary">
            <th>Name</th>
            <th>Address</th>
            <th>Property Count</th>
            <th>GST Number</th>
            <th>Total Bookings</th>
            <th>Remove</th>
          </tr>
        </thead>
        <tbody className="table-group-divider border-dark align-middle">
          {renderStateRows({ loading, error, results, colSpan: 6 }) ||
            results.map((det) => (
            <tr key={det._id || det.id}>
              <td>
                <Link to={`/provider/${det._id || det.id}`} target="_blank">
                  {det.name}
                </Link>
              </td>
              <td>
                {det.address?.city || "No Data"}, {det.address?.state || "No Data"}
              </td>
              <td>{det.properties?.length || 0}</td>
              <td>{det.gst || "No Data yet!"}</td>
              <td>{(det.bookingPending?.length || 0) + (det.bookingCompleted?.length || 0)}</td>
              <td>
                <button
                  className="btn btn-sm btn-outline-danger mb-0"
                  onClick={() =>
                    deleteItem(
                      `/provider/${det._id || det.id}?_method=delete`,
                      "User deleted successfully!",
                      "Could not delete user, some error occurred!"
                    )
                  }
                >
                  Delete!
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </DetailsShell>
    );
  }

  if (type === "booking") {
    return (
      <DetailsShell
        title="Booking Details"
        previousHref={`/booking?skip=${skip - 10}`}
        nextHref={`/booking?skip=${skip + 10}`}
        isFirst={isFirst}
        isLast={isLast}
      >
        <thead>
          <tr className="table-primary">
            <th>Booked By</th>
            <th>Property</th>
            <th>On</th>
            <th>Comment</th>
            <th>Is Completed</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody className="table-group-divider border-dark align-middle">
          {renderStateRows({ loading, error, results, colSpan: 6 }) ||
            results.map((det) => (
            <tr key={det._id || det.id}>
              <td>
                <Link to={`/rider/${det.by?._id || det.by?.id}`}>
                  {det.by?.name || "No Data"}
                </Link>
              </td>
              <td>
                <Link to={`/property/${det.property?._id || det.property?.id}`}>
                  {det.property?.name || "No Data"}
                </Link>
              </td>
              <td>{formatDate(det.date)}</td>
              <td>{det.comment || "No Comment Yet!"}</td>
              <td>{det.completed ? "Yes" : "No"}</td>
              <td>{det.property?.bookingMoney || "No Data"}</td>
            </tr>
          ))}
        </tbody>
      </DetailsShell>
    );
  }

  if (type === "contact") {
    return (
      <DetailsShell
        title="Contact Details"
        previousHref={`/contact?skip=${skip - 10}`}
        nextHref={`/contact?skip=${skip + 10}`}
        isFirst={isFirst}
        isLast={isLast}
      >
        <thead>
          <tr className="table-primary">
            <th>Sender Email</th>
            <th>Date</th>
            <th>Subject</th>
            <th>Content</th>
          </tr>
        </thead>
        <tbody className="table-group-divider border-dark align-middle">
          {renderStateRows({ loading, error, results, colSpan: 4 }) ||
            results.map((det) => (
            <tr key={det._id || det.id}>
              <td>
                <a href={`mailto:${det.email}`}>{det.email}</a>
              </td>
              <td>{formatDate(det.createdAt)}</td>
              <td>{det.subject}</td>
              <td>{det.content}</td>
            </tr>
          ))}
        </tbody>
      </DetailsShell>
    );
  }

  return <h1 className="text-center py-5">No details selected</h1>;
}

function DetailsShell({ title, previousHref, nextHref, isFirst, isLast, children }) {
  return (
    <section>
      <h1 className="h1 text-center py-3">{title}</h1>
      <hr className="admin-details-divider" />

      <div className="py-5">
        <div className="col-lg-10 mx-auto">
          <div className="card rounded shadow border-0">
            <div className="card-body p-5 bg-white rounded">
              <div className="table-responsive">
                <table id="example" className="table table-bordered table-hover admin-details-table">
                  {children}
                </table>
              </div>
            </div>

            <nav aria-label="Page navigation" className="d-flex justify-content-end pe-5">
              <ul className="pagination">
                <li className="page-item">
                  <Link className={`page-link ${isFirst ? "disabled" : ""}`} to={previousHref}>
                    Previous
                  </Link>
                </li>
                <li className="page-item">
                  <span className="page-link disabled">1</span>
                </li>
                <li className="page-item">
                  <Link className={`page-link ${isLast ? "disabled" : ""}`} to={nextHref}>
                    Next
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}

function getDetailsType(pathname, queryType) {
  if (queryType) return queryType;
  if (pathname.startsWith("/property/all")) return "property";
  if (pathname.startsWith("/rider")) return "rider";
  if (pathname.startsWith("/provider")) return "provider";
  if (pathname.startsWith("/booking")) return "booking";
  if (pathname.startsWith("/contact")) return "contact";
  return "";
}

function getDetailsEndpoint(type) {
  const endpoints = {
    property: "/property/all",
    rider: "/rider",
    provider: "/provider",
    booking: "/booking",
    contact: "/contact",
  };

  return endpoints[type] || "";
}

function renderStateRows({ loading, error, results, colSpan }) {
  if (loading) {
    return (
      <tr>
        <td colSpan={colSpan} className="text-center py-4">
          Loading details...
        </td>
      </tr>
    );
  }

  if (error) {
    return (
      <tr>
        <td colSpan={colSpan} className="text-center text-danger py-4">
          {error}
        </td>
      </tr>
    );
  }

  if (results.length === 0) {
    return (
      <tr>
        <td colSpan={colSpan} className="text-center py-4">
          No records found.
        </td>
      </tr>
    );
  }

  return null;
}

function getAge(dob) {
  if (!dob) return "No Data yet!";
  return new Date().getFullYear() - new Date(dob).getFullYear();
}

function formatDate(date) {
  if (!date) return "No Data";
  return new Date(date).toLocaleDateString("en-IN");
}

export default AdminDetails;
