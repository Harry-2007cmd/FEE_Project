import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Topbar() {
  const { user, isLoggedIn, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const notificationButtonRef = useRef(null);
  const notificationPanelRef = useRef(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Theme toggle - mirrors common.js addThemeToggle
  useEffect(() => {
    const actions = document.querySelector(".top-actions");
    const theme = window.flexformTheme;
    if (!actions || !theme || actions.querySelector(".theme-toggle")) return;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "theme-toggle";
    const sync = () => {
      const dark = theme.current() === "dark";
      button.textContent = dark ? "☀" : "☾";
      button.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
      button.title = dark ? "Light mode" : "Dark mode";
    };
    button.addEventListener("click", () => theme.toggle());
    document.addEventListener("flexform:themechange", sync);
    sync();
    actions.insertBefore(button, actions.firstChild);
    return () => {
      document.removeEventListener("flexform:themechange", sync);
      button.remove();
    };
  }, []);

  // Notification panel logic from common.js
  useEffect(() => {
    const button = notificationButtonRef.current;
    const panel = notificationPanelRef.current;
    if (!button || !panel) return;

    button.setAttribute("aria-controls", "notification");
    button.setAttribute("aria-expanded", "false");

    const setOpen = (open) => {
      panel.classList.toggle("show", open);
      button.setAttribute("aria-expanded", String(open));
    };

    const handleClick = () => setOpen(!panel.classList.contains("show"));
    button.addEventListener("click", handleClick);

    const handleDocClick = (event) => {
      if (!event.target.closest("#notification, #notificationButton")) {
        setOpen(false);
      }
    };
    document.addEventListener("click", handleDocClick);

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && panel.classList.contains("show")) {
        setOpen(false);
        button.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      button.removeEventListener("click", handleClick);
      document.removeEventListener("click", handleDocClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isLoggedIn]);

  // Render notifications
  useEffect(() => {
    const panel = notificationPanelRef.current;
    if (!panel) return;
    const items = isLoggedIn() ? window.flexformNotifications || [] : [];
    if (!items.length) {
      panel.textContent = "You're all caught up.";
      return;
    }
    const list = document.createElement("ul");
    list.className = "notification-list";
    items.forEach(({ title, time }) => {
      const item = document.createElement("li");
      const strong = document.createElement("b");
      strong.textContent = title;
      const small = document.createElement("small");
      small.textContent = time;
      item.append(strong, small);
      list.append(item);
    });
    panel.replaceChildren(list);
  }, [isLoggedIn]);

  // Sync .protected-link / .guest-only / .auth-only visibility like common.js applyAuthState
  useEffect(() => {
    const apply = () => {
      const loggedIn = isLoggedIn();
      const isProfilePage = location.pathname === "/profile";
      document.querySelectorAll(".protected-link").forEach((element) => {
        element.classList.toggle("hidden", !loggedIn);
      });
      document.querySelectorAll(".guest-only").forEach((element) => {
        element.classList.toggle("hidden", loggedIn || isProfilePage);
      });
      document.querySelectorAll(".auth-only").forEach((element) => {
        element.classList.toggle("hidden", !loggedIn || isProfilePage);
      });
      document.querySelectorAll(".user-chip--main").forEach((element) => {
        element.classList.toggle("hidden", !loggedIn || isProfilePage);
      });
    };
    apply();
    window.addEventListener("flexform:authchange", apply);
    return () => window.removeEventListener("flexform:authchange", apply);
  }, [isLoggedIn, location.pathname]);

  // Handle protected links
  const handleClick = (event) => {
    const logoutBtn = event.target.closest("[data-logout]");
    if (logoutBtn) {
      logout();
      navigate("/");
      return;
    }

    const protectedLink = event.target.closest('a[href="/profile"], a[href="/planner"]');
    if (protectedLink && !isLoggedIn()) {
      event.preventDefault();
      navigate(`/login?return=${protectedLink.getAttribute("href")}`);
    }
  };

  const firstName = user?.name?.split(/\s+/)[0] || "Friend";
  const initials = user?.name
    ?.split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("") || "F";

  return (
    <header className="topbar" onClick={handleClick}>
      <NavLink className="brand mobile-brand" to="/">
        <span className="brand-mark">⌁</span>
        <b>flexform<span>.</span></b>
      </NavLink>
      <div className="top-message"><i></i> Your wellness, on your terms</div>
      <div className="top-actions">
        <button
          ref={notificationButtonRef}
          id="notificationButton"
          className="icon-button"
          aria-label="Show notifications"
        >
          ♧
        </button>
        <NavLink className="top-auth-link guest-only" to="/login">Log in</NavLink>
        <NavLink className="top-auth-button guest-only" to="/signup">Sign up</NavLink>
        <NavLink
          to="/profile"
          className={`user-chip protected-link auth-only ${!isLoggedIn() ? "hidden" : ""} user-chip--main`}
        >
          <span className="user-avatar-text">{initials}</span>
          <b className="user-name-display">{user?.name || "Alex Lee"}</b>⌄
        </NavLink>
        <button type="button" className={`logout-button auth-only ${!isLoggedIn() ? "hidden" : ""}`} data-logout>
          Log out
        </button>
      </div>
      <div ref={notificationPanelRef} id="notification" className="notification">
        You're all caught up.
      </div>
    </header>
  );
}