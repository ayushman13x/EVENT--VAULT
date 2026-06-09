import { useState } from "react";
import API_URL from "../config";
function LoginSection({ user, setUser, setToken }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        setToken(data.token);

        localStorage.setItem("eventvault_user", JSON.stringify(data.user));
        localStorage.setItem("eventvault_token", data.token);

        setIsError(false);
        setMessage("Login successful.");
      } else {
        setIsError(true);
        setMessage(data.message || "Invalid email or password.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setIsError(true);
      setMessage("Something went wrong while logging in.");
    }
  };

  const handleLogout = () => {
    setUser(null);
    setToken("");

    localStorage.removeItem("eventvault_user");
    localStorage.removeItem("eventvault_token");

    setIsError(false);
    setMessage("Logged out successfully.");
  };

  return (
    <section className="login-section">
      <div className="section-heading">
        <h2>{user ? "Your account" : "Login"}</h2>
        <p>
          {user
            ? "You are currently signed in. Your available actions depend on your approved role."
            : "Use your registered email and password to continue."}
        </p>
      </div>

      {user ? (
        <div className="logged-in-card">
          <div>
            <p className="eyebrow-text">Signed in</p>

            <h3>{user.name}</h3>

            <p>
              Role: {user.role}
              {user.role === "admin"
                ? " · Platform Admin"
                : user.role === "photographer"
                ? " · Event Photographer"
                : ` · ${user.clubName || "No club added"}`}
            </p>

            {user.requestedRole !== "none" && (
              <p>
                Requested: {user.requestedRole} · Status:{" "}
                {user.approvalStatus}
              </p>
            )}
          </div>

          <button className="secondary-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button className="primary-btn" type="submit">
            Login
          </button>
        </form>
      )}

      {message && (
        <p className={isError ? "form-message error" : "form-message"}>
          {message}
        </p>
      )}
    </section>
  );
}

export default LoginSection;