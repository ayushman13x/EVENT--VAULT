import RegisterSection from "../components/RegisterSection";
import LoginSection from "../components/LoginSection";

function AuthPage({ user, setUser, setToken }) {
  return (
    <section className="auth-page">
      <div className="auth-intro">
        <p className="eyebrow-text">Account access</p>
        <h1>Sign in to manage and explore event media.</h1>
        <p>
          View public event albums as a viewer, request club membership, or get
          photographer access after admin approval.
        </p>

        <div className="auth-points">
          <span>Viewer access</span>
          <span>Member approval</span>
          <span>Photographer uploads</span>
          <span>Admin controls</span>
        </div>
      </div>

      <div className="auth-cards">
        <LoginSection user={user} setUser={setUser} setToken={setToken} />

        {!user && <RegisterSection setUser={setUser} setToken={setToken} />}
      </div>
    </section>
  );
}

export default AuthPage;