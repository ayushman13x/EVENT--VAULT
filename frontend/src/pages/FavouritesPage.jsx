import { useEffect, useState } from "react";
import PendingApprovalNotice from "../components/PendingApprovalNotice";
import API_URL from "../config";
function FavouritesPage({ token, isPendingUser }) {
  if (isPendingUser) {
    return <PendingApprovalNotice />;
  }
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const getMediaUrl = (fileUrl) => {
  if (fileUrl?.startsWith("http")) {
    return fileUrl;
  }

  return `${API_URL}${fileUrl}`;
};
  useEffect(() => {
    if (!token) {
      return;
    }

    setLoading(true);

    fetch(`${API_URL}/api/media/my/favourites`, {
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
        }

        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch favourites:", error);
        setLoading(false);
      });
  }, [token]);

  if (!token) {
    return (
      <section className="favourites-page">
        <div className="section-heading">
          <h2>My favourites</h2>
          <p>Please login to view your saved media.</p>
        </div>
      </section>
    );
  }

  return (
    <main className="favourites-page">
      <section className="favourites-hero">
        <p className="eyebrow-text">Saved media</p>
        <h1>Your favourite event memories in one place.</h1>
        <p>
          Media you mark as favourite appears here, so you can quickly revisit
          important photos and videos later.
        </p>
      </section>

      <section className="media-gallery-section">
        {loading ? (
          <p className="muted-text">Loading favourites...</p>
        ) : media.length === 0 ? (
          <p className="muted-text">You have not favourited any media yet.</p>
        ) : (
          <div className="media-grid">
            {media.map((item) => (
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
                    <span>{item.event?.title || "Event"}</span>
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
      </section>
    </main>
  );
}

export default FavouritesPage;