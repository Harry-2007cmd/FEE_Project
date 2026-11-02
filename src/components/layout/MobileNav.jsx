import { NavLink } from "react-router-dom";

export default function MobileNav({ activePath }) {
  return (
    <nav className="mobile-nav">
      <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>
        ⌂<small>Today</small>
      </NavLink>
      <NavLink to="/trainers" className={({ isActive }) => isActive ? "active" : ""}>
        ♧<small>Find a coach</small>
      </NavLink>
      <NavLink to="/courses" className={({ isActive }) => isActive ? "active" : ""}>
        ▤<small>Courses</small>
      </NavLink>
      <NavLink to="/tools" className={({ isActive }) => isActive ? "active" : ""}>
        ⌗<small>Tools</small>
      </NavLink>
      <NavLink to="/profile" className={({ isActive }) => `protected-link${isActive ? " active" : ""}`}>
        ♙<small>Profile</small>
      </NavLink>
    </nav>
  );
}