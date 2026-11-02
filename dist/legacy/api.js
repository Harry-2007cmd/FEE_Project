/* Mock API (frontend-only). There is no server: these functions return Promises that
   resolve after a short delay, the way a real network request would.
   The pages use them with .then() / .catch() and show loading and error states.
   Add ?mockfail to any page address to see the error state (demo switch). */
(function () {
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const shouldFail = () => new URLSearchParams(window.location.search).has("mockfail");

  /** Resolves with `value` after `ms`, or rejects when the demo switch is on. */
  const respond = (value, ms, what) =>
    delay(ms).then(() => {
      if (shouldFail()) throw new Error(`Could not load ${what}.`);
      return value;
    });

  window.flexformApi = {
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
})();
