import { NavLink } from "react-router-dom";

export default function Sidebar({ activePath }) {
  return (
    <aside className="sidebar">
      <NavLink className="brand" to="/">
        <span className="brand-mark">⌁</span>
        <b>flexform<span>.</span></b>
      </NavLink>
      <p className="side-label">Your rhythm</p>
      <nav className="side-nav">
        <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>
          ⌂ <span>Today</span>
        </NavLink>
        <NavLink to="/trainers" className={({ isActive }) => isActive ? "active" : ""}>
          ♧ <span>Find a coach</span>
        </NavLink>
        <NavLink to="/courses" className={({ isActive }) => isActive ? "active" : ""}>
          ▤ <span>Courses</span>
        </NavLink>
        <NavLink to="/tools" className={({ isActive }) => isActive ? "active" : ""}>
          ⌗ <span>Tools</span>
        </NavLink>
      </nav>
      <p className="side-label keep-label">Keep going</p>
      <NavLink to="/profile" className={({ isActive }) => `side-link protected-link${isActive ? " active" : ""}`}>
        ♙ <span>My progress</span>
      </NavLink>
      <NavLink to="/planner" className={({ isActive }) => `side-link protected-link${isActive ? " active" : ""}`}>
        ▦ <span>My planner</span>
      </NavLink>
      <div className="side-prompt">
        <strong>Your next good choice is one tap away.</strong>
        <NavLink to="/trainers">Meet a coach →</NavLink>
      </div>
      <NavLink className="side-link" to="/login">⚙ <span>Sign in</span></NavLink>
    </aside>
  );
}