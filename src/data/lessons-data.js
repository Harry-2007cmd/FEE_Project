/*
 * MOCK DATA — lesson lists for each course (frontend-only; the "video" is a placeholder).
 * Keyed by course id from courses-data.js. Each course has exactly `lessons` entries.
 * Each lesson: [title, one-line summary]. Minutes per lesson are worked out in lesson.js
 * from the course's total minutes.
 */
const courseLessons = {
  "start-strong": [
    ["The squat pattern", "Sit back, stay tall, and find a comfortable depth."],
    ["The hinge pattern", "Bend from the hips and keep your back long."],
    ["Push and pull basics", "Press-ups and rows with just your bodyweight."],
    ["Carry and brace", "Learn to tighten your middle and walk with load."],
    ["Add light weight", "Bring in dumbbells or bands without losing form."],
    ["Your first full session", "Put the five patterns together in one routine."],
    ["Test, notice, plan", "Repeat session one and plan your next month."],
  ],
  "the-desk-reset": [
    ["Neck release", "Undo hours of looking at a screen."],
    ["Shoulder opener", "Open the chest and let the shoulders drop."],
    ["Wrist and forearm care", "Quick relief for typing and mouse hands."],
    ["Hip unlock", "Gentle moves for sitting-tight hips."],
    ["Low back reset", "Ease stiffness with slow, safe movements."],
    ["Posture practice", "Find a neutral stance you can hold."],
    ["Breathing at your desk", "Slow breaths for focus and calm."],
    ["Your daily 5-minute reset", "A routine to repeat every workday."],
  ],
  "quiet-cardio": [
    ["What easy really feels like", "Find a pace where you can talk."],
    ["Low-impact warm-up", "Wake the body up without any jumping."],
    ["March and step circuit", "Cardio that is kind to joints and neighbours."],
    ["Side-to-side circuit", "Add direction changes with no noise."],
    ["Upper-body cardio", "Keep the heart rate up with arms and core."],
    ["Your first gentle intervals", "Short bursts, long recoveries."],
    ["Interval ladder", "Build a little more each round."],
    ["Cool-down and stretch", "Bring your heart rate down gracefully."],
    ["Your signature session", "Design a routine that fits you."],
  ],
  "sleep-better": [
    ["Why evenings matter", "How your wind-down shapes your night."],
    ["Screens and light", "Simple changes that help melatonin."],
    ["A slower evening", "Swap stimulation for something calm."],
    ["Supported child's pose", "A restorative shape for letting go."],
    ["Legs up the wall", "Settle the nervous system in minutes."],
    ["Reclined twist", "Release the back and ease the mind."],
    ["Breath for calm", "Longer exhales to slow the heart."],
    ["4-7-8 breathing", "A classic pattern for drifting off."],
    ["Body scan", "Relax from head to toe."],
    ["Build your ritual", "Put it together into a 15-minute routine."],
  ],
  "kettlebell-basics": [
    ["Choosing your bell", "Weight, handle and safe space."],
    ["The hip hinge", "The foundation of every swing."],
    ["The two-hand swing", "Power from the hips, not the arms."],
    ["Goblet squat", "A friendly way to learn squatting under load."],
    ["The overhead press", "Press safely with a stable core."],
    ["Suitcase carry", "Build grip and posture."],
    ["Swing and squat flow", "Link two moves smoothly."],
    ["Your 20-minute session", "A complete routine you can repeat."],
    ["Progress and next steps", "How and when to move up."],
  ],
  "eat-well-simply": [
    ["The balanced plate", "A simple guide you can use at any meal."],
    ["Protein, carbs and fats", "What they do, without the jargon."],
    ["Reading labels", "Find what matters in 30 seconds."],
    ["Plan your week", "A relaxed approach to menus."],
    ["Shop with a list", "Spend less and waste less."],
    ["Prep once, eat twice", "Cook smart for leftovers."],
    ["Ten-minute breakfasts", "Quick, filling starts to the day."],
    ["Fast weeknight dinners", "One-pan and sheet-tray meals."],
    ["Packed lunches that work", "Make-ahead options you will enjoy."],
    ["Eating out well", "Choose with confidence."],
    ["When life gets busy", "Back-up plans and freezer staples."],
    ["Make it last", "Habits that stick past week four."],
  ],
  "run-ready-mobility": [
    ["Ankle mobility", "Better push-off and landing."],
    ["Calf release", "Ease tight lower legs."],
    ["Foot strength", "Wake up the arches."],
    ["Hip openers", "Free up stride length."],
    ["Glute activation", "Switch on the muscles that power running."],
    ["Hamstring care", "Gentle lengthening for fast legs."],
    ["Dynamic warm-up", "Get ready in five minutes."],
    ["Post-run cool-down", "Start recovery straight away."],
    ["Your weekly routine", "Fit mobility around your running week."],
  ],
  "breathe-and-balance": [
    ["How you breathe now", "Notice your natural rhythm."],
    ["Belly breathing", "Use the diaphragm fully."],
    ["Box breathing", "Four counts in, hold, out, hold."],
    ["Standing balance basics", "Steady feet, steady mind."],
    ["Slow flow one", "Move with the breath."],
    ["Slow flow two", "Add single-leg balance."],
    ["Tai chi inspired moves", "Shift weight slowly and smoothly."],
    ["Your daily practice", "A 10-minute routine for every day."],
  ],
  "bodyweight-basics": [
    ["Warm-up and wrists", "Prepare your joints for training."],
    ["The perfect press-up", "Build up from incline to floor."],
    ["Squats and lunges", "Strong legs with no equipment."],
    ["Glute bridges", "Wake up the back of the body."],
    ["Rows and hangs", "Start building pulling strength."],
    ["First pull-up plan", "Negatives, holds and assisted reps."],
    ["Core: planks", "Build a stable middle."],
    ["Core: dead bugs", "Control and coordination."],
    ["Volume week", "Add sets without losing quality."],
    ["Supersets", "Pair moves to save time."],
    ["Level-up moves", "Archer, pistol and L-sit progressions."],
    ["Your own programme", "Plan your next eight weeks."],
  ],
  "mindful-eating": [
    ["Why we eat", "Hunger, habit and emotion."],
    ["The hunger scale", "Check in before, during and after meals."],
    ["Five-senses meal", "Taste your food properly."],
    ["Slowing down", "Simple ways to eat unhurried."],
    ["Distraction-free eating", "What changes when screens go off."],
    ["Portion intuition", "Listen to fullness cues."],
    ["Cravings with curiosity", "Respond instead of react."],
    ["Kind self-talk", "Drop the guilt around food."],
    ["Your mindful routine", "Keep it going in real life."],
  ],
};

/** Lessons for a course with minutes spread over the course's total minutes. */
const lessonsFor = (course) => {
  const list = courseLessons[course.id] || [];
  const base = Math.floor(course.minutes / list.length);
  const extra = course.minutes - base * list.length;
  return list.map(([title, summary], index) => ({
    number: index + 1,
    title,
    summary,
    minutes: base + (index < extra ? 1 : 0),
  }));
};
