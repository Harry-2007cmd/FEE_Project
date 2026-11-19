import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const initialsOf = (name) =>
  (name || "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("") || "F";

function ThemeToggle() {
  const [theme, setTheme] = useState(() => window.flexformTheme?.current() || "light");
  useEffect(() => {
    const sync = () => setTheme(window.flexformTheme?.current() || "light");
    document.addEventListener("flexform:themechange", sync);
    return () => document.removeEventListener("flexform:themechange", sync);
  }, []);
  const dark = theme === "dark";
  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Light mode" : "Dark mode"}
      onClick={() => window.flexformTheme?.toggle()}
    >
      {dark ? "☀" : "☾"}
    </button>
  );
}

export default function Topbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const buttonRef = useRef(null);
  const [open, setOpen] = useState(false);

  const loggedIn = Boolean(user);
  const onProfile = location.pathname === "/profile";
  const notifications = loggedIn ? window.flexformNotifications || [] : [];

  // Close the panel on outside click, Escape, or navigation.
  useEffect(() => { setOpen(false); }, [location.pathname]);
  useEffect(() => {
    if (!open) return undefined;
    const onClick = (event) => {
      if (!event.target.closest("#notification, #notificationButton")) setOpen(false);
    };
    const onKey = (event) => {
      if (event.key === "Escape") { setOpen(false); buttonRef.current?.focus(); }
    };
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="topbar">
      <Link className="brand desktop-brand" to="/">
        <span className="brand-mark">⌁</span>
        <b>flexform<span>.</span></b>
      </Link>
      <div className="top-message"><i></i> Your wellness, on your terms</div>
      <div className="top-actions">
        <ThemeToggle />
        <button
          ref={buttonRef}
          id="notificationButton"
          type="button"
          className="icon-button"
          aria-label="Show notifications"
          aria-controls="notification"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          ♧
        </button>
        {!loggedIn && !onProfile && (
          <>
            <Link className="top-auth-link guest-only" to="/login">Log in</Link>
            <Link className="top-auth-button guest-only" to="/signup">Sign up</Link>
          </>
        )}
        {loggedIn && !onProfile && (
          <>
            <Link to="/profile" className="user-chip protected-link auth-only user-chip--main">
              <span className="user-avatar-text">{initialsOf(user.name)}</span>
              <b className="user-name-display">{user.name}</b>⌄
            </Link>
            <button type="button" className="logout-button auth-only" data-logout onClick={handleLogout}>
              Log out
            </button>
          </>
        )}
      </div>
      <div id="notification" className={`notification${open ? " show" : ""}`}>
        {notifications.length ? (
          <ul className="notification-list">
            {notifications.map(({ title, time }) => (
              <li key={`${title}-${time}`}><b>{title}</b><small>{time}</small></li>
            ))}
          </ul>
        ) : (
          "You’re all caught up."
        )}
      </div>
    </header>
  );
}
