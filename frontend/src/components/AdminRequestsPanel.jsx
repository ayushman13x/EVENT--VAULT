import { useEffect, useState } from "react";
import API_URL from "../config";
function AdminRequestsPanel({ token, isAdmin }) {
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchPendingRequests = async () => {
    if (!isAdmin || !token) {
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/users/pending-requests`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setRequests(data.users);
      } else {
        setMessage(data.message || "Failed to fetch requests.");
      }
    } catch (error) {
      console.error("Fetch pending requests error:", error);
      setMessage("Something went wrong while loading requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingRequests();
  }, [token, isAdmin]);

  const handleApprove = async (userId) => {
    try {
      const response = await fetch(
        `${API_URL}/api/users/approve/${userId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setMessage("Request approved.");
        setRequests(requests.filter((user) => user._id !== userId));
      } else {
        setMessage(data.message || "Failed to approve request.");
      }
    } catch (error) {
      console.error("Approve request error:", error);
      setMessage("Something went wrong while approving request.");
    }
  };

  const handleReject = async (userId) => {
    try {
      const response = await fetch(
        `${API_URL}/api/users/reject/${userId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (data.success) {
        setMessage("Request rejected.");
        setRequests(requests.filter((user) => user._id !== userId));
      } else {
        setMessage(data.message || "Failed to reject request.");
      }
    } catch (error) {
      console.error("Reject request error:", error);
      setMessage("Something went wrong while rejecting request.");
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <section className="admin-requests-section">
      <div className="section-heading">
        <h2>Member access requests</h2>
        <p>
          Review people who asked to join as club members or photographers.
          Approved users get access based on their assigned role.
        </p>
      </div>

      <div className="requests-panel">
        {loading ? (
          <p className="muted-text">Loading requests...</p>
        ) : requests.length === 0 ? (
          <p className="muted-text">No pending requests right now.</p>
        ) : (
          <div className="requests-list">
            {requests.map((requestUser) => (
              <div className="request-card" key={requestUser._id}>
                <div>
                  <h3>{requestUser.name}</h3>
                  <p>{requestUser.email}</p>
                  <p>
                    Wants to join as{" "}
                    <strong>{requestUser.requestedRole}</strong>
                  </p>
                  <p>{requestUser.clubName || "No club added"}</p>
                </div>

                <div className="request-actions">
                  <button
                    className="approve-btn"
                    onClick={() => handleApprove(requestUser._id)}
                  >
                    Approve
                  </button>

                  <button
                    className="reject-btn"
                    onClick={() => handleReject(requestUser._id)}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {message && <p className="form-message">{message}</p>}
      </div>
    </section>
  );
}

export default AdminRequestsPanel;