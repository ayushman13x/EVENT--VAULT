import EventsPreview from "../components/EventsPreview";
import PendingApprovalNotice from "../components/PendingApprovalNotice";
  
function EventsPage({ refreshEvents, onEditEvent, token, isAdmin, isPendingUser }) {
  if (isPendingUser) {
    return <PendingApprovalNotice />;
  }

  return (
    <main className="events-page">
      <section className="events-hero">
        <p className="eyebrow-text">Event albums</p>
        <h1>Browse organized albums across clubs and campus events.</h1>
        <p>
          Events can be public or private, club-specific or general. Access is
          controlled by role, club membership, and admin approval.
        </p>
      </section>

      <EventsPreview
        refreshEvents={refreshEvents}
        onEditEvent={onEditEvent}
        token={token}
        isAdmin={isAdmin}
      />
    </main>
  );
}

export default EventsPage;