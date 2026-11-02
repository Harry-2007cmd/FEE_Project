import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="page active" id="page-not-found" style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "var(--space-5)" }}>
      <div>
        <h1 style={{ fontSize: "clamp(3rem, 10vw, 6rem)", fontWeight: 700, lineHeight: 1, marginBottom: "var(--space-3)", color: "var(--ink)" }}>404</h1>
        <p style={{ fontSize: "var(--text-lg)", color: "var(--stone)", marginBottom: "var(--space-5)" }}>The page you're looking for doesn't exist.</p>
        <Link to="/" className="action-button" style={{ display: "inline-block" }}>Back home →</Link>
      </div>
    </section>
  );
}