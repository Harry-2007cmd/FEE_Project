const select = (selector) => document.querySelector(selector);
const isLoggedIn = () => localStorage.getItem("fitlyLoggedIn") === "true";

const getStoredUserName = () => {
  const storedName = localStorage.getItem("flexformUserName")?.trim();
  return storedName || "Friend";
};

const getUserInitials = (name = getStoredUserName()) => {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");

  return initials || "F";
};

const updateUserLabels = () => {
  const userName = getStoredUserName();
  const initials = getUserInitials(userName);
  const firstName = userName.split(/\s+/)[0] || "Friend";

  document.querySelectorAll(".user-name-display").forEach((element) => {
    element.textContent = userName;
  });

  document.querySelectorAll(".user-avatar-text").forEach((element) => {
    element.textContent = initials;
  });

  document.querySelectorAll("[data-greeting-name]").forEach((element) => {
    element.textContent = `${firstName}.`;
  });
};

const todaySchedule = [
  { time: "6:30 PM", title: "Strength foundations", coach: "with Maya Chen", type: "Coach session" },
  { time: "8:00 AM", title: "Desk reset", coach: "Self-guided course", type: "Mobility" },
  { time: "7:15 PM", title: "Recovery check-in", coach: "with Arjun Patel", type: "Reset" },
];

const renderTodaySchedule = () => {
  const scheduleList = document.getElementById("todaySchedule");
  if (!scheduleList) return;

  scheduleList.innerHTML = todaySchedule
    .map(
      (item) => `
        <div class="schedule-item">
          <span class="schedule-time">${item.time}</span>
          <div>
            <strong>${item.title}</strong>
            <small>${item.coach}</small>
          </div>
          <span class="history-pill">${item.type}</span>
        </div>
      `,
    )
    .join("");
};

const updateAuthUI = () => {
  const loggedIn = isLoggedIn();
  const isProfilePage = window.location.pathname.endsWith("profile.html");

  document.querySelectorAll(".auth-only").forEach((element) => {
    element.classList.toggle("hidden", !loggedIn || isProfilePage);
  });

  document.querySelectorAll(".guest-only").forEach((element) => {
    element.classList.toggle("hidden", loggedIn || isProfilePage);
  });

  document.querySelectorAll(".user-chip--main").forEach((element) => {
    element.classList.toggle("hidden", !loggedIn || isProfilePage);
  });

  document.querySelectorAll(".protected-link").forEach((element) => {
    element.classList.toggle("hidden", !loggedIn);
  });

  document.querySelectorAll('a[href="login.html"], a[href="signup.html"]').forEach((element) => {
    const onAuthPage = ["login.html", "signup.html"].includes(
      window.location.pathname.split("/").pop(),
    );
    element.classList.toggle("hidden", loggedIn && !onAuthPage);
  });

  const isHomePage = window.location.pathname.endsWith("index.html") || window.location.pathname === "/" || window.location.pathname.endsWith("/");
  const guestHome = document.getElementById("page-home-guest");
  const memberHome = document.getElementById("page-home-member");

  if (isHomePage) {
    guestHome?.classList.toggle("hidden", loggedIn);
    memberHome?.classList.toggle("hidden", !loggedIn);
  }

  if (loggedIn) {
    updateUserLabels();
  }
};

window.addEventListener("DOMContentLoaded", () => {
  const hasSeenEntry = localStorage.getItem("flexformEntrySeen") === "true";

  if (!hasSeenEntry && (window.location.pathname.endsWith("index.html") || window.location.pathname === "/" || window.location.pathname.endsWith("/"))) {
    window.location.href = "load.html";
    return;
  }

  updateAuthUI();
  renderTodaySchedule();

  select("#notificationButton")?.addEventListener("click", () => {
    select("#notification")?.classList.toggle("show");
  });

  document.addEventListener("click", (event) => {
    const protectedLink = event.target.closest('a[href="profile.html"]');
    if (protectedLink && !isLoggedIn()) {
      event.preventDefault();
      window.location.href = "login.html?return=profile.html";
      return;
    }

    if (event.target.closest("[data-logout]")) {
      localStorage.removeItem("fitlyLoggedIn");
      window.location.href = "index.html";
      return;
    }

    const completeButton = event.target.closest("[data-complete]");
    if (completeButton) {
      completeButton.innerHTML = "Flow marked complete ✓";
      const toast = select("#toast");
      if (toast) {
        toast.textContent = "Your flow is complete. That counts.";
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 2600);
      }
    }
  });
});
