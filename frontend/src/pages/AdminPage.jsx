import AdminRequestsPanel from "../components/AdminRequestsPanel";
import AdminPhotographerPanel from "../components/AdminPhotographerPanel";
import CreateEventForm from "../components/CreateEventForm";

function AdminPage({
  token,
  isAdmin,
  editingEvent,
  setEditingEvent,
  handleEventSaved,
}) {
  if (!isAdmin) {
    return (
      <section className="permission-note-section page-space">
        <p>Please login as admin to access the admin dashboard.</p>
      </section>
    );
  }

  return (
    <main className="admin-page">
      <section className="dashboard-hero">
        <p className="eyebrow-text">Admin dashboard</p>
        <h1>Manage events, approvals, and photographer assignments.</h1>
        <p>
          Control who can access private media, approve role requests, create
          event albums, and assign photographers to specific events.
        </p>

        <div className="dashboard-stats">
          <div>
            <h3>Role approval</h3>
            <p>Approve members and photographers</p>
          </div>

          <div>
            <h3>Event control</h3>
            <p>Create and manage event albums</p>
          </div>

          <div>
            <h3>Media safety</h3>
            <p>Protect private uploads and downloads</p>
          </div>
        </div>
      </section>

      <AdminRequestsPanel token={token} isAdmin={isAdmin} />

      <AdminPhotographerPanel token={token} isAdmin={isAdmin} />

      <CreateEventForm
        onEventSaved={handleEventSaved}
        editingEvent={editingEvent}
        setEditingEvent={setEditingEvent}
        token={token}
      />
    </main>
  );
}

export default AdminPage;