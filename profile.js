const { isLoggedIn, getStoredUserName, getUserInitials } = window.flexform;

// Mock workout history (frontend-only, not from a backend).
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

window.addEventListener("DOMContentLoaded", () => {
  if (!isLoggedIn()) {
    window.location.replace("login.html?return=profile.html");
    return;
  }

  updateProfileDetails();
  renderWorkoutHistory();

  document.querySelector("#app").classList.remove("hidden");
});
