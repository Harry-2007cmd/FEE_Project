import { useEffect, useState } from "react";
import "../styles/styles.css";
import "../styles/tools.css";

export default function Tools() {
  const [savedGoal, setSavedGoal] = useState(null);

  const goalKey = () => `flexform:${localStorage.getItem("flexformUserEmail") || "guest"}:weeklyGoal`;

  // BMI/Calorie calculator
  useEffect(() => {
    const calculate = document.querySelector("#calculate");
    calculate?.addEventListener("click", () => {
      const height = Number(document.querySelector("#height").value) || 0;
      const weight = Number(document.querySelector("#weight").value) || 0;
      const age = Number(document.querySelector("#age").value) || 0;
      const results = document.querySelector("#results");

      const showError = (message) => {
        results.classList.remove("hidden");
        results.innerHTML = `<div><small>ERROR</small><b>${message}</b></div>`;
      };
      if (!height || !weight) return showError("Please enter height and weight.");
      if (height < 100 || height > 250) return showError("Enter a height between 100 and 250 cm.");
      if (weight < 25 || weight > 300) return showError("Enter a weight between 25 and 300 kg.");
      if (!age) return showError("Please enter your age.");
      if (age < 13 || age > 100) return showError("Enter an age between 13 and 100.");

      const bmi = weight / Math.pow(height / 100, 2);
      const sexConstant = document.querySelector("#sex")?.value === "female" ? -161 : 5;
      const calories = Math.round(10 * weight + 6.25 * height - 5 * age + sexConstant);
      results.classList.remove("hidden");
      results.innerHTML = `<div><small>ESTIMATED BMI</small><b>${bmi.toFixed(1)}</b></div><div><small>DAILY ENERGY GUIDE</small><b>${calories.toLocaleString()}</b></div>`;
    });
  }, []);

  // Recommendation tool
  useEffect(() => {
    const suggestBtn = document.getElementById("suggestBtn");
    suggestBtn?.addEventListener("click", (event) => {
      event.preventDefault();
      const lifestyle = document.getElementById("lifestyle")?.value;
      const freeTime = Number(document.getElementById("freeTime")?.value) || 0;
      const resultNode = document.getElementById("recommendationResult");

      const name = localStorage.getItem("flexformUserName") || "Friend";

      let suggestion = { title: "Try a short mobility flow", reason: "A gentle routine to get started", link: "/courses" };

      if (lifestyle === "sedentary") {
        if (freeTime <= 10) suggestion = { title: "Desk reset — 8 min", reason: "Quick mobility to relieve tightness from sitting", link: "/courses" };
        else if (freeTime <= 20) suggestion = { title: "Mobility flow — 15 min", reason: "A short flow to restore movement", link: "/courses" };
        else suggestion = { title: "Strength foundations", reason: "Build consistency and strength with guided progressions", link: "/courses" };
      } else if (lifestyle === "light") {
        if (freeTime <= 10) suggestion = { title: "Quick core — 10 min", reason: "Short core work to boost posture and energy", link: "/courses" };
        else if (freeTime <= 30) suggestion = { title: "Mobility + strength combo — 20 min", reason: "Balanced session for movement and strength", link: "/courses" };
        else suggestion = { title: "Guided course: Build strength", reason: "Step-by-step course to progress safely", link: "/courses" };
      } else if (lifestyle === "active") {
        if (freeTime <= 20) suggestion = { title: "Quick strength circuit — 15 min", reason: "High-impact short session to keep momentum", link: "/courses" };
        else suggestion = { title: "Strength foundations + conditioning", reason: "A focused session for measurable gains", link: "/courses" };
      } else if (lifestyle === "very") {
        suggestion = { title: "Advanced conditioning or multi-week course", reason: "Longer sessions to push progress", link: "/courses" };
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
  }, []);

  // Weekly goal
  useEffect(() => {
    const goalButtons = [...document.querySelectorAll(".goal-buttons button")];
    const saveGoalButton = document.querySelector("#saveGoal");
    const SAVE_LABEL = "Save my weekly goal";

    const selectGoal = (button) => {
      goalButtons.forEach((item) => item.classList.remove("selected"));
      button.classList.add("selected");
      document.querySelector("#goalValue").textContent = `${button.textContent} moments`;
    };

    let currentSavedGoal = null;
    try {
      currentSavedGoal = localStorage.getItem(goalKey());
    } catch {
      /* storage unavailable: start from the default goal */
    }
    const savedButton = goalButtons.find((item) => item.textContent === currentSavedGoal);
    if (savedButton) {
      selectGoal(savedButton);
      saveGoalButton.textContent = "Weekly goal saved";
      setSavedGoal(currentSavedGoal);
    }

    goalButtons.forEach((button) =>
      button.addEventListener("click", () => {
        selectGoal(button);
        saveGoalButton.textContent = button.textContent === currentSavedGoal ? "Weekly goal saved" : SAVE_LABEL;
      }),
    );

    saveGoalButton?.addEventListener("click", () => {
      const selected = document.querySelector(".goal-buttons .selected");
      const goal = selected?.textContent ?? null;
      try {
        if (goal) localStorage.setItem(goalKey(), goal);
      } catch {
        /* storage unavailable: goal just won't persist */
      }
      setSavedGoal(goal);
      saveGoalButton.textContent = "Weekly goal saved";
    });
  }, []);

  // Extra tools
  useEffect(() => {
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

    const waterMl = (weightKg, exerciseMin) => Math.round(weightKg * 35 + (exerciseMin / 30) * 350);
    const oneRepMax = (weight, reps) => (reps === 1 ? weight : weight * (1 + reps / 30));
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

    // Water
    $("#waterCalc")?.addEventListener("click", () => {
      const weight = num("#waterWeight");
      const minutes = num("#waterMinutes");
      const result = $("#waterResult");
      if (!inRange(weight, 25, 300)) return showResult(result, "Enter a weight between 25 and 300 kg.", true);
      if (!inRange(minutes, 0, 300)) return showResult(result, "Enter exercise minutes between 0 and 300.", true);
      const ml = waterMl(weight, minutes);
      showResult(result, stat("Daily target", `${(ml / 1000).toFixed(1)} L`) + stat("In glasses (250 ml)", Math.round(ml / 250)));
    });

    // One-rep max
    $("#rmCalc")?.addEventListener("click", () => {
      const weight = num("#rmWeight");
      const reps = num("#rmReps");
      const result = $("#rmResult");
      if (!inRange(weight, 1, 500)) return showResult(result, "Enter a weight between 1 and 500 kg.", true);
      if (!Number.isInteger(reps) || !inRange(reps, 1, 12)) return showResult(result, "Enter whole reps between 1 and 12.", true);
      const max = oneRepMax(weight, reps);
      const rows = [60, 70, 80, 90].map((p) => `<li><span>${p}%</span><b>${Math.round((max * p) / 100)} kg</b></li>`).join("");
      showResult(result, stat("Estimated one-rep max", `${Math.round(max)} kg`) + `<ul class="percent-list" aria-label="Training weights">${rows}</ul>`);
    });

    // Macro split
    $("#macroCalc")?.addEventListener("click", () => {
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

    // Timer
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
    let state = "idle";

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

    els.start?.addEventListener("click", () => {
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
    els.reset?.addEventListener("click", resetTimer);
    mode?.addEventListener("change", syncMode);
    ["#timerWork", "#timerRest", "#timerRounds", "#timerPattern"].forEach((s) => $(s)?.addEventListener("change", () => state !== "running" && resetTimer()));
    syncMode();
  }, []);

  return (
    <section className="page active" id="page-tools">
      <div className="page-intro">
        <p className="eyebrow">Small data, better decisions</p>
        <h1>Your everyday <em>tools.</em></h1>
        <p className="lede">Useful estimates and gentle targets — never a scorecard.</p>
      </div>
      <div className="tools-grid">
        <article className="dark-card tool-card">
          <p className="eyebrow sun-text">A useful baseline</p>
          <h2>Body check-in</h2>
          <div className="inputs">
            <label>Height (In cm)<input id="height" type="number" value="170" /></label>
            <label>Weight (In kg)<input id="weight" type="number" value="68" /></label>
            <label>Age (In years)<input id="age" type="number" value="31" /></label>
            <label>Sex<select id="sex"><option value="male">Male</option><option value="female">Female</option></select></label>
          </div>
          <button className="sun-button" id="calculate">Calculate my baseline →</button>
          <div id="results" className="results hidden"></div>
        </article>

        <article className="cream-card recommendation-card">
          <p className="eyebrow">A gentle nudge</p>
          <h2>What suits you?</h2>
          <p className="lede">Tell us a bit about your lifestyle and how much free time you typically have, and we'll recommend an exercise or course that fits.</p>
          <div className="recommendation-form">
            <label>
              Lifestyle
              <select id="lifestyle">
                <option value="sedentary">Sedentary (desk-based)</option>
                <option value="light">Lightly active</option>
                <option value="active">Active</option>
                <option value="very">Very active</option>
              </select>
            </label>
            <label>
              Free time per day
              <select id="freeTime">
                <option value="10">~10 minutes</option>
                <option value="20">~20 minutes</option>
                <option value="30">~30 minutes</option>
                <option value="45">30+ minutes</option>
              </select>
            </label>
            <button className="outline-button" id="suggestBtn">Suggest for me</button>
            <div id="recommendationResult" aria-live="polite" hidden></div>
          </div>
        </article>

        <article className="cream-card goal-card">
          <p className="eyebrow">A weekly promise</p>
          <h2>Set your goal.</h2>
          <p>How many intentional movement moments would feel good this week?</p>
          <div className="goal-buttons">
            <button>1</button><button>2</button><button className="selected">3</button><button>4</button><button>5</button><button>6</button>
          </div>
          <div className="goal-note">
            <b id="goalValue">3 moments</b> is your intention.<small>One good choice every 2 days.</small>
          </div>
          <button className="outline-button" id="saveGoal">Save my weekly goal</button>
        </article>
      </div>
      <div className="section-heading more-tools-heading">
        <div>
          <p className="eyebrow">A few more helpers</p>
          <h2>More tools.</h2>
        </div>
      </div>
      <div className="extra-tools">
        <article className="cream-card extra-card" aria-labelledby="waterTitle">
          <p className="eyebrow">Stay topped up</p>
          <h3 id="waterTitle">Water intake</h3>
          <div className="extra-inputs">
            <label>Weight (kg)<input id="waterWeight" type="number" inputMode="decimal" value="68" /></label>
            <label>Exercise (min/day)<input id="waterMinutes" type="number" inputMode="numeric" value="30" /></label>
          </div>
          <button className="outline-button" id="waterCalc" type="button">Estimate my water</button>
          <div className="extra-result" id="waterResult" aria-live="polite" hidden></div>
        </article>

        <article className="cream-card extra-card" aria-labelledby="rmTitle">
          <p className="eyebrow">Know your strength</p>
          <h3 id="rmTitle">One-rep max</h3>
          <div className="extra-inputs">
            <label>Weight lifted (kg)<input id="rmWeight" type="number" inputMode="decimal" value="60" /></label>
            <label>Reps done (1–12)<input id="rmReps" type="number" inputMode="numeric" value="8" /></label>
          </div>
          <button className="outline-button" id="rmCalc" type="button">Estimate my max</button>
          <div className="extra-result" id="rmResult" aria-live="polite" hidden></div>
        </article>

        <article className="cream-card extra-card" aria-labelledby="macroTitle">
          <p className="eyebrow">Balance your plate</p>
          <h3 id="macroTitle">Macro split</h3>
          <div className="extra-inputs">
            <label>Daily calories<input id="macroCalories" type="number" inputMode="numeric" value="2000" /></label>
            <label>Goal
              <select id="macroGoal">
                <option value="balanced">Balanced</option>
                <option value="lose">Lose fat</option>
                <option value="build">Build muscle</option>
              </select>
            </label>
          </div>
          <button className="outline-button" id="macroCalc" type="button">Split my macros</button>
          <div className="extra-result" id="macroResult" aria-live="polite" hidden></div>
        </article>

        <article className="dark-card extra-card timer-card" aria-labelledby="timerTitle">
          <p className="eyebrow sun-text">Keep the rhythm</p>
          <h3 id="timerTitle">Session timer</h3>
          <div className="extra-inputs">
            <label>Type
              <select id="timerMode">
                <option value="interval">Workout intervals</option>
                <option value="breathing">Breathing</option>
              </select>
            </label>
            <label id="timerPatternWrap" hidden>Pattern
              <select id="timerPattern">
                <option value="box">Box (4-4-4-4)</option>
                <option value="478">Relax (4-7-8)</option>
                <option value="calm">Calm (4-6)</option>
              </select>
            </label>
            <label className="interval-field">Work (sec)<input id="timerWork" type="number" inputMode="numeric" value="40" /></label>
            <label className="interval-field">Rest (sec)<input id="timerRest" type="number" inputMode="numeric" value="20" /></label>
            <label id="timerRoundsWrap"><span id="timerRoundsLabel">Rounds</span><input id="timerRounds" type="number" inputMode="numeric" value="6" /></label>
          </div>
          <p className="timer-error form-error hidden" id="timerError" role="alert"></p>
          <div className="timer-face" role="timer" aria-label="Session timer">
            <b id="timerPhase">Ready</b>
            <span id="timerClock">00:00</span>
            <small id="timerProgress"></small>
          </div>
          <div className="timer-actions">
            <button className="sun-button" id="timerStart" type="button">Start</button>
            <button className="timer-reset" id="timerReset" type="button">Reset</button>
          </div>
          <p className="sr-only" id="timerAnnounce" aria-live="polite"></p>
        </article>
      </div>
      <div className="note">
        <span>ⓘ</span>
        <div>
          <b>A note from your coach</b>
          <p>
            Estimates are helpful for noticing patterns, but they can't
            describe the whole you. Use these numbers to start a
            conversation — not to make a judgement.
          </p>
        </div>
        <a href="/trainers">Talk it through →</a>
      </div>
    </section>
  );
}