/*
 * data-loader.js — single import entry point that wires up every legacy
 * `window.*` globals the page scripts still reference. In the original project
 * these were global `const` declarations loaded via plain <script src> tags;
 * in the React build they live as module imports.
 *
 * Assigning them here keeps every `window.courses`, `window.lessonsFor`,
 * `window.trainers`, `window.plans`, `window.plannerWorkouts`,
 * `window.plannerMeals` and `window.coachProfiles` reference working.
 */
import "./theme.js";
import "./mock-api.js";
import "./activity-store.js";
import "./course-store.js";
import "./user-store.js";
import "./tools-math.js";
import "./auth.js";
import "./auth-ui-utils.js";
import courses from "../data/courses-data.js";
import trainers from "../data/trainers-data.js";
import coachProfiles, { coachSlug } from "../data/coach-profiles-data.js";
import plans from "../data/pricing-data.js";
import { plannerWorkouts, plannerMeals } from "../data/planner-data.js";
import { lessonsFor } from "../data/lessons-data.js";
import "../data/notifications-data.js";

window.courses = courses;
window.trainers = trainers;
window.coachProfiles = coachProfiles;
window.coachSlug = coachSlug;
window.plans = plans;
window.plannerWorkouts = plannerWorkouts;
window.plannerMeals = plannerMeals;
window.lessonsFor = lessonsFor;

export default {
  courses,
  trainers,
  coachProfiles,
  plans,
  plannerWorkouts,
  plannerMeals,
  lessonsFor,
};