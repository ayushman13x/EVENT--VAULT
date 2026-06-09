import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./App.css";
import FavouritesPage from "./pages/FavouritesPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import NotificationsPage from "./pages/NotificationsPage";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import AdminPage from "./pages/AdminPage";
import GalleryPage from "./pages/GalleryPage";
import EventsPage from "./pages/EventsPage";
import FindMyPhotosPage from "./pages/FindMyPhotosPage";
function App() {
  const [refreshEvents, setRefreshEvents] = useState(0);
  const [editingEvent, setEditingEvent] = useState(null);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [refreshMediaCount, setRefreshMediaCount] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    const savedUser = localStorage.getItem("eventvault_user");
    const savedToken = localStorage.getItem("eventvault_token");

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
  }, []);

  const handleEventSaved = () => {
    setRefreshEvents(refreshEvents + 1);
    setEditingEvent(null);
  };

  const refreshMedia = () => {
    setRefreshMediaCount(refreshMediaCount + 1);
  };

  const handleEditEvent = (event) => {
  setEditingEvent(event);
  navigate("/admin");
};

  const isAdmin = user?.role === "admin";
   const isPendingUser =
  user?.approvalStatus === "pending" && user?.requestedRole !== "none";

  return (
    <div className="home-page">
     <Navbar user={user} setUser={setUser} setToken={setToken} />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/favourites" element={<FavouritesPage token={token} isPendingUser={isPendingUser}/>} />
        <Route path="/notifications" element={<NotificationsPage token={token} isPendingUser={isPendingUser}/>} />
        <Route path="/find-my-photos" element={<FindMyPhotosPage token={token} isPendingUser={isPendingUser}/>} />
        <Route
          path="/auth"
          element={
            <AuthPage user={user} setUser={setUser} setToken={setToken} />
          }
        />

        <Route
          path="/admin"
          element={
            <AdminPage
              token={token}
              isAdmin={isAdmin}
              editingEvent={editingEvent}
              setEditingEvent={setEditingEvent}
              handleEventSaved={handleEventSaved}
            />
          }
        />

        <Route
          path="/gallery"
          element={
            <GalleryPage
              token={token}
              user={user}
              isPendingUser={isPendingUser}
              refreshMedia={refreshMedia}
              refreshMediaCount={refreshMediaCount}
            />
          }
        />

        <Route
          path="/events"
          element={
            <EventsPage
              refreshEvents={refreshEvents}
              onEditEvent={handleEditEvent}
              token={token}
              isAdmin={isAdmin}
              isPendingUser={isPendingUser}
            />
          }
        />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;