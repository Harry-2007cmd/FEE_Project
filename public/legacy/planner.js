/* Weekly planner. Tap a day, add workouts, meals or course sessions from a list, tick them off. */
const activity = window.flexformActivity;
const $ = (selector) => document.querySelector(selector);

const TYPE_LABEL = { workout: "Workout", meal: "Meal", course: "Course" };
const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const today = activity.dateKey();
let weekStart = activity.weekStart(today);
let selectedDay = today;

const notify = (message) => {
  const toast = $("#toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2600);
};

const fmt = (key, options) => activity.parseKey(key).toLocaleDateString("en-US", options);

/** Options for the "add" list, depending on the chosen type. */
const optionsFor = (type) => {
  if (type === "workout") return plannerWorkouts.map((item) => ({ ...item }));
  if (type === "meal") return plannerMeals.map((item) => ({ ...item, minutes: 0 }));
  return courses
    .filter((course) => window.flexformCourses.isStarted(course.title))
    .map((course) => ({ title: course.title, minutes: Math.max(5, Math.round(course.minutes / course.lessons)) }));
};

const drawWeek = () => {
  const days = activity.weekDays(weekStart);
  $("#weekLabel").textContent = `${fmt(days[0], { month: "short", day: "numeric" })} – ${fmt(days[6], { month: "short", day: "numeric" })}`;
  $("#thisWeek").hidden = weekStart === activity.weekStart(today);
  let total = 0;
  let done = 0;
  $("#dayTabs").innerHTML = days
    .map((day) => {
      const items = activity.dayItems(day);
      const doneCount = items.filter((item) => item.done).length;
      total += items.length;
      done += doneCount;
      const label = fmt(day, { weekday: "long", month: "long", day: "numeric" });
      return `<button type="button" class="day-tab${day === selectedDay ? " selected" : ""}${day === today ? " today" : ""}" data-day="${day}" aria-pressed="${day === selectedDay}" aria-label="${label}, ${items.length ? `${doneCount} of ${items.length} done` : "nothing planned"}"${day === today ? ' aria-current="date"' : ""}>
          <small>${fmt(day, { weekday: "short" })}</small>
          <b>${activity.parseKey(day).getDate()}</b>
          <span>${items.length ? `${doneCount}/${items.length}` : "–"}</span>
        </button>`;
    })
    .join("");
  $("#weekSummary").textContent = total ? `${done} of ${total} done this week` : "Nothing planned this week yet";
  $("#weekBar").style.width = total ? `${Math.round((done / total) * 100)}%` : "0%";
};

const drawDay = () => {
  const items = activity.dayItems(selectedDay);
  $("#dayHeading").textContent = fmt(selectedDay, { weekday: "long", month: "long", day: "numeric" }) + (selectedDay === today ? " · today" : "");
  $("#dayList").innerHTML = items.length
    ? items
        .map(
          (item) => `<li class="plan-item${item.done ? " done" : ""}">
            <label><input type="checkbox" data-toggle="${item.id}"${item.done ? " checked" : ""} /><span class="plan-title">${escapeHtml(item.title)}</span></label>
            <span class="plan-meta"><span class="plan-type ${item.type}">${TYPE_LABEL[item.type]}</span>${item.minutes ? `<small>${item.minutes} min</small>` : ""}</span>
            <button type="button" class="plan-remove" data-remove="${item.id}" aria-label="Remove ${escapeHtml(item.title)}">Remove</button>
          </li>`,
        )
        .join("")
    : `<li class="plan-empty">Nothing planned for this day. Add something below.</li>`;
  $("#addDayLabel").textContent = fmt(selectedDay, { weekday: "long" });
};

const drawAddForm = () => {
  const type = $("#addType").value;
  const options = optionsFor(type);
  const select = $("#addItem");
  select.innerHTML = options.length
    ? options.map((option, index) => `<option value="${index}">${escapeHtml(option.title)}${option.minutes ? ` · ${option.minutes} min` : ""}</option>`).join("")
    : `<option value="">No enrolled courses yet</option>`;
  select.disabled = !options.length;
  $("#addButton").disabled = !options.length;
  $("#addHint").hidden = options.length > 0;
};

const redraw = () => {
  drawWeek();
  drawDay();
};

window.addEventListener("DOMContentLoaded", () => {
  if (!window.flexform.isLoggedIn()) {
    window.location.replace("login.html?return=planner.html");
    return;
  }
  $("#app").classList.remove("hidden");

  $("#dayTabs").addEventListener("click", (event) => {
    const tab = event.target.closest("[data-day]");
    if (!tab) return;
    selectedDay = tab.dataset.day;
    redraw();
    $(`#dayTabs [data-day="${selectedDay}"]`)?.focus();
  });

  const moveWeek = (days) => {
    weekStart = activity.addDays(weekStart, days);
    selectedDay = weekStart === activity.weekStart(today) ? today : weekStart;
    redraw();
  };
  $("#prevWeek").addEventListener("click", () => moveWeek(-7));
  $("#nextWeek").addEventListener("click", () => moveWeek(7));
  $("#thisWeek").addEventListener("click", () => {
    weekStart = activity.weekStart(today);
    selectedDay = today;
    redraw();
    $("#nextWeek").focus();
  });

  $("#dayList").addEventListener("change", (event) => {
    const box = event.target.closest("[data-toggle]");
    if (!box) return;
    const item = activity.togglePlanItem(selectedDay, box.dataset.toggle);
    redraw();
    $(`[data-toggle="${box.dataset.toggle}"]`)?.focus();
    if (item?.done) notify("Nice. Marked as done.");
  });
  $("#dayList").addEventListener("click", (event) => {
    const remove = event.target.closest("[data-remove]");
    if (!remove) return;
    activity.removePlanItem(selectedDay, remove.dataset.remove);
    redraw();
    $("#addItem").focus();
    notify("Removed from your plan.");
  });

  $("#addType").addEventListener("change", drawAddForm);
  $("#addForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const type = $("#addType").value;
    const option = optionsFor(type)[Number($("#addItem").value)];
    if (!option) return;
    activity.addPlanItem(selectedDay, { type, title: option.title, minutes: option.minutes });
    redraw();
    notify(`Added to ${fmt(selectedDay, { weekday: "long" })}.`);
  });

  drawAddForm();
  redraw();
});
