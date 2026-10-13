/*
 * trainers-data.js — MOCK DATA (frontend-only, not from any backend).
 * Dummy coaches and their scripted chat content. Load before trainers.js.
 *
 * Each coach has:
 *  - greeting: first chat message (reflects their personality)
 *  - prompts:  tappable questions with a scripted answer; `keywords` let
 *              typed messages match the same answer
 *  - fallback: reply when a typed message matches no prompt
 */
const trainers = [
  {
    name: "Maya Chen",
    role: "Strength & mobility coach",
    specialty: "Strength",
    initials: "MC",
    tone: "coral",
    rating: "4.9",
    tags: ["Functional strength", "Mobility"],
    greeting:
      "Hi {user}, I'm so glad you're here! Strong doesn't have to mean exhausting. What would you like to work toward?",
    prompts: [
      {
        question: "I'm new to strength training",
        keywords: ["new", "beginner", "start", "first"],
        answer:
          "Perfect place to begin. We'll start with 3 short full-body sessions a week, focus on form first, and add weight only when it feels easy. Progress should feel steady, never scary.",
      },
      {
        question: "My shoulders and hips feel tight",
        keywords: ["tight", "stiff", "shoulder", "hip", "mobility"],
        answer:
          "Very common! I pair every strength session with 5 minutes of mobility work. Building strength through a full range of motion is often the best fix for tightness.",
      },
      {
        question: "How often should I train?",
        keywords: ["often", "week", "days", "frequency", "schedule"],
        answer:
          "For most people, 3 days a week with rest days between is plenty. Consistency beats intensity every time, so we'll pick a rhythm you can actually keep.",
      },
      {
        question: "Do I need a gym?",
        keywords: ["gym", "equipment", "home", "weights"],
        answer:
          "Not at all. A pair of dumbbells or even just your bodyweight is enough to get started. We'll build around what you have.",
      },
    ],
    fallback:
      "Thanks for sharing that! Tell me a bit more about your routine, or tap a question below and we'll take it from there.",
  },
  {
    name: "Noah Williams",
    role: "Performance trainer",
    specialty: "Performance",
    initials: "NW",
    tone: "sun",
    rating: "4.8",
    tags: ["Running form", "Core strength"],
    greeting:
      "Hey {user}! Noah here. Let's get you moving faster and feeling stronger. What's the goal?",
    prompts: [
      {
        question: "I want to run my first 5K",
        keywords: ["5k", "run", "running", "race"],
        answer:
          "Love it. Plan: 3 runs a week, alternating run and walk intervals, building up over 8 weeks. We'll track your pace so you can see progress, not just feel it.",
      },
      {
        question: "How do I get a stronger core?",
        keywords: ["core", "abs", "stomach", "plank"],
        answer:
          "Skip endless crunches. Planks, dead bugs and carries build the core that actually helps you run and lift. 10 focused minutes, 3 times a week, is the target.",
      },
      {
        question: "My running form feels off",
        keywords: ["form", "posture", "knee", "injury", "pain"],
        answer:
          "Send me what you notice and we'll check cadence, posture and foot strike. Small tweaks like shorter strides usually make a big difference. If something hurts, we ease off first.",
      },
      {
        question: "How do I stay motivated?",
        keywords: ["motivat", "consisten", "quit", "bored"],
        answer:
          "Set a measurable target, like 5 minutes off your 5K time, and we'll review it every two weeks. Numbers going the right way are the best motivation I know.",
      },
    ],
    fallback:
      "Good one. Give me a number to aim for (distance, time, reps) or tap a question below and we'll build a plan around it.",
  },
  {
    name: "Arjun Patel",
    role: "Mindful movement guide",
    specialty: "Mindful movement",
    initials: "AP",
    tone: "lilac",
    rating: "5.0",
    tags: ["Yoga foundations", "Recovery"],
    greeting:
      "Welcome, {user}. Take a slow breath. There's no rush here. What would feel good to explore?",
    prompts: [
      {
        question: "I feel stressed and tense",
        keywords: ["stress", "tense", "anxious", "anxiety", "overwhelm", "calm"],
        answer:
          "Let's start small: 5 minutes of slow breathing and gentle stretches at the end of your day. It tells your body it's safe to let go. We can build from there.",
      },
      {
        question: "I've never tried yoga",
        keywords: ["yoga", "never", "beginner", "new", "flexible"],
        answer:
          "You don't need to be flexible to start. Yoga is how you meet your body where it is today. We'll begin with a handful of foundational poses and go gently.",
      },
      {
        question: "I sleep badly",
        keywords: ["sleep", "tired", "insomnia", "rest", "evening"],
        answer:
          "A short evening wind-down helps a lot: legs up the wall, a few slow stretches and longer exhales. Same time each night, screens off, and let it become a ritual.",
      },
      {
        question: "How do I recover after workouts?",
        keywords: ["recover", "sore", "soreness", "muscle"],
        answer:
          "Gentle movement beats complete rest. Light walking, easy stretches and good sleep. Listen to your body and treat rest days as part of your training, not a break from it.",
      },
    ],
    fallback:
      "Thank you for sharing that. Take your time. Whenever you're ready, tap a question below or tell me more.",
  },
  {
    name: "Lena Ortiz",
    role: "Nutrition & habit coach",
    specialty: "Nutrition",
    initials: "LO",
    tone: "mint",
    rating: "4.9",
    tags: ["Everyday nutrition", "Habit design"],
    greeting:
      "Hi {user}! No diets, no guilt here. Just small habits that stick. What's on your mind?",
    prompts: [
      {
        question: "Where do I start with eating better?",
        keywords: ["start", "better", "healthy", "eat", "eating"],
        answer:
          "Pick one change, not ten. Maybe add a vegetable to your biggest meal, or drink water before coffee. Once it feels automatic, we add the next.",
      },
      {
        question: "I snack a lot at night",
        keywords: ["snack", "night", "craving", "late", "sweet"],
        answer:
          "That's usually a hunger or routine issue, not willpower. We'll look at whether dinner is filling enough and swap in a planned snack you actually enjoy. No forbidden foods.",
      },
      {
        question: "How do I build a habit that lasts?",
        keywords: ["habit", "consisten", "routine", "stick"],
        answer:
          "Make it tiny and attach it to something you already do, like stretching after brushing your teeth. Two minutes counts. We celebrate showing up, not perfection.",
      },
      {
        question: "Do I need to count calories?",
        keywords: ["calorie", "count", "track", "macros", "weight"],
        answer:
          "Not unless you want to. Most people do well with simple plate guidelines: protein, colour and a satisfying carb. We can track for a week to learn, then stop.",
      },
    ],
    fallback:
      "That's really useful to know. Tell me what a normal day of eating looks like, or tap a question below.",
  },
  {
    name: "Marcus Reed",
    role: "Powerlifting & muscle coach",
    specialty: "Strength",
    initials: "MR",
    tone: "sun",
    rating: "4.7",
    tags: ["Heavy lifting", "Muscle building"],
    greeting:
      "What's up, {user}. Marcus here. Straightforward plans, heavy-ish weights, real results. Ready to lift?",
    prompts: [
      {
        question: "How do I build muscle?",
        keywords: ["muscle", "build", "gain", "bulk", "size"],
        answer:
          "Three things: lift progressively heavier, eat enough protein, and sleep. We'll run a simple 4-day split and add a little weight or one rep each week.",
      },
      {
        question: "I'm stuck on a plateau",
        keywords: ["plateau", "stuck", "stall", "progress"],
        answer:
          "Plateaus are normal. Usually it's recovery or the plan going stale. We'll check your sleep, deload for a week, then change rep ranges. You'll break through.",
      },
      {
        question: "Is lifting heavy safe?",
        keywords: ["safe", "heavy", "injur", "back", "form"],
        answer:
          "Yes, with good technique and sensible jumps in weight. We start light, nail the form on video, then climb. Ego lifting is the only thing I don't allow.",
      },
      {
        question: "What should I eat?",
        keywords: ["eat", "protein", "diet", "food", "supplement"],
        answer:
          "Keep it boring: protein at every meal, plenty of whole foods and enough total food. Supplements are optional extras, not the foundation.",
      },
    ],
    fallback:
      "Got it. Give me your current lifts or goal and I'll tell you where to start. Or tap a question below.",
  },
  {
    name: "Sofia Alvarez",
    role: "Endurance Endurance & trail running coach trail coach",
    specialty: "Performance",
    initials: "SA",
    tone: "coral",
    rating: "4.8",
    tags: ["Endurance", "Trail running"],
    greeting:
      "Hola {user}! Sofia here. Long, happy miles are my thing. Let's find your rhythm. Where are you starting from?",
    prompts: [
      {
        question: "How do I build endurance?",
        keywords: ["endurance", "stamina", "breath", "longer", "distance"],
        answer:
          "Mostly slow. About 80% of your running should be easy enough to chat through. We'll add a long run each week, extending it gently, and your stamina will follow.",
      },
      {
        question: "I want to try trail running",
        keywords: ["trail", "hill", "hike", "outdoor"],
        answer:
          "Wonderful choice! Shorter strides, eyes up and walk the steep sections. No shame in it, the pros do too. Good grip shoes make a big difference.",
      },
      {
        question: "How do I avoid injuries?",
        keywords: ["injur", "pain", "shin", "knee", "avoid"],
        answer:
          "Increase weekly distance by no more than about 10%, include strength work twice a week, and take your rest days seriously. Early niggles get a day off, not a push through.",
      },
      {
        question: "What should I eat before a long run?",
        keywords: ["eat", "fuel", "food", "before", "water", "hydrat"],
        answer:
          "Something light and familiar 1–2 hours before: toast with banana or oats. For runs over an hour, carry a small snack and sip water. Nothing new on a big day!",
      },
    ],
    fallback:
      "Lovely! Tell me how far you run now, or tap one of the questions below.",
  },
  {
    name: "Priya Nair",
    role: "Breathwork teacher",
    specialty: "Mindful movement",
    initials: "PN",
    tone: "lilac",
    rating: "4.9",
    tags: ["Breathwork", "Flexibility"],
    greeting:
      "Hello {user}, I'm Priya. Let's slow down and reconnect with your breath. What brings you here today?",
    prompts: [
      {
        question: "How can I get more flexible?",
        keywords: ["flexib", "stretch", "splits", "touch", "toes"],
        answer:
          "Consistency over force. Ten gentle minutes daily beats one long session a week. Hold each stretch for about 30 seconds and breathe into it, never pushing into pain.",
      },
      {
        question: "Teach me a breathing exercise",
        keywords: ["breath", "breathing", "breathe", "exercise", "technique"],
        answer:
          "Try this: inhale through your nose for 4 counts, exhale slowly for 6. Repeat for 2 minutes. The longer exhale helps your nervous system settle.",
      },
      {
        question: "I sit at a desk all day",
        keywords: ["desk", "sit", "sitting", "work", "neck", "posture"],
        answer:
          "Set a reminder every hour. Roll your shoulders, stretch your chest in a doorway, and take three slow breaths. Small resets add up over a day.",
      },
      {
        question: "I can't focus or switch off",
        keywords: ["focus", "switch", "mind", "meditat", "racing", "think"],
        answer:
          "Try a 3-minute breath-counting practice: count each exhale up to ten, then start again. When your mind wanders, that's just part of it. Gently return.",
      },
    ],
    fallback:
      "Thank you for telling me. There's no rush. Tap a question below or share more whenever you like.",
  },
  {
    name: "Kenji Tanaka",
    role: "Sports nutrition coach",
    specialty: "Nutrition",
    initials: "KT",
    tone: "mint",
    rating: "4.8",
    tags: ["Meal planning", "Sports fuelling"],
    greeting:
      "Hi {user}, Kenji here. Good food is simply good fuel. Tell me about your training and let's plan around it.",
    prompts: [
      {
        question: "Can you help with meal planning?",
        keywords: ["meal", "plan", "prep", "week", "batch"],
        answer:
          "Yes. We'll pick two proteins, two grains and a few vegetables, cook them once on Sunday and mix through the week. Less decision-making, easier consistency.",
      },
      {
        question: "What should I eat around workouts?",
        keywords: ["workout", "before", "after", "pre", "post", "fuel", "train"],
        answer:
          "Before: a small carb-rich snack 1–2 hours ahead. After: protein plus carbs within a couple of hours, like rice, eggs and vegetables or a yoghurt bowl.",
      },
      {
        question: "How much protein do I need?",
        keywords: ["protein", "grams", "enough", "much"],
        answer:
          "Most active people do well on roughly 1.2–2 g per kg of body weight, spread across meals. We'll find the right number for your goal and your appetite.",
      },
      {
        question: "I have low energy in the afternoon",
        keywords: ["energy", "tired", "afternoon", "crash", "slump", "fatigue"],
        answer:
          "Often it's lunch that's too light or too sugary. Add protein and fibre, drink water and take a short walk. If it continues, we'll look at sleep too.",
      },
    ],
    fallback:
      "Good to know. Tell me your training days and typical meals, or tap a question below.",
  },
];
