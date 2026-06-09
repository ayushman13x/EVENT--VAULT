import { useEffect, useState } from "react";
import API_URL from "../config";
function AdminPhotographerPanel({ token, isAdmin }) {
  const [events, setEvents] = useState([]);
  const [photographers, setPhotographers] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [selectedPhotographerId, setSelectedPhotographerId] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!isAdmin || !token) {
      return;
    }

    fetch(`${API_URL}/api/events`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setEvents(data.events);

        if (data.events.length > 0) {
          setSelectedEventId(data.events[0]._id);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch events:", error);
      });

    fetch(`${API_URL}/api/users/photographers`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setPhotographers(data.photographers);

        if (data.photographers.length > 0) {
          setSelectedPhotographerId(data.photographers[0]._id);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch photographers:", error);
      });
  }, [token, isAdmin]);

  const handleAssign = async (event) => {
    event.preventDefault();

    if (!selectedEventId || !selectedPhotographerId) {
      setMessage("Please select both event and photographer.");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/events/${selectedEventId}/assign-photographer`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            photographerId: selectedPhotographerId,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setMessage(data.message);
      } else {
        setMessage(data.message || "Failed to assign photographer.");
      }
    } catch (error) {
      console.error("Assign photographer error:", error);
      setMessage("Something went wrong while assigning photographer.");
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <section className="photographer-panel-section">
      <div className="section-heading">
        <h2>Assign photographers</h2>
        <p>
          Assign approved photographers to specific events. Photographers can
          upload media only to events assigned by the admin.
        </p>
      </div>

      <form className="photographer-panel" onSubmit={handleAssign}>
        <div className="form-row">
          <div className="form-group">
            <label>Select event</label>
            <select
              value={selectedEventId}
              onChange={(event) => setSelectedEventId(event.target.value)}
            >
              {events.map((event) => (
                <option key={event._id} value={event._id}>
                  {event.title}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Select photographer</label>
            <select
              value={selectedPhotographerId}
              onChange={(event) =>
                setSelectedPhotographerId(event.target.value)
              }
            >
              {photographers.map((photographer) => (
                <option key={photographer._id} value={photographer._id}>
                  {photographer.name} · {photographer.email}
                </option>
              ))}
            </select>
          </div>
        </div>

        {photographers.length === 0 ? (
          <p className="muted-text">
            No approved photographers found. Approve a photographer request
            first.
          </p>
        ) : (
          <button className="primary-btn" type="submit">
            Assign Photographer
          </button>
        )}

        {message && <p className="form-message">{message}</p>}
      </form>
    </section>
  );
}

export default AdminPhotographerPanel;