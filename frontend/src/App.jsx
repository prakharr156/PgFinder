import { useCallback, useEffect, useState } from "react";
import { Navigate, Route, Routes, Link, useNavigate } from "react-router-dom";

import Home from "./pages/Home";
import SearchHome from "./pages/SearchHome";
import SearchResult from "./pages/SearchResult";
import PropertyPage from "./pages/PropertyPage";
import RegisterPg from "./pages/RegisterPg";
import EditPg from "./pages/EditPg";

import UserLogin from "./pages/UserLogin";
import UserRegistration from "./pages/UserRegistration";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPass from "./pages/ResetPass";
import Success from "./pages/Success";
import ErrorPage from "./pages/ErrorPage";

import AdminLogin from "./pages/AdminLogin";
import AdminRegistration from "./pages/AdminRegistration";
import AdminDashboard from "./pages/AdminDashboard";
import AdminDetails from "./pages/AdminDetails";

import RiderDashboard from "./pages/RiderDashboard";
import RegisterUser from "./pages/RegisterUser";
import UpdateUser from "./pages/UpdateUser";

import ProviderDashboard from "./pages/ProviderDashboard";
import RegisterProvider from "./pages/RegisterProvider";
import UpdateProvider from "./pages/UpdateProvider";

import BookingCancel from "./pages/BookingCancel";
import BookingDetails from "./pages/BookingDetails";
import MessagesInbox from "./pages/MessagesInbox";
import Terms from "./pages/Terms";

import "./App.css";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

function getRoleHome(user, userRoleID) {
  if (!user) return "/auth/login";

  if (user.role === "admin") return "/admin";
  if (user.role === "rider") return "/property/search";
  if (user.role === "provider") {
    return user.isFilled ? `/provider/${userRoleID}` : `/provider/${userRoleID}/new-user`;
  }

  return "/";
}

function getProfileLink(user, userRoleID) {
  if (!user) return "/auth/login";
  if (user.role === "admin") return "/admin";
  if ((user.role === "rider" || user.role === "provider") && userRoleID) {
    return `/${user.role}/${userRoleID}`;
  }

  return `/${user.role}/dashboard`;
}

