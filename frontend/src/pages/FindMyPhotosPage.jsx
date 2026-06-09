import { useEffect, useState } from "react";
import PendingApprovalNotice from "../components/PendingApprovalNotice";
import API_URL from "../config";
function FindMyPhotosPage({ token, isPendingUser }) {
  if (isPendingUser) {
    return <PendingApprovalNotice />;
  }

  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [selfie, setSelfie] = useState(null);
  const [selfiePreview, setSelfiePreview] = useState("");
  const [matchedMedia, setMatchedMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  
  const getMediaUrl = (item) => {
  if (item.displayUrl) {
    return item.displayUrl;
  }

  if (item.fileUrl?.startsWith("http")) {
    return item.fileUrl;
  }

  return `${API_URL}${item.fileUrl}`;
};

  useEffect(() => {
    if (!token) {
      return;
    }

    fetch(`${API_URL}/api/events`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setEvents(data.events);

          if (data.events.length > 0) {
            setSelectedEventId(data.events[0]._id);
          }
        }
      })
      .catch((error) => {
        console.error("Failed to fetch events:", error);
      });
  }, [token]);

  const handleSelfieChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    setSelfie(file);
    setSelfiePreview(URL.createObjectURL(file));
    setMatchedMedia([]);
    setMessage("");
  };

  const handleSearch = async (event) => {
  event.preventDefault();

  if (!selectedEventId) {
    setMessage("Please select an event.");
    return;
  }

  if (!selfie) {
    setMessage("Please upload a reference selfie.");
    return;
  }

  const formData = new FormData();
  formData.append("eventId", selectedEventId);
  formData.append("selfie", selfie);

  try {
    setLoading(true);
    setMessage("");
    setMatchedMedia([]);

    const response = await fetch(
      `${API_URL}/api/media/find-my-photos`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const data = await response.json();

    if (!data.success) {
      setMatchedMedia([]);
      setMessage(data.message || "Face search failed.");
      return;
    }

    const results = Array.isArray(data.media) ? data.media : [];

    setMatchedMedia(results);

    if (results.length > 0) {
      setMessage(`${results.length} matching photo(s) found.`);
    } else {
      setMessage("No matching photos found for this selfie.");
    }
  } catch (error) {
    console.error("Find my photos error:", error);
    setMessage("Something went wrong while searching.");
  } finally {
    setLoading(false);
  }
};

  if (!token) {
    return (
      <section className="find-photos-page">
        <div className="section-heading">
          <h2>Find My Photos</h2>
          <p>Please login to search for your photos.</p>
        </div>
      </section>
    );
  }

  return (
    <main className="find-photos-page">
      <section className="find-photos-hero">
        <p className="eyebrow-text">Personalized discovery</p>
        <h1>Find photos where you appear.</h1>
        <p>
          Upload a clear selfie and select an event album. The system compares
          your selfie with event photos and shows matching images.
        </p>
      </section>

      <section className="find-photos-workspace">
        <form className="find-photos-form" onSubmit={handleSearch}>
          <div className="form-row">
            <div className="form-group">
              <label>Select event album</label>
              <select
                value={selectedEventId}
                onChange={(event) => setSelectedEventId(event.target.value)}
              >
                {events.map((eventItem) => (
                  <option key={eventItem._id} value={eventItem._id}>
                    {eventItem.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Reference selfie</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleSelfieChange}
              />
            </div>
          </div>

          {selfiePreview && (
            <div className="selfie-preview-card">
              <img src={selfiePreview} alt="Reference selfie preview" />
              <div>
                <h3>Reference image selected</h3>
                <p>
                  Use a clear front-facing photo for better face matching
                  results.
                </p>
              </div>
            </div>
          )}

          <button className="primary-btn" type="submit" disabled={loading}>
            {loading ? "Searching..." : "Find My Photos"}
          </button>

          {message && <p className="form-message">{message}</p>}
        </form>

        <div className="find-results">
          {matchedMedia.length === 0 ? (
            <p className="muted-text">
              Matching photos will appear here after search.
            </p>
          ) : (
            <div className="media-grid">
              {matchedMedia.map((item) => (
                <div className="media-card" key={item._id}>
                  <img
  src={getMediaUrl(item)}
  alt={item.fileName}
  onError={(event) => {
    console.error("Image failed to load:", getMediaUrl(item));
    event.currentTarget.style.border = "2px solid red";
  }}
/>

                  <div className="media-card-info">
                    <p>{item.fileName}</p>
                     
                     {/* <small style={{ wordBreak: "break-all", color: "red" }}>
  {getMediaUrl(item)}
</small> */}

                    <div className="media-meta-row">
                      <span>{item.visibility}</span>
                      <span>{item.uploadedBy?.name || "Unknown"}</span>
                    </div>

                    {item.tags?.length > 0 && (
                      <div className="media-tags">
                        {item.tags.map((tag, index) => (
                          <span key={index}>#{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default FindMyPhotosPage;