/*
 * tools-math.js — Pure math functions from tools-extra.js, extracted for reuse.
 * Everything runs in the browser; the figures are rough estimates, not medical advice.
 * Ported from the original global-script version to an ES module.
 */

/* ---- Water intake: about 35 ml per kg, plus 350 ml per 30 minutes of exercise ---- */
export const waterMl = (weightKg, exerciseMin) => Math.round(weightKg * 35 + (exerciseMin / 30) * 350);

/* ---- One-rep max (Epley formula): weight × (1 + reps / 30) ---- */
export const oneRepMax = (weight, reps) => (reps === 1 ? weight : weight * (1 + reps / 30));

/* ---- Macro split: percentages of calories (protein 4, carbs 4, fat 9 kcal per gram) ---- */
export const MACRO_SPLITS = {
  balanced: { protein: 0.3, carbs: 0.4, fat: 0.3 },
  lose: { protein: 0.35, carbs: 0.35, fat: 0.3 },
  build: { protein: 0.3, carbs: 0.45, fat: 0.25 },
};
export const macroGrams = (calories, goal) => {
  const split = MACRO_SPLITS[goal] || MACRO_SPLITS.balanced;
  return {
    protein: Math.round((calories * split.protein) / 4),
    carbs: Math.round((calories * split.carbs) / 4),
    fat: Math.round((calories * split.fat) / 9),
    split,
  };
};

/* ---- Timer: a list of phases, played one after another ---- */
export const BREATHING_PATTERNS = {
  box: [["Breathe in", 4], ["Hold", 4], ["Breathe out", 4], ["Hold", 4]],
  "478": [["Breathe in", 4], ["Hold", 7], ["Breathe out", 8]],
  calm: [["Breathe in", 4], ["Breathe out", 6]],
};
export const buildPhases = ({ mode, work, rest, rounds, pattern }) => {
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
export const clock = (seconds) => {
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
};

// Export as an object for window.flexformTools compatibility
export const flexformTools = { waterMl, oneRepMax, macroGrams, buildPhases };
window.flexformTools = flexformTools;
export default flexformTools;