function App() {
  const navigate = useNavigate();
  const [session, setSession] = useState({
    user: null,
    userDet: null,
    userRoleID: null,
    loading: true,
  });

  const { user, userDet, userRoleID, loading } = session;

  const loadSession = useCallback(async () => {
    try {
      const res = await fetch(`${backendUrl}/`, {
        credentials: "include",
      });
      const data = await res.json();

      setSession({
        user: data.user || null,
        userDet: data.userDet || null,
        userRoleID: data.userRoleID || null,
        loading: false,
      });
    } catch (error) {
      console.log(error);
      setSession({
        user: null,
        userDet: null,
        userRoleID: null,
        loading: false,
      });
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    loadSession().finally(() => {
      if (!isMounted) return;
    });

    return () => {
      isMounted = false;
    };
  }, [loadSession]);

  const handleLogin = ({ user: loggedInUser }) => {
    setSession((prev) => ({
      user: loggedInUser || prev.user,
      userDet: prev.userDet,
      userRoleID: loggedInUser?.roleID || prev.userRoleID,
      loading: false,
    }));

    loadSession();
  };

  const handleLogout = async () => {
    try {
      await fetch(`${backendUrl}/auth/logout`, {
        credentials: "include",
      });
    } catch (error) {
      console.log(error);
    }

    setSession({
      user: null,
      userDet: null,
      userRoleID: null,
      loading: false,
    });
    navigate("/");
  };

  return (
    <>
      <section
        id="flash-holder"
        className="position-fixed col-10 col-md-3 text-white"
        style={{ top: "10%", right: "5%", zIndex: 9999 }}
      />

      <header className="site-header mb-2">
        <div className="container">
          <nav className="navbar navbar-expand-lg navbar-light site-navbar">
            <div className="container-fluid px-0">
              <Link className="navbar-brand" to="/">
                <img src="/images/stayvista-logo.png" alt="StayVista logo" width="60" />
              </Link>

              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon" />
              </button>

              <div className="collapse navbar-collapse mb-2" id="navbarNav">
                <ul className="navbar-nav top-nav-links">
                  <li className="nav-item">
                    <Link className="nav-link" to="/property/search">Homes</Link>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="/#about">About Us</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="/#why-us">Why Us</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="/#features">Features</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="/#team">Team</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="/#help">Contact Us</a>
                  </li>
                </ul>

                <ul className="navbar-nav ms-auto align-items-lg-center">
                  {!loading && user ? (
                    <>
                      {user.role === "rider" && (
                        <li className="nav-item me-lg-2 mb-2 mb-lg-0">
                          <Link to="/property/search" className="btn text-black top-auth-link">
                            Search PGs
                          </Link>
                        </li>
                      )}

                      {user.role === "provider" && (
                        <li className="nav-item me-lg-2 mb-2 mb-lg-0">
                          <Link to={getRoleHome(user, userRoleID)} className="btn text-black top-auth-link">
                            {user.isFilled ? "Provider Profile" : "Complete Profile"}
                          </Link>
                        </li>
                      )}

                      {user.role !== "admin" && (
                        <li className="nav-item me-lg-2 mb-2 mb-lg-0">
                          <Link to={getProfileLink(user, userRoleID)} className="nav-link p-0 site-profile-link">
                            <img
                              src={userDet?.profilePic || "/images/man.svg"}
                              className="rounded-circle"
                              height="60"
                              style={{ aspectRatio: 1, objectFit: "cover" }}
                              alt="user"
                            />
                          </Link>
                        </li>
                      )}
                      <li className="nav-item">
                        <button type="button" onClick={handleLogout} className="btn text-black top-auth-link">
                          Logout
                        </button>
                      </li>
                    </>
                  ) : !loading ? (
                    <>
                      <li className="nav-item">
                        <Link to="/auth/login" className="btn text-black top-auth-link">
                          Login
                        </Link>
                      </li>
                      {/* <li className="nav-item">
                        <Link to="/auth/admin-login" className="btn btn-outline-danger top-auth-link ms-2">
                          Admin Login
                        </Link>
                      </li> */}
                      <li className="nav-item">
                        <Link to="/auth/admin-create" className="btn btn-outline-primary top-auth-link ms-2">
                          Admin Register
                        </Link>
                      </li>
                    </>
                  ) : null}
                </ul>
              </div>
            </div>
          </nav>
        </div>
      </header>

      <main id="main-body" style={{ minHeight: "100vh" }}>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/property/search" element={<SearchHome />} />
          <Route path="/property" element={<SearchResult />} />
          <Route path="/property/new" element={<RegisterPg />} />
          <Route path="/property/:id" element={<PropertyPage />} />
          <Route path="/property/:id/edit" element={<EditPg />} />

          <Route
            path="/auth/login"
            element={
              loading ? null : user ? (
                <Navigate to={getRoleHome(user, userRoleID)} replace />
              ) : (
                <UserLogin onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/auth/registration"
            element={
              loading ? null : user ? (
                <Navigate to={getRoleHome(user, userRoleID)} replace />
              ) : (
                <UserRegistration />
              )
            }
          />
          <Route path="/auth/forget-password" element={<ForgotPassword />} />
          <Route path="/auth/change-password" element={<ResetPass />} />

          <Route path="/auth/admin-login" element={<AdminLogin />} />
          <Route path="/auth/admin-create" element={<AdminRegistration />} />

          <Route path="/property/all" element={<AdminDetails />} />
          <Route path="/rider" element={<AdminDetails />} />
          <Route path="/provider" element={<AdminDetails />} />
          <Route path="/booking" element={<AdminDetails />} />
          <Route path="/contact" element={<AdminDetails />} />

          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/details" element={<AdminDetails />} />

          <Route path="/rider/dashboard" element={<RiderDashboard />} />
          <Route path="/rider/:id" element={<RiderDashboard />} />
          <Route path="/rider/:id/new-user" element={<RegisterUser />} />
          <Route path="/rider/:id/edit" element={<UpdateUser />} />

          <Route path="/provider/dashboard" element={<ProviderDashboard />} />
          <Route path="/provider/:id" element={<ProviderDashboard />} />
          <Route path="/provider/:id/new-user" element={<RegisterProvider />} />
          <Route path="/provider/:id/edit" element={<UpdateProvider />} />

          <Route path="/success" element={<Success />} />
          <Route path="/error" element={<ErrorPage />} />

          <Route path="/login" element={<Navigate to="/auth/login" replace />} />
          <Route path="/register" element={<Navigate to="/auth/registration" replace />} />

          <Route path="/booking/:propertyID/new" element={<BookingDetails />} />
          <Route path="/booking/:id/cancel" element={<BookingCancel />} />
          <Route path="/messages" element={<MessagesInbox />} />
          <Route path="/messages/property/:propertyID" element={<MessagesInbox />} />
          <Route path="/messages/:id" element={<MessagesInbox />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="*" element={<ErrorPage />} />

        </Routes>
      </main>

      <footer className="site-footer">
        <div className="container">
          <div className="text-center text-dark site-footer-shell">
            <div className="container">
              <section className="site-footer-main">
                <div className="row text-center d-flex justify-content-center pt-5">
                  {[
                    ["Homes", "/property/search"],
                    ["About us", "/#about"],
                    ["Why us!", "/#why-us"],
                    ["Features", "/#features"],
                    ["Team", "/#team"],
                    ["Contact Us", "/#help"],
                  ].map(([label, href]) => (
                    <div className="col-md-2 site-footer-links" key={href}>
                      <h6 className="text-uppercase font-weight-bold">
                        <a href={href} className="text-black">{label}</a>
                      </h6>
                    </div>
                  ))}
                </div>
              </section>

              <hr className="my-3" />

              <section className="mb-2">
                <div className="row d-flex justify-content-center">
                  <div className="col-lg-8">
                    <p>
                      StayVista is a platform that helps users find the perfect PG or hostel
                      for their stay across different cities and states in India.
                    </p>
                  </div>
                </div>
              </section>

              <section className="text-center mb-5">
                <a href="#" className="text-black me-4 fs-1">
                  <i className="fab fa-github" />
                </a>
              </section>
            </div>

            <div className="site-footer-bottom d-flex flex-column flex-md-row justify-content-between align-items-center text-center text-md-start p-3 row-gap-2">
              <div>© 2026 Copyright: All rights reserved</div>
              <div>
                Developed by Shreyas Patil
                <br />
                Pune, Maharashtra, India
              </div>
              <div className="text-md-end">
                Contact: +91 7378472876
                <br />
                Email: shreyaspatil9131@gmail.com
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
