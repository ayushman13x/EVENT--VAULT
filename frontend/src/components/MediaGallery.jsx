import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import API_URL from "../config";
function MediaGallery({ refreshMediaCount, token }) {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
const [userSearchText, setUserSearchText] = useState("");
const [searchUsers, setSearchUsers] = useState([]);
  const [searchParams] = useSearchParams();
  const eventIdFromUrl = searchParams.get("event");
  const [actionMessage, setActionMessage] = useState("");
const getMediaUrl = (fileUrl) => {
  if (fileUrl?.startsWith("http")) {
    return fileUrl;
  }

  return `${API_URL}${fileUrl}`;
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
        if (!data.success) {
          setEvents([]);
          return;
        }

        setEvents(data.events);

        if (data.events.length > 0) {
          const eventExistsInList = data.events.some(
            (event) => event._id === eventIdFromUrl
          );

          if (eventIdFromUrl && eventExistsInList) {
            setSelectedEventId(eventIdFromUrl);
          } else {
            setSelectedEventId(data.events[0]._id);
          }
        }
      })
      .catch((error) => console.error("Failed to fetch events:", error));
  }, [token, eventIdFromUrl]);

  useEffect(() => {
    if (!selectedEventId || !token) {
      return;
    }

    setLoading(true);

    fetch(`${API_URL}/api/media/event/${selectedEventId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setMedia(data.media);
        } else {
          setMedia([]);
          console.error(data.message);
        }

        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch media:", error);
        setLoading(false);
      });
  }, [selectedEventId, refreshMediaCount, token]);

 const showActionMessage = (message) => {
  setActionMessage(message);

  setTimeout(() => {
    setActionMessage("");
  }, 2500);
};

  const handleLike = async (mediaId) => {
    try {
      const response = await fetch(
        `${API_URL}/api/media/${mediaId}/like`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setMedia((previousMedia) =>
          previousMedia.map((item) =>
            item._id === mediaId ? data.media : item
          )
        );
      } else {
        showActionMessage(data.message || "Failed to like media.");
      }
    } catch (error) {
      console.error("Like error:", error);
      showActionMessage("Something went wrong while liking media.");
    }
  };

  const handleFavourite = async (mediaId) => {
    try {
      const response = await fetch(
        `${API_URL}/api/media/${mediaId}/favourite`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setMedia((previousMedia) =>
          previousMedia.map((item) =>
            item._id === mediaId ? data.media : item
          )
        );
      } else {
        showActionMessage(data.message || "Failed to favourite media.");
      }
    } catch (error) {
      console.error("Favourite error:", error);
      showActionMessage("Something went wrong while favouriting media.");
    }
  };

  const handleComment = async (mediaId, commentText) => {
    if (!commentText.trim()) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/media/${mediaId}/comment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text: commentText }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setMedia((previousMedia) =>
          previousMedia.map((item) =>
            item._id === mediaId ? data.media : item
          )
        );
      } else {
        showActionMessage(data.message || "Failed to add comment.");
      }
    } catch (error) {
      console.error("Comment error:", error);
      showActionMessage("Something went wrong while adding comment.");
    }
  };

  const handleDownload = async (mediaId, fileName) => {
    try {
      const response = await fetch(
        `${API_URL}/api/media/${mediaId}/download`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Download failed status:", response.status);
        console.error("Download failed response:", errorText);
        showActionMessage(`Download failed. Status: ${response.status}`);
        return;
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Download error:", error);
      showActionMessage("Something went wrong while downloading.");
    }
  };

 const handleShare = async (fileUrl) => {
  const shareLink = getMediaUrl(fileUrl);

  try {
    await navigator.clipboard.writeText(shareLink);
    showActionMessage("Media link copied to clipboard.");
  } catch (error) {
    console.error("Share error:", error);
   showActionMessage("Could not copy link.");
  }
};

  const handleUserSearch = async (searchValue) => {
  setUserSearchText(searchValue);

  if (!searchValue.trim()) {
    setSearchUsers([]);
    return;
  }

  try {
    const response = await fetch(
      `${API_URL}/api/users/search?search=${searchValue}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (data.success) {
      setSearchUsers(data.users);
    }
  } catch (error) {
    console.error("User search error:", error);
  }
};
const handleTagUser = async (mediaId, userId) => {
  try {
    const response = await fetch(
      `${API_URL}/api/media/${mediaId}/tag-user`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      }
    );

    const data = await response.json();

    if (data.success) {
      setMedia((previousMedia) =>
        previousMedia.map((item) =>
          item._id === mediaId ? data.media : item
        )
      );

      setUserSearchText("");
      setSearchUsers([]);
      showActionMessage(data.message);
    } else {
      showActionMessage(data.message || "Failed to tag user.");
    }
  } catch (error) {
    console.error("Tag user error:", error);
    showActionMessage("Something went wrong while tagging user.");
  }
};

  const filteredMedia = media.filter((item) => {
  const search = searchText.toLowerCase();

  const fileName = item.fileName?.toLowerCase() || "";
  const uploaderName = item.uploadedBy?.name?.toLowerCase() || "";
  const visibility = item.visibility?.toLowerCase() || "";
  const tags = item.tags?.join(" ").toLowerCase() || "";

  const eventName = item.event?.title?.toLowerCase() || "";
  const eventCategory = item.event?.category?.toLowerCase() || "";

  const uploadDate = item.createdAt
    ? new Date(item.createdAt).toLocaleDateString().toLowerCase()
    : "";

  const uploadDateIso = item.createdAt
    ? new Date(item.createdAt).toISOString().slice(0, 10).toLowerCase()
    : "";

  return (
    fileName.includes(search) ||
    uploaderName.includes(search) ||
    visibility.includes(search) ||
    tags.includes(search) ||
    eventName.includes(search) ||
    eventCategory.includes(search) ||
    uploadDate.includes(search) ||
    uploadDateIso.includes(search)
  );
});

