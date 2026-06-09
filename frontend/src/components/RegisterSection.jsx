import { useState } from "react";
import API_URL from "../config";
function RegisterSection({ setUser, setToken }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    requestedRole: "none",
    clubName: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (event) => {
  const { name, value } = event.target;

  setFormData((previousData) => ({
    ...previousData,
    [name]: value,
    ...(name === "requestedRole" && value !== "member"
      ? { clubName: "" }
      : {}),
  }));
};

  const handleRegister = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
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

        setMessage(data.message);

        setFormData({
          name: "",
          email: "",
          password: "",
          requestedRole: "none",
          clubName: "",
        });
      } else {
        setMessage(data.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Register error:", error);
      setMessage("Something went wrong while creating the account.");
    }
  };

  return (
    <section className="register-section">
      <div className="section-heading">
        <h2>Create an account</h2>
        <p>
          New users start as viewers. Club member and photographer access is
          requested during signup and approved by an admin later.
        </p>
      </div>

      <form className="login-form" onSubmit={handleRegister}>
        <div className="form-row">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Ayushman Kumar"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

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
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Minimum 6 characters"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Request access as</label>
            <select
              name="requestedRole"
              value={formData.requestedRole}
              onChange={handleChange}
            >
              <option value="none">Viewer only</option>
              <option value="member">Club Member</option>
              <option value="photographer">Photographer</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Club name</label>
          <input
  type="text"
  name="clubName"
  placeholder="e.g. Photography Club"
  value={formData.clubName}
  onChange={handleChange}
  disabled={formData.requestedRole !== "member"}
  required={formData.requestedRole === "member"}
/>
        </div>

        <button className="primary-btn" type="submit">
          Create Account
        </button>

        {message && <p className="form-message">{message}</p>}
      </form>
    </section>
  );
}

export default RegisterSection;