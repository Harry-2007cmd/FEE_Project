import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { navSectionFor } from "../../lib/nav.js";

export default function MobileNav({ activePath }) {
  const { user } = useAuth();
  const section = navSectionFor(activePath);
  const cls = (name, extra = "") => `${extra}${section === name ? `${extra ? " " : ""}active` : ""}`;

  return (
    <nav className="mobile-nav">
      <Link to="/" className={cls("home")}>⌂<small>Today</small></Link>
      <Link to="/trainers" className={cls("trainers")}>♧<small>Find a coach</small></Link>
      <Link to="/courses" className={cls("courses")}>▤<small>Courses</small></Link>
      <Link to="/tools" className={cls("tools")}>⌗<small>Tools</small></Link>
      {user && <Link to="/profile" className={cls("profile", "protected-link")}>♙<small>Profile</small></Link>}
    </nav>
  );
}
