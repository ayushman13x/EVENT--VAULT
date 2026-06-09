function FeaturesSection() {
  return (
    <section className="features-section">
      <div className="section-heading">
        <h2>Everything clubs need to manage event media</h2>
        <p>
          Organize event memories, control access, and help members discover
          photos faster with smart tools.
        </p>
      </div>

      <div className="features-grid">
        <div className="feature-card">
          <h3>Event-wise Albums</h3>
          <p>
            Create events and organize photos or videos into clean albums for
            easy browsing.
          </p>
        </div>

        <div className="feature-card">
          <h3>Secure Access Control</h3>
          <p>
            Keep some media public and restrict private albums only to verified
            club members.
          </p>
        </div>

        <div className="feature-card">
          <h3>Bulk Media Uploads</h3>
          <p>
            Allow photographers to upload multiple photos and videos with
            preview support.
          </p>
        </div>

        <div className="feature-card">
          <h3>AI Image Tagging</h3>
          <p>
            Automatically generate tags like sports, crowd, stage, trip, or
            workshop for faster search.
          </p>
        </div>

        <div className="feature-card">
          <h3>Find My Photos</h3>
          <p>
            Let members upload a selfie and discover event photos where they
            appear.
          </p>
        </div>

        <div className="feature-card">
          <h3>Social Interactions</h3>
          <p>
            Members can like, comment, share, download, and save their favourite
            event memories.
          </p>
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;