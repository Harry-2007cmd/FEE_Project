import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "../styles/styles.css";
import "../styles/courses.css";
import "../styles/planner.css";

const TYPE_LABEL = { workout: "Workout", meal: "Meal", course: "Course" };
const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const activity = window.flexformActivity;
const $ = (selector) => document.querySelector(selector);
const fmt = (key, options) => activity.parseKey(key).toLocaleDateString("en-US", options);

export default function Planner() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [weekStart, setWeekStart] = useState(() => activity.weekStart(activity.dateKey()));
  const [selectedDay, setSelectedDay] = useState(() => activity.dateKey());
  const [addType, setAddType] = useState("workout");
  const [addItemIndex, setAddItemIndex] = useState(0);
  const [options, setOptions] = useState([]);

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login?return=/planner");
    }
  }, [isLoggedIn, navigate]);

  const today = activity.dateKey();
  const days = activity.weekDays(weekStart);

  const optionsFor = (type) => {
    if (type === "workout") return window.plannerWorkouts.map((item) => ({ ...item }));
    if (type === "meal") return window.plannerMeals.map((item) => ({ ...item, minutes: 0 }));
    return window.courses
      .filter((course) => window.flexformCourses.isStarted(course.title))
      .map((course) => ({ title: course.title, minutes: Math.max(5, Math.round(course.minutes / course.lessons)) }));
  };

  const notify = (message) => {
    const toast = $("#toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2600);
  };

  const redraw = () => {
    // week label
    $("#weekLabel").textContent = `${fmt(days[0], { month: "short", day: "numeric" })} – ${fmt(days[6], { month: "short", day: "numeric" })}`;
    $("#thisWeek").hidden = weekStart === activity.weekStart(today);

    // day tabs
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

    // day view
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

    // add form options
    const opts = optionsFor(addType);
    setOptions(opts);
    const select = $("#addItem");
    select.innerHTML = opts.length
      ? opts.map((option, index) => `<option value="${index}">${escapeHtml(option.title)}${option.minutes ? ` · ${option.minutes} min` : ""}</option>`).join("")
      : `<option value="">No enrolled courses yet</option>`;
    select.disabled = !opts.length;
    $("#addButton").disabled = !opts.length;
    $("#addHint").hidden = opts.length > 0;
  };

  useEffect(() => {
    redraw();

    // Day tab clicks
    const handleDayTab = (event) => {
      const tab = event.target.closest("[data-day]");
      if (!tab) return;
      setSelectedDay(tab.dataset.day);
      redraw();
      $(`#dayTabs [data-day="${tab.dataset.day}"]`)?.focus();
    };
    $("#dayTabs")?.addEventListener("click", handleDayTab);

    // Week navigation
    const moveWeek = (delta) => {
      const newStart = activity.addDays(weekStart, delta);
      setWeekStart(newStart);
      setSelectedDay(newStart === activity.weekStart(today) ? today : newStart);
      redraw();
    };
    $("#prevWeek")?.addEventListener("click", () => moveWeek(-7));
    $("#nextWeek")?.addEventListener("click", () => moveWeek(7));
    $("#thisWeek")?.addEventListener("click", () => {
      setWeekStart(activity.weekStart(today));
      setSelectedDay(today);
      redraw();
      $("#nextWeek")?.focus();
    });

    // Toggle done
    const handleToggle = (event) => {
      const box = event.target.closest("[data-toggle]");
      if (!box) return;
      const item = activity.togglePlanItem(selectedDay, box.dataset.toggle);
      redraw();
      $(`[data-toggle="${box.dataset.toggle}"]`)?.focus();
      if (item?.done) notify("Nice. Marked as done.");
    };
    $("#dayList")?.addEventListener("change", handleToggle);

    // Remove item
    const handleRemove = (event) => {
      const remove = event.target.closest("[data-remove]");
      if (!remove) return;
      activity.removePlanItem(selectedDay, remove.dataset.remove);
      redraw();
      $("#addItem")?.focus();
      notify("Removed from your plan.");
    };
    $("#dayList")?.addEventListener("click", handleRemove);

    // Add form
    const handleTypeChange = (event) => {
      setAddType(event.target.value);
      setAddItemIndex(0);
      redraw();
    };
    $("#addType")?.addEventListener("change", handleTypeChange);

    const handleAddSubmit = (event) => {
      event.preventDefault();
      const type = $("#addType").value;
      const opt = optionsFor(type)[Number($("#addItem").value)];
      if (!opt) return;
      activity.addPlanItem(selectedDay, { type, title: opt.title, minutes: opt.minutes });
      redraw();
      notify(`Added to ${fmt(selectedDay, { weekday: "long" })}.`);
    };
    $("#addForm")?.addEventListener("submit", handleAddSubmit);

    return () => {
      // cleanup listeners if needed
    };
  }, [weekStart, selectedDay, addType]);

  return (
    <section className="page active" id="page-planner">
      <div className="page-intro">
        <p className="eyebrow">Plan it, then do it</p>
        <h1>My weekly <em>planner.</em></h1>
        <p className="lede">Tap a day, add what you'd like to do, and tick it off as you go.</p>
      </div>
      <div className="week-bar">
        <div className="week-nav">
          <button type="button" id="prevWeek" aria-label="Previous week">←</button>
          <span className="week-label" id="weekLabel" aria-live="polite"></span>
          <button type="button" id="nextWeek" aria-label="Next week">→</button>
          <button type="button" id="thisWeek" hidden>This week</button>
        </div>
        <div className="week-summary">
          <span id="weekSummary"></span>
          <div className="progress"><i id="weekBar" style={{ width: "0%" }}></i></div>
        </div>
      </div>
      <div className="day-tabs" id="dayTabs" role="group" aria-label="Days of the week"></div>
      <div className="planner-grid">
        <section className="planner-card" aria-labelledby="dayHeading">
          <h2 id="dayHeading"></h2>
          <ul className="plan-list" id="dayList"></ul>
        </section>
        <section className="planner-card" aria-labelledby="addHeading">
          <h2 id="addHeading">Add to <span id="addDayLabel"></span></h2>
          <form className="add-form" id="addForm">
            <label>Type
              <select id="addType">
                <option value="workout">Workout</option>
                <option value="meal">Meal</option>
                <option value="course">Course session</option>
              </select>
            </label>
            <label>Choose one
              <select id="addItem"></select>
            </label>
            <p className="add-hint" id="addHint" hidden>Enrol in a course first, then plan it here. <a href="/courses">Browse courses →</a></p>
            <button className="enrol-button" id="addButton" type="submit">Add to my plan</button>
          </form>
        </section>
      </div>
    </section>
  );
}