const { isLoggedIn, getStoredUserName, getUserInitials } = window.flexform;

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


/* ---------- Progress tracking: everything below is computed from the member's own activity ---------- */
const activity = window.flexformActivity;
const $ = (selector) => document.querySelector(selector);
const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const lessonMinutes = (courseId, number) => {
  const course = courses.find((item) => item.id === courseId);
  return course ? lessonsFor(course)[number - 1]?.minutes || 0 : 0;
};
const lessonTitle = (courseId, number) => {
  const course = courses.find((item) => item.id === courseId);
  const lesson = course ? lessonsFor(course)[number - 1] : null;
  return lesson ? `${course.title}: ${lesson.title}` : "Lesson";
};

const KIND = { workout: ["W", "Workout"], meal: ["M", "Meal"], course: ["C", "Course"], lesson: ["L", "Lesson"] };

const friendlyDay = (day) => {
  const today = activity.dateKey();
  if (day === today) return "Today";
  if (day === activity.addDays(today, -1)) return "Yesterday";
  return activity.parseKey(day).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
};

const savedWeeklyGoal = () => {
  try {
    const value = Number(localStorage.getItem(window.flexform.userKey("weeklyGoal")));
    return value >= 1 && value <= 6 ? value : 3;
  } catch {
    return 3;
  }
};

const renderStats = (list) => {
  const today = activity.dateKey();
  const since = activity.addDays(today, -29);
  const week = new Set(activity.weekDays(activity.weekStart(today)));
  const last30 = list.filter((entry) => entry.day >= since && entry.day <= today);
  const thisWeek = list.filter((entry) => week.has(entry.day));
  const totalMinutes = list.reduce((sum, entry) => sum + entry.minutes, 0);

  $("#statHours").textContent = (totalMinutes / 60).toFixed(1);
  $("#statStreak").textContent = String(activity.streak(list));
  $("#statSessions").textContent = String(list.length);
  $("#miniDays").textContent = String(new Set(last30.map((entry) => entry.day)).size);
  $("#miniMinutes").textContent = String(last30.reduce((sum, entry) => sum + entry.minutes, 0));
  $("#miniLessons").textContent = String(last30.filter((entry) => entry.kind === "lesson").length);

  const goal = savedWeeklyGoal();
  const percent = Math.min(100, Math.round((thisWeek.length / goal) * 100));
  $("#goalText").textContent = `${thisWeek.length} / ${goal} moments`;
  $("#goalBar").style.width = `${percent}%`;
  $("#goalProgress").setAttribute("aria-valuenow", String(percent));

  const monthPrefix = today.slice(0, 7);
  const activeDays = new Set(thisWeek.map((entry) => entry.day)).size;
  const doneThisMonth = list.filter((entry) => entry.day.startsWith(monthPrefix)).length;
  $("#trackList").innerHTML = list.length
    ? `<li>${activeDays} active ${activeDays === 1 ? "day" : "days"} this week</li>
       <li>${thisWeek.reduce((sum, entry) => sum + entry.minutes, 0)} minutes of movement logged this week</li>
       <li>${doneThisMonth} ${doneThisMonth === 1 ? "thing" : "things"} completed this month</li>`
    : `<li>Nothing completed yet. <a href="planner.html">Plan your week</a> or <a href="courses.html">start a lesson</a>.</li>`;
};

const renderRecent = (list) => {
  const node = $("#workoutHistory");
  node.innerHTML = list.length
    ? list
        .slice(0, 6)
        .map((entry) => {
          const [badge, label] = KIND[entry.kind] || ["•", "Done"];
          return `<div class="history-item"><span class="history-badge">${badge}</span><div class="history-meta"><strong>${escapeHtml(entry.title)}</strong><small>${friendlyDay(entry.day)}${entry.minutes ? ` · ${entry.minutes} min` : ""}</small></div><span class="history-pill">${label}</span></div>`;
        })
        .join("")
    : `<div class="history-item history-empty"><div class="history-meta"><strong>No activity yet</strong><small>Tick something off in your planner or finish a lesson and it will show up here.</small></div></div>`;
};

const renderWeekChart = (list) => {
  const days = activity.weekDays(activity.weekStart());
  const counts = days.map((day) => list.filter((entry) => entry.day === day).length);
  const max = Math.max(1, ...counts);
  const today = activity.dateKey();
  $("#weekChart").setAttribute("aria-label", `Completed per day this week: ${days.map((day, i) => `${activity.parseKey(day).toLocaleDateString("en-US", { weekday: "long" })} ${counts[i]}`).join(", ")}`);
  $("#weekChart").innerHTML = days
    .map(
      (day, i) => `<div class="bar-col${day === today ? " today" : ""}" aria-hidden="true"><b>${counts[i]}</b><span class="bar"><i style="height:${Math.round((counts[i] / max) * 100)}%"></i></span><small>${activity.parseKey(day).toLocaleDateString("en-US", { weekday: "short" })}</small></div>`,
    )
    .join("");
  const total = counts.reduce((a, b) => a + b, 0);
  $("#weekChartNote").textContent = total ? `${total} completed this week.` : "Nothing completed yet this week.";
};

