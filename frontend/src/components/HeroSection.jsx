import { useEffect, useState } from "react";
import API_URL from "../config";
function HeroSection() {
  const [backendStatus, setBackendStatus] = useState("Checking backend...");

  useEffect(() => {
    fetch(`${API_URL}/api/health`)
      .then((response) => response.json())
      .then((data) => {
        setBackendStatus(data.message);
      })
      .catch(() => {
        setBackendStatus("Backend is not connected");
      });
  }, []);

  return (
    <section className="hero-section">
      <div className="hero-content">
        <p className="status-pill">{backendStatus}</p>

        <h1>Manage every event memory in one place.</h1>

        <p>
          EventVault helps clubs, photographers, and members upload, organize,
          search, and share event photos and videos with smart AI-powered
          discovery.
        </p>

        <div className="hero-buttons">
          <button className="primary-btn">Explore Events</button>
          <button className="secondary-btn">Upload Media</button>
        </div>
      </div>

      <div className="hero-card">
        <div className="card-image"></div>
        <h3>Cultural Fest 2026</h3>
        <p> photos · videos · Public album</p>
      </div>
    </section>
  );
}

export default HeroSection;