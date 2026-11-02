/* Mock API (frontend-only). There is no server: these functions return Promises that
   resolve after a short delay, the way a real network request would.
   The pages use them with .then() / .catch() and show loading and error states.
   Add ?mockfail to any page address to see the error state (demo switch).
   Ported from the original global-script version to an ES module.
   NOTE: `trainers` and `courses` are imported from the data files; the original
   api.js referenced the globals directly, so the mock data is the same. */
import trainers from "../data/trainers-data.js";
import courses from "../data/courses-data.js";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const shouldFail = () => new URLSearchParams(window.location.search).has("mockfail");

/** Resolves with `value` after `ms`, or rejects when the demo switch is on. */
const respond = (value, ms, what) =>
  delay(ms).then(() => {
    if (shouldFail()) throw new Error(`Could not load ${what}.`);
    return value;
  });

export const flexformApi = {
  delay,
  getCoaches: () => respond(trainers, 450, "coaches"),
  getCourses: () => respond(courses, 450, "courses"),
  /** Pretends to send a session request to a coach. */
  bookCoach: (name) =>
    delay(600).then(() => {
      if (shouldFail()) throw new Error("Request could not be sent.");
      return { coach: name, status: "requested" };
    }),
};

window.flexformApi = flexformApi;
export default flexformApi;