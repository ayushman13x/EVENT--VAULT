import MediaUploadSection from "../components/MediaUploadSection";
import MediaGallery from "../components/MediaGallery";
import PendingApprovalNotice from "../components/PendingApprovalNotice";
function GalleryPage({ token, user, refreshMedia, refreshMediaCount , isPendingUser}) {
  if (isPendingUser) {
  return <PendingApprovalNotice />;
}
  
  return (
    <main className="gallery-page">
      <section className="gallery-hero">
        <p className="eyebrow-text">Media workspace</p>
        <h1>Upload, organize, search, and interact with event memories.</h1>
        <p>
          Photographers can upload assigned event media, while viewers and club
          members can browse albums, search by tags, comment, favourite, share,
          and download protected copies.
        </p>
      </section>

      <MediaUploadSection
        token={token}
        user={user}
        refreshMedia={refreshMedia}
      />

      <MediaGallery refreshMediaCount={refreshMediaCount} token={token} />
    </main>
  );
}

export default GalleryPage;