import { useEffect, useState } from "react";
import API_URL from "../config";
function MediaUploadSection({ token, user, refreshMedia }) {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState("");
const [tags, setTags] = useState("");
const [isDragging, setIsDragging] = useState(false);
  const canUpload = user?.role === "admin" || user?.role === "photographer";

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

        if (data.events.length > 0) {
          setSelectedEventId(data.events[0]._id);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch events:", error);
      });
  }, []);

  // const handleFileChange = (event) => {
  //   setFiles(Array.from(event.target.files));
  // };

  const handleFileChange = (event) => {
  const selectedFiles = Array.from(event.target.files);
  setFiles(selectedFiles);
  setMessage("");
};

const handleDragOver = (event) => {
  event.preventDefault();
  setIsDragging(true);
};

const handleDragLeave = () => {
  setIsDragging(false);
};

const handleDrop = (event) => {
  event.preventDefault();
  setIsDragging(false);

  const droppedFiles = Array.from(event.dataTransfer.files);

  const validFiles = droppedFiles.filter((file) =>
    file.type.startsWith("image/") || file.type.startsWith("video/")
  );

  if (validFiles.length === 0) {
    setMessage("Please drop only image or video files.");
    return;
  }

  setFiles(validFiles);
  setMessage("");
};

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!selectedEventId) {
      setMessage("Please select an event.");
      return;
    }

    if (files.length === 0) {
      setMessage("Please select at least one file.");
      return;
    }

    const uploadData = new FormData();

    uploadData.append("eventId", selectedEventId);
    uploadData.append("visibility", visibility);
    uploadData.append("tags", tags);

    files.forEach((file) => {
      uploadData.append("media", file);
    });

    try {
      const response = await fetch(`${API_URL}/api/media/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: uploadData,
      });

      const data = await response.json();

      if (data.success) {
        setMessage(`${data.count} file(s) uploaded successfully.`);
        setFiles([]);
        setTags("");
        refreshMedia();
      } else {
        setMessage(data.message || "Upload failed.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("Something went wrong while uploading.");
    }
  };

  if (!canUpload) {
    return null;
  }

  return (
    <section className="media-upload-section">
      <div className="section-heading">
        <h2>Upload event media</h2>
        <p>
          Add photos or videos to an event album. Uploaded files are linked to
          the selected event and can be marked public or private.
        </p>
      </div>

      <form className="media-upload-form" onSubmit={handleUpload}>
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
            <label>Media visibility</label>
            <select
              value={visibility}
              onChange={(event) => setVisibility(event.target.value)}
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
        </div>
       
       <div className="form-group">
  <label>Extra tags optional</label>
  <input
    type="text"
    placeholder="Optional: day1, backstage, chief guest"
    value={tags}
    onChange={(event) => setTags(event.target.value)}
  />
  <small className="field-hint">
    AI tags are generated automatically. Add only event-specific tags if needed.
  </small>
</div>

      <div className="form-group">
  <label>Choose or drop photos/videos</label>

  <div
    className={isDragging ? "drop-zone dragging" : "drop-zone"}
    onDragOver={handleDragOver}
    onDragLeave={handleDragLeave}
    onDrop={handleDrop}
  >
    <p>Drag and drop media files here</p>
    <span>or</span>

    <input
      type="file"
      multiple
      accept="image/*,video/*"
      onChange={handleFileChange}
    />
  </div>

   {files.length > 0 && (
    <p className="selected-files-text">
      {files.length} file(s) selected for upload.
    </p>
  )}
</div>

        {files.length > 0 && (
          <div className="selected-files-preview">
            {files.map((file, index) => (
              <div className="selected-file-card" key={index}>
                {file.type.startsWith("image/") ? (
                  <img src={URL.createObjectURL(file)} alt={file.name} />
                ) : (
                  <div className="video-preview-box">Video</div>
                )}

                <p>{file.name}</p>
              </div>
            ))}
          </div>
        )}

        <button className="primary-btn" type="submit">
          Upload Media
        </button>

        {message && <p className="form-message">{message}</p>}
      </form>
    </section>
  );
}

export default MediaUploadSection;