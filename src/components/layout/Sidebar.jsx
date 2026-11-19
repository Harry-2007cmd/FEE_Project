import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { navSectionFor } from "../../lib/nav.js";

export default function Sidebar({ activePath }) {
  const { user } = useAuth();
  const section = navSectionFor(activePath);
  const cls = (name, extra = "") => `${extra}${section === name ? `${extra ? " " : ""}active` : ""}`;

  return (
    <aside className="sidebar">
      <Link className="brand" to="/">
        <span className="brand-mark">⌁</span>
        <b>flexform<span>.</span></b>
      </Link>
      <p className="side-label">Your rhythm</p>
      <nav className="side-nav">
        <Link to="/" className={cls("home")} aria-current={section === "home" ? "page" : undefined}>⌂ <span>Today</span></Link>
        <Link to="/trainers" className={cls("trainers")}>♧ <span>Find a coach</span></Link>
        <Link to="/courses" className={cls("courses")}>▤ <span>Courses</span></Link>
        <Link to="/tools" className={cls("tools")}>⌗ <span>Tools</span></Link>
      </nav>
      <p className="side-label keep-label">Keep going</p>
      {user && (
        <>
          <Link to="/profile" className={cls("profile", "side-link protected-link")}>♙ <span>My progress</span></Link>
          <Link to="/planner" className={cls("planner", "side-link protected-link")}>▦ <span>My planner</span></Link>
        </>
      )}
      <div className="side-prompt">
        <strong>Your next good choice is one tap away.</strong>
        <Link to="/trainers">Meet a coach →</Link>
      </div>
      {!user && <Link className="side-link" to="/login">⚙ <span>Sign in</span></Link>}
    </aside>
  );
}
