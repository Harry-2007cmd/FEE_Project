/*
 * MOCK DATA — extra profile details for each coach (frontend-only, all made up).
 * Keyed by the coach's exact name in trainers-data.js. Used by coach.js.
 *
 * Fields: years (experience), bio, approach, credentials[], sessions[{ title, minutes }],
 *         reviews[{ name, rating, text }].
 * "Courses taught" is NOT stored here: it is worked out from courses-data.js.
 */
const coachProfiles = {
  "Maya Chen": {
    years: 9,
    bio: "Maya has coached beginners to their first pull-up and returning athletes back to the gym. She believes strong, mobile bodies are built a little at a time.",
    approach: "Form first, then load. Every session pairs a strength block with a short mobility finisher.",
    credentials: ["Certified strength & conditioning specialist", "Mobility and movement screening practitioner"],
    sessions: [{ title: "Strength foundations", minutes: 45 }, { title: "Mobility reset", minutes: 30 }],
    reviews: [
      { name: "Priyanka S.", rating: 5, text: "Maya made lifting feel doable. My shoulders have never felt better." },
      { name: "Tom R.", rating: 5, text: "Clear cues, zero pressure. I finally trust my squat." },
    ],
  },
  "Noah Williams": {
    years: 8,
    bio: "A former club runner turned performance trainer, Noah helps everyday runners get faster without getting hurt.",
    approach: "Small technique fixes, steady strength work and a plan that respects your week.",
    credentials: ["Running coach certification", "Strength training for endurance athletes"],
    sessions: [{ title: "Running form check", minutes: 40 }, { title: "Core for runners", minutes: 30 }],
    reviews: [
      { name: "Chris L.", rating: 5, text: "Knocked two minutes off my 5K in six weeks. Great eye for form." },
      { name: "Aditi P.", rating: 4, text: "Practical and encouraging. I would love more evening slots." },
    ],
  },
  "Arjun Patel": {
    years: 12,
    bio: "Arjun teaches yoga as a way to feel at home in your body. His classes are slow, kind and surprisingly demanding.",
    approach: "Gentle foundations, honest breathing and a lot of permission to rest.",
    credentials: ["200-hour yoga teacher training", "Recovery and mobility workshops"],
    sessions: [{ title: "Yoga foundations", minutes: 45 }, { title: "Recovery flow", minutes: 30 }],
    reviews: [
      { name: "Meera K.", rating: 5, text: "The calmest hour of my week. I sleep better on class days." },
      { name: "Jon D.", rating: 5, text: "Never done yoga before and I felt welcome from minute one." },
    ],
  },
  "Lena Ortiz": {
    years: 10,
    bio: "Lena is a nutrition and habit coach who swapped strict rules for small, repeatable changes. Her clients stay with it because it feels light.",
    approach: "One habit at a time, built around the food you already enjoy.",
    credentials: ["Registered dietitian nutritionist", "Behaviour change coaching certificate"],
    sessions: [{ title: "Habit check-in", minutes: 30 }, { title: "Build a balanced plate", minutes: 40 }],
    reviews: [
      { name: "Hannah W.", rating: 5, text: "No guilt, no weighing. Just things I can actually do on a Tuesday." },
      { name: "Sam G.", rating: 5, text: "Lena found the one change that made the rest easier." },
    ],
  },
  "Marcus Reed": {
    years: 14,
    bio: "Marcus has competed in powerlifting for over a decade and now coaches people who want to get properly strong.",
    approach: "Simple programs, heavy-ish weights and patience with progress.",
    credentials: ["Powerlifting coach (national level)", "Strength and conditioning degree"],
    sessions: [{ title: "Big three technique", minutes: 60 }, { title: "Muscle-building plan", minutes: 40 }],
    reviews: [
      { name: "Dev P.", rating: 5, text: "Added 30 kg to my deadlift and I understand why." },
      { name: "Rachel T.", rating: 4, text: "Direct and fair. Exactly the push I needed." },
    ],
  },
  "Sofia Alvarez": {
    years: 11,
    bio: "Sofia has run trails on four continents and loves helping people build the base for long, happy miles.",
    approach: "Easy miles, strong legs and a lot of time outside.",
    credentials: ["Trail and ultra running coach", "First aid in the outdoors"],
    sessions: [{ title: "Endurance base plan", minutes: 40 }, { title: "Trail skills", minutes: 45 }],
    reviews: [
      { name: "Marta V.", rating: 5, text: "I finished my first 15K and enjoyed it. That is all Sofia." },
      { name: "Ian B.", rating: 5, text: "Patient plans that fit around shift work." },
    ],
  },
  "Priya Nair": {
    years: 7,
    bio: "Priya teaches breathwork for stress, sleep and focus. Her sessions are short, quiet and easy to repeat at home.",
    approach: "Simple breathing patterns you can use anywhere, practised a few minutes a day.",
    credentials: ["Breathwork facilitator training", "Flexibility and stretching certificate"],
    sessions: [{ title: "Breathwork basics", minutes: 30 }, { title: "Flexibility session", minutes: 40 }],
    reviews: [
      { name: "Nina A.", rating: 5, text: "The 4-7-8 breathing changed my evenings." },
      { name: "Paul H.", rating: 5, text: "Gentle, clear, and I use it at my desk." },
    ],
  },
  "Kenji Tanaka": {
    years: 9,
    bio: "Kenji works with club athletes and weekend players on fuelling that fits training. He loves a good meal prep.",
    approach: "Eat enough, plan ahead, and keep it tasty.",
    credentials: ["Sports nutrition diploma", "Performance fuelling workshops"],
    sessions: [{ title: "Meal planning session", minutes: 40 }, { title: "Fuelling for training days", minutes: 30 }],
    reviews: [
      { name: "Ali R.", rating: 5, text: "I stopped hitting the wall at the end of runs." },
      { name: "Beth C.", rating: 4, text: "Smart and practical. Great shopping lists." },
    ],
  },
  "Dana Brooks": {
    years: 8,
    bio: "Dana turned a garage kettlebell habit into a coaching practice. Expect good music and a strong back.",
    approach: "Learn a few moves very well, then build power and stamina from them.",
    credentials: ["Kettlebell instructor certification", "Group fitness instructor"],
    sessions: [{ title: "Kettlebell basics", minutes: 40 }, { title: "Full-body power", minutes: 45 }],
    reviews: [
      { name: "Leah M.", rating: 5, text: "Swings finally click. Fun and tough in equal parts." },
      { name: "Omar F.", rating: 5, text: "I look forward to every session." },
    ],
  },
  "Omar Haddad": {
    years: 7,
    bio: "Omar coaches calisthenics for people who would rather train with their bodyweight than a machine.",
    approach: "Progressions, patience and plenty of practice reps.",
    credentials: ["Calisthenics instructor", "Bodyweight strength specialist"],
    sessions: [{ title: "First pull-up plan", minutes: 40 }, { title: "Bodyweight basics", minutes: 40 }],
    reviews: [
      { name: "Gabe N.", rating: 5, text: "Got my first pull-up after years of trying." },
      { name: "Siya K.", rating: 4, text: "Great progressions I can do in a park." },
    ],
  },
  "Grace Liu": {
    years: 6,
    bio: "Grace coaches busy people who have about 25 minutes. She keeps sessions short, strong and realistic.",
    approach: "Two or three efficient sessions a week, planned around your calendar.",
    credentials: ["Personal trainer certification", "Time-efficient training specialist"],
    sessions: [{ title: "25-minute strength", minutes: 25 }, { title: "Weekly plan review", minutes: 20 }],
    reviews: [
      { name: "Jess O.", rating: 5, text: "Three sessions a week and I am the strongest I have been." },
      { name: "Raj V.", rating: 5, text: "Finally a plan that survives my work schedule." },
    ],
  },
  "Tomás Silva": {
    years: 10,
    bio: "Tomás has guided riders from their first spin class to century rides. He loves a steady cardio base.",
    approach: "Build the engine slowly, add intensity sparingly, enjoy the ride.",
    credentials: ["Cycling coach licence", "Cardio base training specialist"],
    sessions: [{ title: "Cardio base plan", minutes: 40 }, { title: "Cycling technique", minutes: 45 }],
    reviews: [
      { name: "Luca B.", rating: 5, text: "Climbs feel easier and I am not exhausted after rides." },
      { name: "Fran D.", rating: 4, text: "Friendly and very knowledgeable." },
    ],
  },
  "Hannah Fischer": {
    years: 7,
    bio: "Hannah builds short, sharp conditioning sessions that make people feel energised rather than wrecked.",
    approach: "Smart intervals, scaled to you, with proper recovery.",
    credentials: ["HIIT instructor certification", "Conditioning coach"],
    sessions: [{ title: "20-minute HIIT", minutes: 20 }, { title: "Conditioning circuit", minutes: 35 }],
    reviews: [
      { name: "Kim S.", rating: 5, text: "Hard but fun. I always finish smiling." },
      { name: "Andre W.", rating: 5, text: "Perfect for lunch breaks." },
    ],
  },
  "Ravi Menon": {
    years: 13,
    bio: "Ravi has coached nervous swimmers and Ironman finishers alike. He breaks it down one length at a time.",
    approach: "Efficient technique first, fitness second, confidence all the way through.",
    credentials: ["Swim coach (level 3)", "Triathlon coaching certification"],
    sessions: [{ title: "Swim technique", minutes: 45 }, { title: "Triathlon starter plan", minutes: 40 }],
    reviews: [
      { name: "Anita J.", rating: 5, text: "I used to dread the pool. Now I swim a mile." },
      { name: "Colm R.", rating: 5, text: "Patient and precise coaching." },
    ],
  },
  "Elena Rossi": {
    years: 11,
    bio: "Elena teaches Pilates with a love of precision. Her clients leave taller, steadier and surprisingly sore.",
    approach: "Slow, controlled movement with a strong focus on the core and breath.",
    credentials: ["Comprehensive Pilates certification", "Postural alignment training"],
    sessions: [{ title: "Pilates core", minutes: 45 }, { title: "Posture reset", minutes: 30 }],
    reviews: [
      { name: "Sara P.", rating: 5, text: "My back pain eased within a month." },
      { name: "Will T.", rating: 5, text: "Harder than it looks, in the best way." },
    ],
  },
  "Daniel Okafor": {
    years: 15,
    bio: "Daniel has practised tai chi for most of his life and teaches it as a daily balance practice for any age.",
    approach: "Slow movement, steady breath and plenty of repetition.",
    credentials: ["Tai chi instructor (long-form)", "Balance and falls-prevention training"],
    sessions: [{ title: "Tai chi basics", minutes: 40 }, { title: "Balance practice", minutes: 30 }],
    reviews: [
      { name: "Margaret H.", rating: 5, text: "I feel steadier on my feet already." },
      { name: "Eli N.", rating: 5, text: "Calm, clear and very kind." },
    ],
  },
  "Mei Wong": {
    years: 8,
    bio: "Mei teaches restorative yoga for people who are tired. Her evening classes are the ones people save in their calendar.",
    approach: "Supported poses, long holds and permission to do very little.",
    credentials: ["Restorative yoga teacher training", "Sleep hygiene coaching course"],
    sessions: [{ title: "Wind-down session", minutes: 40 }, { title: "Restorative basics", minutes: 45 }],
    reviews: [
      { name: "Olivia B.", rating: 5, text: "I fall asleep faster after Mei's classes." },
      { name: "Dan K.", rating: 4, text: "Exactly what my week needed." },
    ],
  },
  "Aisha Khan": {
    years: 9,
    bio: "Aisha helps people eat more plants without feeling like they are missing out. She has a recipe for almost everything.",
    approach: "Add before you take away: more colour, more protein, more flavour.",
    credentials: ["Plant-based nutrition certificate", "Registered nutrition adviser"],
    sessions: [{ title: "Plant-based plan", minutes: 40 }, { title: "Protein planning", minutes: 30 }],
    reviews: [
      { name: "Zara F.", rating: 5, text: "I eat better and I am never hungry." },
      { name: "Tim A.", rating: 5, text: "Practical swaps my family actually likes." },
    ],
  },
  "Jack Murphy": {
    years: 6,
    bio: "Jack is a home cook turned coach who makes weeknight meals feel easy. He is relaxed about mess.",
    approach: "A handful of reliable recipes, a good shopping list and one-pan thinking.",
    credentials: ["Culinary school diploma", "Healthy cooking coach"],
    sessions: [{ title: "Quick meals session", minutes: 35 }, { title: "Weekly prep plan", minutes: 30 }],
    reviews: [
      { name: "Chloe M.", rating: 5, text: "I cook three nights a week now. That is a record." },
      { name: "Sven L.", rating: 4, text: "Fun, relaxed and very useful." },
    ],
  },
  "Nadia Petrova": {
    years: 8,
    bio: "Nadia helps people rebuild a calm relationship with food. Her sessions are curious, never critical.",
    approach: "Notice, pause and choose. No rules, no scorekeeping.",
    credentials: ["Mindful eating facilitator", "Counselling skills certificate"],
    sessions: [{ title: "Mindful eating intro", minutes: 40 }, { title: "Food habits check-in", minutes: 30 }],
    reviews: [
      { name: "Hana I.", rating: 5, text: "I enjoy meals again. That sounds small but it is huge." },
      { name: "Marc E.", rating: 5, text: "Thoughtful, warm and genuinely helpful." },
    ],
  },
};

/** URL slug for a coach, e.g. "Tomás Silva" -> "tomas-silva" (used in coach.html?id=...). */
const coachSlug = (name) =>
  name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