const selectedEvent = events.find((event) => event._id === selectedEventId);
  if (!token) {
    return (
      <section className="media-gallery-section">
       <div className="section-heading">
  <h2>Event media gallery</h2>

  {selectedEvent && (
    <p className="selected-album-text">
      Viewing album: <strong>{selectedEvent.title}</strong>
      {selectedEvent.eventScope === "club" && selectedEvent.clubName
        ? ` · ${selectedEvent.clubName}`
        : " · General event"}
    </p>
  )}

  <p>
    View photos and videos uploaded under each event album. Search by filename,
    uploader, visibility, or tags.
  </p>
</div>
      </section>
    );
  }

  return (
    <section className="media-gallery-section">
      <div className="section-heading">
        <h2>Event media gallery</h2>
        <p>
          View photos and videos uploaded under each event album. Search by
          filename, uploader, visibility, or tags.
        </p>
      </div>
       
       {actionMessage && (
  <p className="action-message">
    {actionMessage}
  </p>
)}

      <div className="gallery-toolbar">
        <div className="form-group">
          <label>Choose event album</label>
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
          <label>Search media</label>
          <input
            type="text"
            placeholder="Search by file, uploader, visibility, or tag..."
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <p className="muted-text">Loading media...</p>
      ) : filteredMedia.length === 0 ? (
        <p className="muted-text">No media uploaded for this event yet.</p>
      ) : (
        <div className="media-grid">
          {filteredMedia.map((item) => (
            <div className="media-card" key={item._id}>
              {item.fileType === "image" ? (
                <img
                  src={getMediaUrl(item.fileUrl)}
                  alt={item.fileName}
                />
              ) : (
                <video controls src={getMediaUrl(item.fileUrl)} />
              )}

              <div className="media-card-info">
                <p>{item.fileName}</p>

                <div className="media-meta-row">
  <span>{item.visibility}</span>
  <span>{item.uploadedBy?.name || "Unknown"}</span>
</div>

<div className="media-meta-row">
  <span>{item.event?.title || selectedEvent?.title || "Event"}</span>
  <span>
    {item.createdAt
      ? new Date(item.createdAt).toLocaleDateString()
      : "No date"}
  </span>
</div>

                {item.tags?.length > 0 && (
                  <div className="media-tags">
                    {item.tags.map((tag, index) => (
                      <span key={index}>#{tag}</span>
                    ))}
                  </div>
                )}

                <div className="media-actions">
                  <button onClick={() => handleLike(item._id)}>
                    Like · {item.likes?.length || 0}
                  </button>

                  <button onClick={() => handleFavourite(item._id)}>
                    Favourite · {item.favourites?.length || 0}
                  </button>

                  <button onClick={() => handleShare(item.fileUrl)}>
                    Share
                  </button>

                  <button
                    className="download-btn"
                    onClick={() => handleDownload(item._id, item.fileName)}
                  >
                    Download
                  </button>
                </div>
               <div className="tag-user-box">
  <input
    type="text"
    placeholder="Search user to tag..."
    value={userSearchText}
    onChange={(event) => handleUserSearch(event.target.value)}
  />

  {searchUsers.length > 0 && (
    <div className="tag-user-results">
      {searchUsers.map((searchedUser) => (
        <button
          key={searchedUser._id}
          onClick={() => handleTagUser(item._id, searchedUser._id)}
        >
          {searchedUser.name} · {searchedUser.role}
        </button>
      ))}
    </div>
  )}

  {item.taggedUsers?.length > 0 && (
    <div className="tagged-users">
      <p>Tagged:</p>
      {item.taggedUsers.map((taggedUser) => (
        <span key={taggedUser._id}>{taggedUser.name}</span>
      ))}
    </div>
  )}
</div>

                <div className="comment-box">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        handleComment(item._id, event.target.value);
                        event.target.value = "";
                      }
                    }}
                  />

                  <div className="comments-list">
                    {(item.comments || []).slice(-2).map((comment) => (
                      <p key={comment._id}>
                        <strong>{comment.user?.name || "User"}:</strong>{" "}
                        <span>{comment.text}</span>
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default MediaGallery;