const renderWeight = () => {
  const entries = activity.readWeights();
  const chart = $("#weightChart");
  if (entries.length < 2) {
    chart.innerHTML = `<p class="insight-note">${entries.length ? "Add one more entry to see your trend." : "Log your weight to see your trend over time."}</p>`;
  } else {
    const shown = entries.slice(-10);
    const kgs = shown.map((entry) => entry.kg);
    const low = Math.min(...kgs);
    const high = Math.max(...kgs);
    const pad = Math.max(0.5, (high - low) * 0.2);
    const [min, max] = [low - pad, high + pad];
    const x = (i) => 20 + (i * 260) / (shown.length - 1);
    const y = (kg) => 10 + (1 - (kg - min) / (max - min)) * 90;
    const points = shown.map((entry, i) => `${x(i).toFixed(1)},${y(entry.kg).toFixed(1)}`).join(" ");
    const short = (day) => activity.parseKey(day).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    chart.innerHTML = `<svg viewBox="0 0 300 130" role="img" aria-label="Weight from ${short(shown[0].date)} (${shown[0].kg} kg) to ${short(shown[shown.length - 1].date)} (${shown[shown.length - 1].kg} kg)">
        <polyline points="${points}" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" />
        ${shown.map((entry, i) => `<circle cx="${x(i).toFixed(1)}" cy="${y(entry.kg).toFixed(1)}" r="4" fill="currentColor" />`).join("")}
        <text x="20" y="124" font-size="11" fill="var(--stone)">${short(shown[0].date)}</text>
        <text x="280" y="124" font-size="11" fill="var(--stone)" text-anchor="end">${short(shown[shown.length - 1].date)}</text>
      </svg>`;
  }
  const newest = entries.slice().reverse();
  $("#weightList").innerHTML = newest
    .slice(0, 5)
    .map((entry, i) => {
      const before = newest[i + 1];
      const diff = before ? Math.round((entry.kg - before.kg) * 10) / 10 : null;
      const change = diff === null ? "" : diff === 0 ? "no change" : `${diff > 0 ? "+" : "−"}${Math.abs(diff)} kg`;
      return `<li><span>${activity.parseKey(entry.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span><b>${entry.kg} kg</b><small>${change}</small><button type="button" class="weight-remove" data-date="${entry.date}" aria-label="Remove entry for ${entry.date}">Remove</button></li>`;
    })
    .join("");
};

const renderProgress = () => {
  const list = activity.completions(lessonMinutes, lessonTitle);
  renderStats(list);
  renderRecent(list);
  renderWeekChart(list);
  renderWeight();
};

const bindWeightForm = () => {
  const form = $("#weightForm");
  const dateInput = $("#weightDate");
  const today = activity.dateKey();
  dateInput.value = today;
  dateInput.max = today;
  const error = $("#weightError");
  const fail = (message) => {
    error.textContent = message;
    error.classList.remove("hidden");
  };
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const date = dateInput.value;
    const raw = $("#weightKg").value.trim();
    const kg = Number(raw);
    if (!date) return fail("Choose a date.");
    if (date > today) return fail("The date can’t be in the future.");
    if (raw === "" || !Number.isFinite(kg)) return fail("Enter your weight in kg.");
    if (kg < 25 || kg > 300) return fail("Enter a weight between 25 and 300 kg.");
    error.classList.add("hidden");
    activity.saveWeight(date, Math.round(kg * 10) / 10);
    $("#weightKg").value = "";
    renderWeight();
    showToast("Weight saved");
  });
  $("#weightList").addEventListener("click", (event) => {
    const button = event.target.closest("[data-date]");
    if (!button) return;
    activity.removeWeight(button.dataset.date);
    renderWeight();
    $("#weightKg").focus();
    showToast("Entry removed");
  });
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
      document.querySelector("#editError")?.classList.add("hidden");
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
    const errorNode = document.querySelector("#editError");
    const name = form.elements.name.value.trim();
    const email = window.flexformUsers.normaliseEmail(form.elements.email.value);

    const oldEmail = localStorage.getItem("flexformUserEmail") || "";
    const result = window.flexformAuth.updateAccount(oldEmail, { name, email });
    if (!result.ok) {
      errorNode.textContent = Object.values(result.errors)[0];
      errorNode.classList.remove("hidden");
      return;
    }
    errorNode.classList.add("hidden");

    // Keep per-user mock data (saved coaches, courses, goal) with the new email.
    window.flexformUsers.renameEmail(oldEmail, email);
    window.flexformUsers.setName(email, result.account.name);

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
  renderProgress();
  bindWeightForm();
  bindEditProfile();

  document.querySelector("#app").classList.remove("hidden");
});
