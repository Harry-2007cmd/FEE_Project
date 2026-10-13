const select = (selector) => document.querySelector(selector);

// Mock schedule data (frontend-only, not from a backend).
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

// Switch between the guest and member versions of the home page.
const updateHomeView = () => {
  const loggedIn = window.flexform.isLoggedIn();
  select("#page-home-guest")?.classList.toggle("hidden", loggedIn);
  select("#page-home-member")?.classList.toggle("hidden", !loggedIn);
};

window.addEventListener("DOMContentLoaded", () => {
  const siteLoader = document.getElementById("siteLoader");
  if (siteLoader) {
    window.setTimeout(() => siteLoader.remove(), 1600);
  }

  updateHomeView();
  renderTodaySchedule();

  document.addEventListener("click", (event) => {
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
