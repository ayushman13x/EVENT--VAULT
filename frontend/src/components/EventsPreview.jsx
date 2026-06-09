import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_URL from "../config";
function EventsPreview({ refreshEvents , onEditEvent , token, isAdmin}) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");
  const [message, setMessage] = useState("");

  const showMessage = (text) => {
    setMessage(text);

  setTimeout(() => {
    setMessage("");
  }, 2500);
};
  const handleDelete = async (eventId) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this event?"
  );

  if (!confirmDelete) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/api/events/${eventId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (data.success) {
      setEvents(events.filter((event) => event._id !== eventId));
    } else {
      showMessage(data.message || "Failed to delete event.");
    }
  } catch (error) {
    console.error("Delete event error:", error);
    showMessage("Something went wrong while deleting the event.");
  }
};

  useEffect(() => {
   fetch(`${API_URL}/api/events`, {
  headers: token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {},
})
      .then((response) => response.json())
      .then((data) => {
        setEvents(data.events);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch events:", error);
        setLoading(false);
      });
  }, [refreshEvents , token]);

  const sortedEvents = [...events].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.date) - new Date(a.date);
    }

    if (sortBy === "oldest") {
      return new Date(a.date) - new Date(b.date);
    }

    if (sortBy === "name") {
      return a.title.localeCompare(b.title);
    }

    if (sortBy === "category") {
      return a.category.localeCompare(b.category);
    }

    return 0;
  });

  return (
    <section className="events-preview-section">
      <div className="section-heading event-heading-row">
        <div>
          <h2>Recent event albums</h2>
          <p>
            Browse event collections uploaded by clubs and photographers. Public
            albums are visible to everyone, while private ones stay limited to
            approved members.
          </p>
        </div>

        <div className="sort-box">
          <label>Sort by</label>
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="name">Event name</option>
            <option value="category">Category</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p className="muted-text">Loading events...</p>
      ) : sortedEvents.length === 0 ? (
        <p className="muted-text">No events have been created yet.</p>
      ) : (
        <div className="events-grid">
          {sortedEvents.map((event) => (
            <div className="event-card" key={event._id}>
              {event.coverImage ? (
  <img
    className="event-card-banner"
    src={event.coverImage}
    alt={event.title}
  />
) : (
  <div className="event-card-banner event-card-banner-placeholder">
    <span>{event.category}</span>
  </div>
)}

              <div className="event-card-content">
                <div className="event-card-top">
                  <p className="event-date">
                    {new Date(event.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>

                  <span
                    className={
                      event.visibility === "public"
                        ? "visibility-badge public"
                        : "visibility-badge private"
                    }
                  >
                    {event.visibility}
                  </span>
                </div>
                <div className="event-scope-row">
  <span>{event.eventScope === "general" ? "General event" : "Club event"}</span>

  {event.eventScope === "club" && event.clubName && (
    <span>{event.clubName}</span>
  )}
</div>

                <h3>{event.title}</h3>
                <p>{event.description}</p>

                {event.location && (
                  <p className="event-location">📍 {event.location}</p>
                )}

                <div className="event-actions">
  <Link className="view-album-btn" to={`/gallery?event=${event._id}`}>
    View album
  </Link>

  {isAdmin && (
    <>
      <button className="edit-event-btn" onClick={() => onEditEvent(event)}>
        Edit event
      </button>

      <button
        className="delete-event-btn"
        onClick={() => handleDelete(event._id)}
      >
        Delete event
      </button>
    </>
  )}
</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default EventsPreview;