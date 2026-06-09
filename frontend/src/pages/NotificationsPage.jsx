import { useEffect, useState } from "react";
import PendingApprovalNotice from "../components/PendingApprovalNotice";
import API_URL from "../config";
function NotificationsPage({ token, isPendingUser }) {
  if (isPendingUser) {
    return <PendingApprovalNotice />;
  }

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    if (!token) return;

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setNotifications(data.notifications);
      }

      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      setLoading(false);
    }
  };

  const markAsRead = async () => {
    try {
      await fetch(`${API_URL}/api/notifications/mark-read`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchNotifications();
    } catch (error) {
      console.error("Failed to mark notifications read:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [token]);

  if (!token) {
    return (
      <section className="notifications-page">
        <div className="section-heading">
          <h2>Notifications</h2>
          <p>Please login to view your notifications.</p>
        </div>
      </section>
    );
  }

  return (
    <main className="notifications-page">
      <section className="notifications-hero">
        <p className="eyebrow-text">Activity center</p>
        <h1>Notifications</h1>
        <p>
          See when someone tags you, comments on your media, or when important
          account actions happen.
        </p>

        <button className="secondary-btn" onClick={markAsRead}>
          Mark all as read
        </button>
      </section>

      <section className="notifications-list-section">
        {loading ? (
          <p className="muted-text">Loading notifications...</p>
        ) : notifications.length === 0 ? (
          <p className="muted-text">No notifications yet.</p>
        ) : (
          <div className="notifications-list">
            {notifications.map((notification) => (
              <div
                className={
                  notification.isRead
                    ? "notification-card"
                    : "notification-card unread"
                }
                key={notification._id}
              >
                <div>
                  <h3>{notification.type}</h3>
                  <p>{notification.message}</p>

                  {notification.media && (
                    <small>{notification.media.fileName}</small>
                  )}
                </div>

                {!notification.isRead && <span>New</span>}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default NotificationsPage;