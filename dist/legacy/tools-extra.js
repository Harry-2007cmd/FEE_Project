/*
 * Extra tools on tools.html: water intake, one-rep max, macro split and a session timer.
 * Everything runs in the browser; the figures are rough estimates, not medical advice.
 */
(() => {
  const $ = (selector) => document.querySelector(selector);
  const num = (selector) => {
    const raw = $(selector)?.value;
    return raw === "" || raw == null ? NaN : Number(raw);
  };
  const inRange = (value, min, max) => Number.isFinite(value) && value >= min && value <= max;

  const showResult = (node, html, isError = false) => {
    node.hidden = false;
    node.classList.toggle("is-error", isError);
    node.innerHTML = html;
  };
  const stat = (label, value) => `<div><small>${label}</small><b>${value}</b></div>`;

  /* ---- Water intake: about 35 ml per kg, plus 350 ml per 30 minutes of exercise ---- */
  const waterMl = (weightKg, exerciseMin) => Math.round(weightKg * 35 + (exerciseMin / 30) * 350);

  /* ---- One-rep max (Epley formula): weight × (1 + reps / 30) ---- */
  const oneRepMax = (weight, reps) => (reps === 1 ? weight : weight * (1 + reps / 30));

  /* ---- Macro split: percentages of calories (protein 4, carbs 4, fat 9 kcal per gram) ---- */
  const MACRO_SPLITS = {
    balanced: { protein: 0.3, carbs: 0.4, fat: 0.3 },
    lose: { protein: 0.35, carbs: 0.35, fat: 0.3 },
    build: { protein: 0.3, carbs: 0.45, fat: 0.25 },
  };
  const macroGrams = (calories, goal) => {
    const split = MACRO_SPLITS[goal] || MACRO_SPLITS.balanced;
    return {
      protein: Math.round((calories * split.protein) / 4),
      carbs: Math.round((calories * split.carbs) / 4),
      fat: Math.round((calories * split.fat) / 9),
      split,
    };
  };

  /* ---- Timer: a list of phases, played one after another ---- */
  const BREATHING_PATTERNS = {
    box: [["Breathe in", 4], ["Hold", 4], ["Breathe out", 4], ["Hold", 4]],
    "478": [["Breathe in", 4], ["Hold", 7], ["Breathe out", 8]],
    calm: [["Breathe in", 4], ["Breathe out", 6]],
  };
  const buildPhases = ({ mode, work, rest, rounds, pattern }) => {
    const phases = [];
    if (mode === "breathing") {
      for (let round = 1; round <= rounds; round++) {
        for (const [label, seconds] of BREATHING_PATTERNS[pattern]) phases.push({ label, seconds, round });
      }
      return phases;
    }
    for (let round = 1; round <= rounds; round++) {
      phases.push({ label: "Work", seconds: work, round });
      if (rest > 0 && round < rounds) phases.push({ label: "Rest", seconds: rest, round });
    }
    return phases;
  };
  const clock = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  window.flexformTools = { waterMl, oneRepMax, macroGrams, buildPhases };

  window.addEventListener("DOMContentLoaded", () => {
    if (!$("#waterCalc")) return;

    $("#waterCalc").addEventListener("click", () => {
      const weight = num("#waterWeight");
      const minutes = num("#waterMinutes");
      const result = $("#waterResult");
      if (!inRange(weight, 25, 300)) return showResult(result, "Enter a weight between 25 and 300 kg.", true);
      if (!inRange(minutes, 0, 300)) return showResult(result, "Enter exercise minutes between 0 and 300.", true);
      const ml = waterMl(weight, minutes);
      showResult(result, stat("Daily target", `${(ml / 1000).toFixed(1)} L`) + stat("In glasses (250 ml)", Math.round(ml / 250)));
    });

    $("#rmCalc").addEventListener("click", () => {
      const weight = num("#rmWeight");
      const reps = num("#rmReps");
      const result = $("#rmResult");
      if (!inRange(weight, 1, 500)) return showResult(result, "Enter a weight between 1 and 500 kg.", true);
      if (!Number.isInteger(reps) || !inRange(reps, 1, 12)) return showResult(result, "Enter whole reps between 1 and 12.", true);
      const max = oneRepMax(weight, reps);
      const rows = [60, 70, 80, 90].map((p) => `<li><span>${p}%</span><b>${Math.round((max * p) / 100)} kg</b></li>`).join("");
      showResult(result, stat("Estimated one-rep max", `${Math.round(max)} kg`) + `<ul class="percent-list" aria-label="Training weights">${rows}</ul>`);
    });

    $("#macroCalc").addEventListener("click", () => {
      const calories = num("#macroCalories");
      const result = $("#macroResult");
      if (!inRange(calories, 1000, 6000)) return showResult(result, "Enter calories between 1,000 and 6,000.", true);
      const g = macroGrams(calories, $("#macroGoal").value);
      const pct = (n) => `${Math.round(n * 100)}%`;
      showResult(
        result,
        stat("Protein", `${g.protein} g <i>${pct(g.split.protein)}</i>`) +
          stat("Carbs", `${g.carbs} g <i>${pct(g.split.carbs)}</i>`) +
          stat("Fat", `${g.fat} g <i>${pct(g.split.fat)}</i>`),
      );
    });

    /* ---- Timer UI ---- */
    const mode = $("#timerMode");
    const els = {
      phase: $("#timerPhase"),
      clock: $("#timerClock"),
      progress: $("#timerProgress"),
      start: $("#timerStart"),
      reset: $("#timerReset"),
      error: $("#timerError"),
      announce: $("#timerAnnounce"),
    };
    let phases = [];
    let index = 0;
    let remaining = 0;
    let handle = null;
    let state = "idle"; // idle | running | paused | done

    const syncMode = () => {
      const breathing = mode.value === "breathing";
      document.querySelectorAll(".interval-field").forEach((node) => (node.hidden = breathing));
      $("#timerPatternWrap").hidden = !breathing;
      $("#timerRoundsLabel").textContent = breathing ? "Cycles" : "Rounds";
      $("#timerRounds").value = 6;
      resetTimer();
    };

    const render = () => {
      if (state === "idle") {
        els.phase.textContent = "Ready";
        els.clock.textContent = "00:00";
        els.progress.textContent = "";
      } else if (state === "done") {
        els.phase.textContent = "Done — well done!";
        els.clock.textContent = "00:00";
        els.progress.textContent = "";
      } else {
        const phase = phases[index];
        els.phase.textContent = phase.label;
        els.clock.textContent = clock(remaining);
        els.progress.textContent = `${mode.value === "breathing" ? "Cycle" : "Round"} ${phase.round} of ${phases[phases.length - 1].round}`;
      }
      els.start.textContent = state === "running" ? "Pause" : state === "paused" ? "Resume" : "Start";
    };

    const stop = () => {
      clearInterval(handle);
      handle = null;
    };

    const tick = () => {
      remaining -= 1;
      if (remaining <= 0) {
        index += 1;
        if (index >= phases.length) {
          stop();
          state = "done";
          els.announce.textContent = "Session finished.";
          render();
          return;
        }
        remaining = phases[index].seconds;
        els.announce.textContent = phases[index].label;
      }
      render();
    };

    const resetTimer = () => {
      stop();
      state = "idle";
      index = 0;
      remaining = 0;
      els.error.classList.add("hidden");
      render();
    };

    const readSettings = () => {
      const breathing = mode.value === "breathing";
      const rounds = num("#timerRounds");
      const settings = { mode: mode.value, rounds, pattern: $("#timerPattern").value, work: num("#timerWork"), rest: num("#timerRest") };
      if (!Number.isInteger(rounds) || !inRange(rounds, 1, 30)) return { error: `Enter whole ${breathing ? "cycles" : "rounds"} between 1 and 30.` };
      if (!breathing) {
        if (!Number.isInteger(settings.work) || !inRange(settings.work, 5, 600)) return { error: "Work time must be a whole number from 5 to 600 seconds." };
        if (!Number.isInteger(settings.rest) || !inRange(settings.rest, 0, 600)) return { error: "Rest time must be a whole number from 0 to 600 seconds." };
      }
      return { settings };
    };

    els.start.addEventListener("click", () => {
      if (state === "running") {
        stop();
        state = "paused";
        return render();
      }
      if (state === "paused") {
        state = "running";
        handle = setInterval(tick, 1000);
        return render();
      }
      const { settings, error } = readSettings();
      if (error) {
        els.error.textContent = error;
        els.error.classList.remove("hidden");
        return;
      }
      els.error.classList.add("hidden");
      phases = buildPhases(settings);
      index = 0;
      remaining = phases[0].seconds;
      state = "running";
      els.announce.textContent = phases[0].label;
      handle = setInterval(tick, 1000);
      render();
    });
    els.reset.addEventListener("click", resetTimer);
    mode.addEventListener("change", syncMode);
    ["#timerWork", "#timerRest", "#timerRounds", "#timerPattern"].forEach((s) => $(s).addEventListener("change", () => state !== "running" && resetTimer()));
    syncMode();
  });
})();
