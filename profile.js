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

const showToast = (message) => {
  const toast = document.querySelector("#toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2600);
};

const bindEditProfile = () => {
  const button = document.querySelector("#editProfile");
  const form = document.querySelector("#editProfileForm");
  if (!button || !form) return;

  const setOpen = (open) => {
    form.classList.toggle("hidden", !open);
    button.setAttribute("aria-expanded", String(open));
    if (open) {
      form.elements.name.value = getStoredUserName();
      form.elements.email.value =
        localStorage.getItem("flexformUserEmail") || "";
      form.elements.name.focus();
    }
  };

  button.addEventListener("click", () => setOpen(form.classList.contains("hidden")));
  document.querySelector("#cancelEdit")?.addEventListener("click", () => {
    setOpen(false);
    button.focus();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = form.elements.name.value.trim();
    const email = window.flexformUsers.normaliseEmail(form.elements.email.value);
    if (!name || !email) return;

    const oldEmail = localStorage.getItem("flexformUserEmail") || "";
    window.flexformUsers.renameEmail(oldEmail, email);
    window.flexformUsers.setName(email, name);
    localStorage.setItem("flexformUserName", name);
    localStorage.setItem("flexformUserEmail", email);

    updateProfileDetails();
    window.flexform.updateUserLabels();
    setOpen(false);
    button.focus();
    showToast("Profile updated");
  });
};

window.addEventListener("DOMContentLoaded", () => {
  if (!isLoggedIn()) {
    window.location.replace("login.html?return=profile.html");
    return;
  }

  updateProfileDetails();
  renderWorkoutHistory();
  bindEditProfile();

  document.querySelector("#app").classList.remove("hidden");
});
