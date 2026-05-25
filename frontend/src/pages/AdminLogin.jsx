import { Link } from "react-router-dom";
import "./adminLogin.css";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

function AdminLogin() {
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const payload = {
      email: formData.get("email"),
      pass: formData.get("pass"),
    };

    try {
      const response = await fetch(`${backendUrl}/auth/admin-login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      
      if (response.ok) {
        alert("Admin login successful!");
      } else {
        alert("Failed to login. Please check your credentials.");
      }
    } catch (error) {
      console.error("Error during admin login:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <section className="auth-page">
      <div className="container">
        <div className="auth-shell">
          <div className="auth-showcase">
            <div className="auth-showcase-content">
              <p className="auth-eyebrow">Admin Portal</p>
              <h1>Access the admin side with a cleaner login flow.</h1>
              <p>
                Enter your admin credentials to manage platform-level actions,
                moderation, and operational review through the portal.
              </p>

              <div className="auth-points">
                <div className="auth-point">
                  <i className="fa-solid fa-shield-halved" />
                  <span>
                    Restricted admin-only entry for platform supervision and
                    operational control.
                  </span>
                </div>

                <div className="auth-point">
                  <i className="fa-solid fa-table-columns" />
                  <span>
                    Review users, listings, and activity from one structured
                    dashboard area.
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="auth-card">
            <h2>Admin Login</h2>
            <p className="auth-card-subtitle">
              Use your admin-linked account credentials to continue.
            </p>

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="auth-field">
                <label className="form-label" htmlFor="email-input">
                  Email address
                </label>
                <input
                  name="email"
                  type="email"
                  id="email-input"
                  className="form-control"
                  placeholder="Enter Email"
                  pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,4}$"
                />
              </div>

              <div className="auth-field">
                <label className="form-label" htmlFor="pass">
                  Password
                </label>
                <input
                  name="pass"
                  type="password"
                  id="pass"
                  className="form-control"
                  placeholder="Enter Password"
                />
              </div>

              <div className="auth-actions">
                <button type="submit" className="btn btn-primary">
                  Login
                </button>

                <div className="auth-links">
                  <Link to="/auth/forget-password">Forgot Password?</Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminLogin;
