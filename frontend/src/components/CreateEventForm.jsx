import { useEffect, useState } from "react";
import API_URL from "../config";  
function CreateEventForm({ onEventSaved, editingEvent, setEditingEvent, token }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Workshop",
    date: "",
    location: "",
    visibility: "public",
    eventScope: "club",
    clubName: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (editingEvent) {
      setFormData({
        title: editingEvent.title,
        description: editingEvent.description,
        category: editingEvent.category,
        date: editingEvent.date.slice(0, 10),
        location: editingEvent.location || "",
        visibility: editingEvent.visibility,
        eventScope: editingEvent.eventScope || "club",
        clubName: editingEvent.clubName || "",
      });

      setMessage("You are editing an existing event.");
    }
  }, [editingEvent]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,

      // If event is general, clear clubName automatically
      ...(name === "eventScope" && value === "general" ? { clubName: "" } : {}),
    }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "Workshop",
      date: "",
      location: "",
      visibility: "public",
      eventScope: "club",
      clubName: "",
    });

    setMessage("");
    setEditingEvent(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const url = editingEvent
        ? `${API_URL}/api/events/${editingEvent._id}`
        : `${API_URL}/api/events`;

      const method = editingEvent ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(
          editingEvent
            ? "Event updated successfully."
            : "Event created successfully."
        );

        resetForm();
        onEventSaved(data.event);
      } else {
        setMessage(data.message || "Failed to save event.");
      }
    } catch (error) {
      console.error("Save event error:", error);
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <section className="create-event-section">
      <div className="section-heading">
        <h2>
          {editingEvent ? "Update event details" : "Create a new event album"}
        </h2>

        <p>
          {editingEvent
            ? "Make changes to the event details. Existing media will stay linked to this event."
            : "Add the event details first. Photographers can upload photos and videos into this event later."}
        </p>
      </div>

      <form className="create-event-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Event title</label>
            <input
              type="text"
              name="title"
              placeholder="e.g. Freshers Night 2026"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option>Workshop</option>
              <option>Cultural Fest</option>
              <option>Sports</option>
              <option>Photoshoot</option>
              <option>Trip</option>
              <option>Competition</option>
              <option>Party</option>
              <option>Other</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            placeholder="Write a short, natural description for this event..."
            value={formData.description}
            onChange={handleChange}
            rows="4"
            required
          ></textarea>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Event scope</label>
            <select
              name="eventScope"
              value={formData.eventScope}
              onChange={handleChange}
            >
              <option value="club">Club event</option>
              <option value="general">General campus event</option>
            </select>
          </div>

          <div className="form-group">
            <label>Club name</label>
            <input
              type="text"
              name="clubName"
              placeholder="e.g. Photography Club"
              value={formData.clubName}
              onChange={handleChange}
              disabled={formData.eventScope === "general"}
              required={formData.eventScope === "club"}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              name="location"
              placeholder="e.g. Main Auditorium"
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Default visibility</label>
            <select
              name="visibility"
              value={formData.visibility}
              onChange={handleChange}
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button className="primary-btn" type="submit">
            {editingEvent ? "Update Event" : "Create Event"}
          </button>

          {editingEvent && (
            <button className="secondary-btn" type="button" onClick={resetForm}>
              Cancel Edit
            </button>
          )}
        </div>

        {message && <p className="form-message">{message}</p>}
      </form>
    </section>
  );
}

export default CreateEventForm;