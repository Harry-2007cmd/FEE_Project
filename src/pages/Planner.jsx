import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { escapeHtml } from "../lib/utils.js";
import "../styles/styles.css";
import "../styles/courses.css";
import "../styles/planner.css";

const TYPE_LABEL = { workout: "Workout", meal: "Meal", course: "Course" };

const activity = window.flexformActivity;
const fmt = (key, options) => activity.parseKey(key).toLocaleDateString("en-US", options);

const notify = (message) => {
  const toast = document.querySelector("#toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2600);
};

export default function Planner() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [weekStart, setWeekStart] = useState(() => activity.weekStart(activity.dateKey()));
  const [selectedDay, setSelectedDay] = useState(() => activity.dateKey());
  const [addType, setAddType] = useState("workout");
  const [addItemIndex, setAddItemIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const [tick, setTick] = useState(0);

  const today = activity.dateKey();
  const days = activity.weekDays(weekStart);

  const optionsFor = (type) => {
    if (type === "workout") return window.plannerWorkouts.map((item) => ({ ...item }));
    if (type === "meal") return window.plannerMeals.map((item) => ({ ...item, minutes: 0 }));
    return window.courses
      .filter((course) => window.flexformCourses.isStarted(course.title))
      .map((course) => ({ title: course.title, minutes: Math.max(5, Math.round(course.minutes / course.lessons)) }));
  };

  const weekLabel = `${fmt(days[0], { month: "short", day: "numeric" })} – ${fmt(days[6], { month: "short", day: "numeric" })}`;
  const showThisWeek = weekStart !== activity.weekStart(today);

  const dayTabs = days.map((day) => {
    const items = activity.dayItems(day);
    const doneCount = items.filter((item) => item.done).length;
    const label = fmt(day, { weekday: "long", month: "long", day: "numeric" });
    return (
      <button
        key={day}
        type="button"
        className={`day-tab${day === selectedDay ? " selected" : ""}${day === today ? " today" : ""}`}
        data-day={day}
        aria-pressed={day === selectedDay}
        aria-label={`${label}, ${items.length ? `${doneCount} of ${items.length} done` : "nothing planned"}`}
        aria-current={day === today ? "date" : undefined}
        onClick={() => setSelectedDay(day)}
      >
        <small>{fmt(day, { weekday: "short" })}</small>
        <b>{activity.parseKey(day).getDate()}</b>
        <span>{items.length ? `${doneCount}/${items.length}` : "–"}</span>
      </button>
    );
  });

  const total = days.reduce((sum, day) => sum + activity.dayItems(day).length, 0);
  const done = days.reduce((sum, day) => sum + activity.dayItems(day).filter((item) => item.done).length, 0);
  const weekSummary = total ? `${done} of ${total} done this week` : "Nothing planned this week yet";
  const weekBarWidth = total ? Math.round((done / total) * 100) : 0;

  const selectedItems = activity.dayItems(selectedDay);
  const dayHeading = fmt(selectedDay, { weekday: "long", month: "long", day: "numeric" }) + (selectedDay === today ? " · today" : "");
  const dayList = selectedItems.length
    ? selectedItems.map((item) => (
        <li key={item.id} className={`plan-item${item.done ? " done" : ""}`}>
          <label>
            <input
              type="checkbox"
              data-toggle={item.id}
              checked={item.done}
              onChange={() => {
                const updated = activity.togglePlanItem(selectedDay, item.id);
                setTick((t) => t + 1);
                if (updated?.done) notify("Nice. Marked as done.");
              }}
            />
            <span className="plan-title">{item.title}</span>
          </label>
          <span className="plan-meta">
            <span className={`plan-type ${item.type}`}>{TYPE_LABEL[item.type]}</span>
            {item.minutes ? <small>{item.minutes} min</small> : ""}
          </span>
          <button
            type="button"
            className="plan-remove"
            data-remove={item.id}
            aria-label={`Remove ${escapeHtml(item.title)}`}
            onClick={() => {
              activity.removePlanItem(selectedDay, item.id);
              setTick((t) => t + 1);
              notify("Removed from your plan.");
            }}
          >
            Remove
          </button>
        </li>
      ))
    : <li className="plan-empty">Nothing planned for this day. Add something below.</li>;

  const addDayLabel = fmt(selectedDay, { weekday: "long" });
  const opts = optionsFor(addType);
  const addFormOptions = opts.length
    ? opts.map((option, index) => (
        <option key={index} value={index}>
          {option.title}{option.minutes ? ` · ${option.minutes} min` : ""}
        </option>
      ))
    : <option value="">No enrolled courses yet</option>;
  const addDisabled = !opts.length;

  const handleMoveWeek = (delta) => {
    const newStart = activity.addDays(weekStart, delta);
    setWeekStart(newStart);
    setSelectedDay(newStart === activity.weekStart(today) ? today : newStart);
    setTick((t) => t + 1);
  };

  const handleThisWeek = () => {
    setWeekStart(activity.weekStart(today));
    setSelectedDay(today);
    setTick((t) => t + 1);
  };

  const handleTypeChange = (e) => {
    setAddType(e.target.value);
    setAddItemIndex(0);
    setTick((t) => t + 1);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const type = e.currentTarget.elements.addType.value;
    const opt = optionsFor(type)[Number(e.currentTarget.elements.addItem.value)];
    if (!opt) return;
    activity.addPlanItem(selectedDay, { type, title: opt.title, minutes: opt.minutes });
    setTick((t) => t + 1);
    notify(`Added to ${fmt(selectedDay, { weekday: "long" })}.`);
  };

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login?return=/planner");
    }
  }, [isLoggedIn, navigate]);

  return (
    <section className="page active" id="page-planner">
      <div className="page-intro">
        <p className="eyebrow">Plan it, then do it</p>
        <h1>My weekly <em>planner.</em></h1>
        <p className="lede">Tap a day, add what you'd like to do, and tick it off as you go.</p>
      </div>
      <div className="week-bar">
        <div className="week-nav">
          <button type="button" id="prevWeek" aria-label="Previous week" onClick={() => handleMoveWeek(-7)}>←</button>
          <span className="week-label" id="weekLabel" aria-live="polite">{weekLabel}</span>
          <button type="button" id="nextWeek" aria-label="Next week" onClick={() => handleMoveWeek(7)}>→</button>
          <button type="button" id="thisWeek" hidden={!showThisWeek} onClick={handleThisWeek}>This week</button>
        </div>
        <div className="week-summary">
          <span id="weekSummary">{weekSummary}</span>
          <div className="progress"><i id="weekBar" style={{ width: `${weekBarWidth}%` }}></i></div>
        </div>
      </div>
      <div className="day-tabs" id="dayTabs" role="group" aria-label="Days of the week">
        {dayTabs}
      </div>
      <div className="planner-grid">
        <section className="planner-card" aria-labelledby="dayHeading">
          <h2 id="dayHeading">{dayHeading}</h2>
          <ul className="plan-list" id="dayList">
            {dayList}
          </ul>
        </section>
        <section className="planner-card" aria-labelledby="addHeading">
          <h2 id="addHeading">Add to <span id="addDayLabel">{addDayLabel}</span></h2>
          <form className="add-form" id="addForm" onSubmit={handleAddSubmit}>
            <label>
              Type
              <select id="addType" value={addType} onChange={handleTypeChange}>
                <option value="workout">Workout</option>
                <option value="meal">Meal</option>
                <option value="course">Course session</option>
              </select>
            </label>
            <label>
              Choose one
              <select id="addItem" disabled={addDisabled}>
                {addFormOptions}
              </select>
            </label>
            <p className="add-hint" id="addHint" hidden={opts.length > 0}>
              Enrol in a course first, then plan it here. <a href="/courses">Browse courses →</a>
            </p>
            <button className="enrol-button" id="addButton" type="submit" disabled={addDisabled}>Add to my plan</button>
          </form>
        </section>
      </div>
    </section>
  );
}