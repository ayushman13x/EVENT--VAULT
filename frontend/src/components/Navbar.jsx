import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_URL from "../config";
function Navbar({ user, setUser, setToken }) {
  const [unreadCount, setUnreadCount] = useState(0);

  const token = localStorage.getItem("eventvault_token");

  const fetchUnreadNotifications = async () => {
    if (!user || !token) {
      setUnreadCount(0);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        const unread = data.notifications.filter(
          (notification) => !notification.isRead
        ).length;

        setUnreadCount(unread);
      }
    } catch (error) {
      console.error("Failed to fetch notification count:", error);
    }
  };

  useEffect(() => {
    fetchUnreadNotifications();

    const intervalId = setInterval(() => {
      fetchUnreadNotifications();
    }, 10000);

    return () => clearInterval(intervalId);
  }, [user]);

  const handleLogout = () => {
    setUser(null);
    setToken("");
    setUnreadCount(0);

    localStorage.removeItem("eventvault_user");
    localStorage.removeItem("eventvault_token");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        EventVault
      </Link>

      <div className="nav-links">
        <Link to="/events">Events</Link>
        <Link to="/gallery">Gallery</Link>

        {user && <Link to="/favourites">Favourites</Link>}

        {user && (
          <Link to="/notifications">
            Notifications
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </Link>
        )}

        {user && <Link to="/find-my-photos">Find My Photos</Link>}

        {user?.role === "admin" && <Link to="/admin">Admin</Link>}

        {user ? (
          <>
            <Link to="/auth">{user.name}</Link>
            <button className="nav-logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/auth">Login</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;