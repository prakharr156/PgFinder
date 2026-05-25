import "./adminRegistration.css";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

function AdminRegistration() {
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const payload = {
      email: formData.get("email"),
      adminKey: formData.get("adminKey"),
    };

    try {
      const response = await fetch(`${backendUrl}/auth/admin-create`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Admin registered successfully!");
      } else {
        alert("Failed to register admin. Please check the admin key.");
      }
    } catch (error) {
      console.error("Error during admin registration:", error);
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
              <h1>Register admin access with the provided validation key.</h1>
              <p>
                If you are already a registered user, you can request admin access
                by entering your email and the valid admin key assigned for portal
                activation.
              </p>

              <div className="auth-points">
                <div className="auth-point">
                  <i className="fa-solid fa-user-shield" />
                  <span>
                    Admin registration extends an existing user account with
                    elevated platform permissions.
                  </span>
                </div>

                <div className="auth-point">
                  <i className="fa-solid fa-key" />
                  <span>
                    Only users with the correct admin validation key can complete
                    this setup.
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="auth-card">
            <h2>Admin Registration</h2>
            <p className="auth-card-subtitle">
              Enter your email and admin validation key to continue.
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
                  required
                />
              </div>

              <div className="auth-field">
                <label className="form-label" htmlFor="key">
                  Validation Key
                </label>
                <input
                  name="adminKey"
                  type="password"
                  id="key"
                  className="form-control"
                  placeholder="Enter Validation Key"
                  required
                />
              </div>

              <div className="auth-actions">
                <button type="submit" className="btn btn-primary">
                  Register Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminRegistration;
