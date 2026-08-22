const isLoggedIn = () => localStorage.getItem("fitlyLoggedIn") === "true";

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
  updateAuthUI();
  document.querySelector("#app").classList.remove("hidden");
  document.querySelector("#calculate")?.addEventListener("click", () => {
    const height = Number(document.querySelector("#height").value) || 0;
    const weight = Number(document.querySelector("#weight").value) || 0;
    const age = Number(document.querySelector("#age").value) || 0;
    const results = document.querySelector("#results");

    // Basic validation
    if (!height || !weight) {
      results.classList.remove("hidden");
      results.innerHTML = `<div><small>ERROR</small><b>Please enter height and weight.</b></div>`;
      return;
    }

    const bmi = weight / Math.pow(height / 100, 2);
    const calories = Math.round(10 * weight + 6.25 * height - 5 * age + 5);
    results.classList.remove("hidden");
    results.innerHTML = `<div><small>ESTIMATED BMI</small><b>${bmi.toFixed(1)}</b></div><div><small>DAILY ENERGY GUIDE</small><b>${calories.toLocaleString()}</b></div>`;
  });

  // Recommendation tool handler
  const suggestBtn = document.getElementById('suggestBtn');
  suggestBtn?.addEventListener('click', (event) => {
    event.preventDefault();
    const lifestyle = document.getElementById('lifestyle')?.value;
    const freeTime = Number(document.getElementById('freeTime')?.value) || 0;
    const resultNode = document.getElementById('recommendationResult');

    const name = localStorage.getItem('flexformUserName') || 'Friend';

    let suggestion = { title: 'Try a short mobility flow', reason: 'A gentle routine to get started', link: 'courses.html' };

    if (lifestyle === 'sedentary') {
      if (freeTime <= 10) {
        suggestion = { title: 'Desk reset — 8 min', reason: 'Quick mobility to relieve tightness from sitting', link: 'courses.html' };
      } else if (freeTime <= 20) {
        suggestion = { title: 'Mobility flow — 15 min', reason: 'A short flow to restore movement', link: 'courses.html' };
      } else {
        suggestion = { title: 'Strength foundations', reason: 'Build consistency and strength with guided progressions', link: 'courses.html' };
      }
    } else if (lifestyle === 'light') {
      if (freeTime <= 10) {
        suggestion = { title: 'Quick core — 10 min', reason: 'Short core work to boost posture and energy', link: 'courses.html' };
      } else if (freeTime <= 30) {
        suggestion = { title: 'Mobility + strength combo — 20 min', reason: 'Balanced session for movement and strength', link: 'courses.html' };
      } else {
        suggestion = { title: 'Guided course: Build strength', reason: 'Step-by-step course to progress safely', link: 'courses.html' };
      }
    } else if (lifestyle === 'active') {
      if (freeTime <= 20) {
        suggestion = { title: 'Quick strength circuit — 15 min', reason: 'High-impact short session to keep momentum', link: 'courses.html' };
      } else {
        suggestion = { title: 'Strength foundations + conditioning', reason: 'A focused session for measurable gains', link: 'courses.html' };
      }
    } else if (lifestyle === 'very') {
      suggestion = { title: 'Advanced conditioning or multi-week course', reason: 'Longer sessions to push progress', link: 'courses.html' };
    }

    if (resultNode) {
      resultNode.hidden = false;
      resultNode.innerHTML = `
        <div><strong>Hi ${name},</strong></div>
        <div style="margin-top:8px"><b>${suggestion.title}</b><div style="color:var(--stone); margin-top:6px">${suggestion.reason}</div></div>
        <div style="margin-top:10px"><a href="${suggestion.link}">View similar courses →</a></div>
      `;
    }
  });
  document.querySelectorAll(".goal-buttons button").forEach((button) =>
    button.addEventListener("click", () => {
      document
        .querySelectorAll(".goal-buttons button")
        .forEach((item) => item.classList.remove("selected"));
      button.classList.add("selected");
      document.querySelector("#goalValue").textContent =
        `${button.textContent} moments`;
    }),
  );
  document.querySelector("#saveGoal")?.addEventListener("click", (event) => {
    event.target.textContent = "Weekly goal saved";
  });
  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-logout]")) {
      localStorage.removeItem("fitlyLoggedIn");
      window.location.href = "index.html";
    }
  });
});
