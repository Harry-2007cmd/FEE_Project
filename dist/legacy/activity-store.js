/*
 * activity-store.js — per-user activity data (frontend-only, localStorage, no backend).
 * Used by the planner, the lesson player and the My progress page.
 *
 * Stored under the user's own key (window.flexform.userKey):
 *   planner         { "YYYY-MM-DD": [ { id, type, title, minutes, done, doneAt } ] }
 *                   type is "workout" | "meal" | "course"
 *   lessonProgress  { "<courseId>": { "<lessonNumber>": "YYYY-MM-DD" } }   (date completed)
 *   weightLog       [ { date: "YYYY-MM-DD", kg: 68.4 } ]                    (one entry per date)
 *
 * Exposes window.flexformActivity. Load after common.js.
 */
window.flexformActivity = (() => {
  const key = (kind) => window.flexform.userKey(kind);

  const read = (kind, fallback) => {
    try {
      const raw = localStorage.getItem(key(kind));
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  };
  const write = (kind, value) => {
    try {
      localStorage.setItem(key(kind), JSON.stringify(value));
    } catch {
      /* storage unavailable: changes just won't persist */
    }
  };

  /* ---------- dates (always the visitor's local day) ---------- */
  const pad = (n) => String(n).padStart(2, "0");
  const dateKey = (date = new Date()) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  const parseKey = (value) => {
    const [y, m, d] = value.split("-").map(Number);
    return new Date(y, m - 1, d);
  };
  const addDays = (value, days) => {
    const date = parseKey(value);
    date.setDate(date.getDate() + days);
    return dateKey(date);
  };
  /** Monday of the week containing the given day. */
  const weekStart = (value = dateKey()) => {
    const date = parseKey(value);
    const offset = (date.getDay() + 6) % 7;
    return addDays(value, -offset);
  };
  const weekDays = (start) => Array.from({ length: 7 }, (_, i) => addDays(start, i));

  /* ---------- planner ---------- */
  const readPlanner = () => read("planner", {});
  const dayItems = (day) => readPlanner()[day] || [];
  const newId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

  const addPlanItem = (day, { type, title, minutes = 0 }) => {
    const planner = readPlanner();
    const item = { id: newId(), type, title, minutes, done: false };
    planner[day] = [...(planner[day] || []), item];
    write("planner", planner);
    return item;
  };
  const togglePlanItem = (day, id) => {
    const planner = readPlanner();
    const item = (planner[day] || []).find((entry) => entry.id === id);
    if (!item) return null;
    item.done = !item.done;
    item.doneAt = item.done ? dateKey() : undefined;
    write("planner", planner);
    return item;
  };
  const removePlanItem = (day, id) => {
    const planner = readPlanner();
    planner[day] = (planner[day] || []).filter((entry) => entry.id !== id);
    if (!planner[day].length) delete planner[day];
    write("planner", planner);
  };

  /* ---------- lessons ---------- */
  const readLessons = () => read("lessonProgress", {});
  const completedLessons = (courseId) => Object.keys(readLessons()[courseId] || {}).map(Number);
  const isLessonDone = (courseId, number) => completedLessons(courseId).includes(number);
  const setLessonDone = (courseId, number, done) => {
    const all = readLessons();
    const course = all[courseId] || {};
    if (done) course[number] = dateKey();
    else delete course[number];
    if (Object.keys(course).length) all[courseId] = course;
    else delete all[courseId];
    write("lessonProgress", all);
  };

  /* ---------- weight log ---------- */
  const readWeights = () => read("weightLog", []).slice().sort((a, b) => a.date.localeCompare(b.date));
  const saveWeight = (date, kg) => {
    const list = readWeights().filter((entry) => entry.date !== date);
    list.push({ date, kg });
    write("weightLog", list);
  };
  const removeWeight = (date) => write("weightLog", readWeights().filter((entry) => entry.date !== date));

  /* ---------- derived progress ---------- */
  /** Every completed thing, as { day, title, kind, minutes }. */
  const completions = (lessonMinutes = () => 0, lessonTitle = () => "Lesson") => {
    const list = [];
    const planner = readPlanner();
    Object.entries(planner).forEach(([day, items]) =>
      items.filter((item) => item.done).forEach((item) => list.push({ day: item.doneAt || day, title: item.title, kind: item.type, minutes: item.minutes || 0 })),
    );
    Object.entries(readLessons()).forEach(([courseId, lessons]) =>
      Object.entries(lessons).forEach(([number, day]) =>
        list.push({ day, title: lessonTitle(courseId, Number(number)), kind: "lesson", minutes: lessonMinutes(courseId, Number(number)) }),
      ),
    );
    return list.sort((a, b) => b.day.localeCompare(a.day));
  };

  /** Consecutive active days ending today (or yesterday, so an unfinished today doesn't break it). */
  const streak = (list) => {
    const days = new Set(list.map((entry) => entry.day));
    let cursor = dateKey();
    if (!days.has(cursor)) cursor = addDays(cursor, -1);
    let count = 0;
    while (days.has(cursor)) {
      count += 1;
      cursor = addDays(cursor, -1);
    }
    return count;
  };

  return {
    dateKey, parseKey, addDays, weekStart, weekDays,
    dayItems, readPlanner, addPlanItem, togglePlanItem, removePlanItem,
    completedLessons, isLessonDone, setLessonDone,
    readWeights, saveWeight, removeWeight,
    completions, streak,
  };
})();
