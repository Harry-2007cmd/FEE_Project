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

const workoutHistory = [
  { title: "Strength foundations", date: "Tue 6:30 PM", label: "Completed", badge: "SF" },
  { title: "Desk reset", date: "Mon 8 min", label: "Completed", badge: "DR" },
  { title: "Recovery check-in", date: "Sun 12:15 PM", label: "Logged", badge: "RC" },
  { title: "Mobility flow", date: "Sat 15 min", label: "Completed", badge: "MF" },
];

const renderWorkoutHistory = () => {
  const historyList = document.getElementById("workoutHistory");
  if (!historyList) return;

  historyList.innerHTML = workoutHistory
    .map(
      (item) => `
        <div class="history-item">
          <span class="history-badge">${item.badge}</span>
          <div class="history-meta">
            <strong>${item.title}</strong>
            <small>${item.date}</small>
          </div>
          <span class="history-pill">${item.label}</span>
        </div>
      `,
    )
    .join("");
};

const updateProfileDetails = () => {
  const userName = getStoredUserName();
  const initials = getUserInitials(userName);

  const nameNode = document.querySelector(".profile-name-display");
  if (nameNode) nameNode.textContent = userName;

  const avatarNode = document.getElementById("profileAvatar");
  if (avatarNode) avatarNode.textContent = initials;

  const profileEmail = localStorage.getItem("flexformUserEmail")?.trim();
  const emailNode = document.getElementById("profileEmail");
  if (emailNode) {
    emailNode.textContent = profileEmail || "you@example.com";
  }
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

  document.querySelectorAll('a[href="login.html"], a[href="signup.html"]').forEach((element) => {
    const onAuthPage = ["login.html", "signup.html"].includes(
      window.location.pathname.split("/").pop(),
    );
    element.classList.toggle("hidden", loggedIn && !onAuthPage);
  });
};

window.addEventListener("DOMContentLoaded", () => {
  if (!isLoggedIn()) {
    window.location.replace("login.html?return=profile.html");
    return;
  }

  updateAuthUI();
  updateProfileDetails();
  renderWorkoutHistory();

  document.querySelector("#app").classList.remove("hidden");
  document
    .querySelector("#notificationButton")
    ?.addEventListener("click", () =>
      document.querySelector("#notification")?.classList.toggle("show"),
    );

  document.querySelector("[data-logout]")?.addEventListener("click", () => {
    localStorage.removeItem("fitlyLoggedIn");
    window.location.href = "index.html";
  });
});
