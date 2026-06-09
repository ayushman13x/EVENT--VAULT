function PendingApprovalNotice() {
  return (
    <section className="pending-approval-section">
      <div className="pending-approval-card">
        <p className="eyebrow-text">Approval pending</p>
        <h2>Your account request is under review.</h2>
        <p>
          You can sign in, but event albums, gallery access, media actions, and
          personalized features will unlock only after an admin approves your
          request.
        </p>
      </div>
    </section>
  );
}

export default PendingApprovalNotice;