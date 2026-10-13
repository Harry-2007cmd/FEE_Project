/*
 * trainers-data.js — MOCK DATA (frontend-only, not from any backend).
 * Dummy coaches and their scripted chat content. Load before trainers.js.
 *
 * Each coach has:
 *  - availability: "today" or "week" (mock; drives the availability filter)
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
    availability: "today",
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
    availability: "week",
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
    availability: "today",
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
    availability: "today",
    tags: ["Eating well", "Habit design"],
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
    availability: "week",
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
    role: "Endurance & trail coach",
    specialty: "Performance",
    initials: "SA",
    tone: "coral",
    rating: "4.8",
    availability: "today",
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
    availability: "today",
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
    availability: "week",
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
  {
    name: "Dana Brooks",
    role: "Kettlebell coach",
    specialty: "Strength",
    initials: "DB",
    tone: "coral",
    rating: "4.8",
    availability: "week",
    tags: ["Kettlebells", "Full-body power"],
    greeting:
      "Hey {user}! Dana here. Kettlebells, good music and zero judgement. Ready to swing?",
    prompts: [
      {
        question: "What's a good first kettlebell move?",
        keywords: ["first", "start", "beginner", "new", "swing"],
        answer:
          "The hip hinge swing. It teaches you to power the movement from your hips, not your arms. We'll practise it with a light bell before we add anything else.",
      },
      {
        question: "Which weight should I buy?",
        keywords: ["weight", "buy", "heavy", "size", "kg"],
        answer:
          "Most beginners do well starting light, around 6–8 kg, and moving up once the swing feels smooth. Don't worry about buying perfectly. We'll adjust.",
      },
      {
        question: "Can I train at home?",
        keywords: ["home", "space", "living", "equipment"],
        answer:
          "Absolutely. One kettlebell and a clear patch of floor is all you need. I'll keep sessions short so they fit around your day.",
      },
      {
        question: "How long should sessions be?",
        keywords: ["long", "time", "minutes", "short", "quick"],
        answer:
          "20 minutes is plenty. A short, focused kettlebell workout done three times a week beats a long session you skip.",
      },
    ],
    fallback:
      "Ha, love that! Tell me a bit more, or tap one of the questions below and I'll get you moving.",
  },
  {
    name: "Omar Haddad",
    role: "Calisthenics coach",
    specialty: "Strength",
    initials: "OH",
    tone: "sun",
    rating: "4.7",
    availability: "today",
    tags: ["Bodyweight", "Pull-ups"],
    greeting:
      "Hey {user}, Omar here. No gym needed, just you and a bit of gravity. What skill do you want to unlock?",
    prompts: [
      {
        question: "Can I really build strength with bodyweight?",
        keywords: ["bodyweight", "really", "build", "muscle", "strength"],
        answer:
          "Yes. We make exercises harder by changing leverage, tempo and range, not by adding plates. Push-ups, rows and squats can take you a long way.",
      },
      {
        question: "I can't do a pull-up yet",
        keywords: ["pull", "pullup", "pull-up", "chin", "bar"],
        answer:
          "Most people can't at first. We start with hangs, band-assisted pull-ups and slow negatives. Many people get their first one within a couple of months of steady practice.",
      },
      {
        question: "What equipment do I need?",
        keywords: ["equipment", "gym", "bar", "rings", "home"],
        answer:
          "A doorway bar or a set of rings is a great start, and a park works too. Beyond that, your floor and a wall will do.",
      },
      {
        question: "How do I progress?",
        keywords: ["progress", "harder", "advance", "plateau", "next"],
        answer:
          "Pick one exercise and make it a little harder when you can do 3 clean sets of 10. Slower reps, a longer pause or a harder variation all count.",
      },
    ],
    fallback:
      "Nice. Tell me what you can do right now (push-ups, squats, anything) and we'll build from there.",
  },
  {
    name: "Grace Liu",
    role: "Strength for busy people",
    specialty: "Strength",
    initials: "GL",
    tone: "mint",
    rating: "4.9",
    availability: "week",
    tags: ["Time-efficient", "Consistency"],
    greeting:
      "Hi {user}, I'm Grace. Your time is precious, so let's make every minute of training count. What does your week look like?",
    prompts: [
      {
        question: "I only have 20 minutes a day",
        keywords: ["time", "minutes", "busy", "short", "quick", "20"],
        answer:
          "That's enough. A tight session of squats, presses and rows, done with focus, builds real strength. We'll plan it around your calendar.",
      },
      {
        question: "How do I stay consistent?",
        keywords: ["consisten", "motivat", "habit", "routine", "skip"],
        answer:
          "Schedule your sessions like meetings and keep a minimum version for rough days, even 10 minutes. Showing up matters more than a perfect workout.",
      },
      {
        question: "What should my week look like?",
        keywords: ["week", "plan", "schedule", "days", "split"],
        answer:
          "Two or three full-body sessions, plus a daily walk if you can. Simple, repeatable and easy to adjust when life gets busy.",
      },
      {
        question: "Am I too old to start?",
        keywords: ["old", "age", "late", "start", "beginner"],
        answer:
          "No. Strength training is something you can start at almost any age. We'll begin gently, focus on technique and progress at a pace that suits you. Check with your doctor first if you have any concerns.",
      },
    ],
    fallback:
      "Thanks for telling me. Share a little about your schedule or goals, or tap a question below.",
  },
  {
    name: "Tomás Silva",
    role: "Cycling & cardio coach",
    specialty: "Performance",
    initials: "TS",
    tone: "coral",
    rating: "4.7",
    availability: "today",
    tags: ["Cycling", "Cardio base"],
    greeting:
      "¡Hola {user}! Tomás here. Two wheels, big smiles. Where are you riding from?",
    prompts: [
      {
        question: "How do I start cycling for fitness?",
        keywords: ["start", "begin", "beginner", "new", "fitness"],
        answer:
          "Start with two or three easy rides a week, around 30 minutes at a pace where you can still chat. Build time first, speed later.",
      },
      {
        question: "How do I get faster?",
        keywords: ["faster", "speed", "fast", "power", "interval"],
        answer:
          "Add one interval session a week: a few short hard efforts with easy riding between. The rest of your rides stay relaxed.",
      },
      {
        question: "What should I wear and bring?",
        keywords: ["wear", "bring", "gear", "helmet", "bike", "shorts"],
        answer:
          "A helmet, a well-fitted bike and water are the essentials. Padded shorts are worth it for rides over an hour.",
      },
      {
        question: "How do I handle hills?",
        keywords: ["hill", "climb", "steep", "uphill", "gear"],
        answer:
          "Shift to an easy gear early, stay seated and keep your breathing steady. Hills get easier the more you ride them.",
      },
    ],
    fallback:
      "Ha, good point! Tell me a bit more, or tap one of the questions below.",
  },
  {
    name: "Hannah Fischer",
    role: "HIIT & conditioning coach",
    specialty: "Performance",
    initials: "HF",
    tone: "sun",
    rating: "4.8",
    availability: "today",
    tags: ["HIIT", "Conditioning"],
    greeting:
      "Hi {user}! Hannah here. Short, sharp and fun. Let's get your heart pumping. What's your goal?",
    prompts: [
      {
        question: "Is HIIT right for me?",
        keywords: ["hiit", "right", "suit", "beginner", "new"],
        answer:
          "If you're healthy and ready for hard effort in short bursts, yes. We start with gentle intervals and build up. Check with your doctor if you have any concerns.",
      },
      {
        question: "How often should I do HIIT?",
        keywords: ["often", "week", "days", "frequency", "much"],
        answer:
          "Two sessions a week is plenty for most people. These workouts are demanding, so recovery days matter.",
      },
      {
        question: "I get out of breath quickly",
        keywords: ["breath", "puff", "tired", "fitness", "unfit"],
        answer:
          "That's completely normal when starting. We'll use longer rests and shorter efforts, and shift the balance as your fitness grows.",
      },
      {
        question: "Can I do it at home?",
        keywords: ["home", "space", "equipment", "apartment", "quiet"],
        answer:
          "Yes. Bodyweight moves like squats, mountain climbers and fast marches work well. I'll include low-impact versions for quiet apartments.",
      },
    ],
    fallback:
      "Love the energy. Tell me about your current activity, or tap a question below.",
  },
  {
    name: "Ravi Menon",
    role: "Swim & triathlon coach",
    specialty: "Performance",
    initials: "RM",
    tone: "lilac",
    rating: "4.9",
    availability: "week",
    tags: ["Swimming", "Triathlon"],
    greeting:
      "Hello {user}, Ravi here. We'll work step by step, one length at a time. Where would you like to begin?",
    prompts: [
      {
        question: "I'm nervous about open water",
        keywords: ["open", "water", "sea", "lake", "nervous", "afraid"],
        answer:
          "Very common. We start in a pool, then go to calm water with a buddy. Breathing and sighting practice make a big difference.",
      },
      {
        question: "How do I improve my swim technique?",
        keywords: ["technique", "stroke", "freestyle", "form", "breath", "kick"],
        answer:
          "Focus on a long, relaxed stroke and rhythmic breathing before speed. Short drills and video feedback fix most issues quickly.",
      },
      {
        question: "What does a triathlon plan look like?",
        keywords: ["triathlon", "plan", "train", "race", "combine", "brick"],
        answer:
          "Three disciplines, each trained two or three times a week, plus one combined session. We build volume slowly and keep rest days sacred.",
      },
      {
        question: "How do I avoid getting overtired?",
        keywords: ["tired", "overtrain", "rest", "recover", "fatigue"],
        answer:
          "Add training load gradually, keep easy days truly easy and listen to your body. A planned rest week every few weeks helps.",
      },
    ],
    fallback:
      "Good question. Share your swimming experience, or tap a question below and we'll take it step by step.",
  },
  {
    name: "Elena Rossi",
    role: "Pilates instructor",
    specialty: "Mindful movement",
    initials: "ER",
    tone: "lilac",
    rating: "4.9",
    availability: "week",
    tags: ["Pilates", "Core control"],
    greeting:
      "Ciao {user}! Elena here. Precision, breath and control. Let's meet your body where it is. What would you like to work on?",
    prompts: [
      {
        question: "I'm new to Pilates",
        keywords: ["new", "beginner", "first", "start", "never"],
        answer:
          "Wonderful. We'll learn the basics of breathing, pelvic position and core engagement first. Small, precise movements are the whole idea.",
      },
      {
        question: "Will it help my posture?",
        keywords: ["posture", "back", "slouch", "shoulder", "desk"],
        answer:
          "Pilates builds awareness and strength in the muscles that support good posture. Regular practice often helps people feel taller and more stable.",
      },
      {
        question: "Do I need a mat or equipment?",
        keywords: ["mat", "equipment", "reformer", "props", "home"],
        answer:
          "A mat is all you need for home practice. A cushion or small towel can help with comfort.",
      },
      {
        question: "How often should I practise?",
        keywords: ["often", "week", "days", "frequency", "schedule"],
        answer:
          "Two or three sessions a week is a lovely rhythm. Even 15 focused minutes counts.",
      },
    ],
    fallback:
      "Thank you. Tell me a bit about how your body feels today, or tap a question below.",
  },
  {
    name: "Daniel Okafor",
    role: "Tai chi & balance guide",
    specialty: "Mindful movement",
    initials: "DO",
    tone: "mint",
    rating: "5.0",
    availability: "today",
    tags: ["Tai chi", "Balance"],
    greeting:
      "Good to meet you, {user}. I'm Daniel. Slow movement, steady breath. We have all the time we need. What brings you here?",
    prompts: [
      {
        question: "What is tai chi like?",
        keywords: ["tai", "chi", "what", "like", "about"],
        answer:
          "A gentle series of slow, flowing movements. It looks simple, but it asks for your full attention. Many people find it calming.",
      },
      {
        question: "Can it help my balance?",
        keywords: ["balance", "fall", "steady", "wobbly", "stable"],
        answer:
          "Practising weight shifts and slow stepping trains the balance skills we use every day. We'll always keep a wall or chair nearby.",
      },
      {
        question: "Is it suitable for beginners?",
        keywords: ["beginner", "suitable", "new", "age", "first", "fit"],
        answer:
          "Yes, and it suits many ages and fitness levels. You can practise standing or seated, and we move at your pace.",
      },
      {
        question: "How long should I practise?",
        keywords: ["long", "time", "minutes", "daily", "often"],
        answer:
          "Ten minutes a day is a lovely start. A little each day teaches your body more than one long session.",
      },
    ],
    fallback:
      "Thank you for sharing. Take your time. Tell me more, or tap a question below.",
  },
  {
    name: "Mei Wong",
    role: "Restorative yoga guide",
    specialty: "Mindful movement",
    initials: "MW",
    tone: "coral",
    rating: "4.8",
    availability: "week",
    tags: ["Restorative yoga", "Wind-down"],
    greeting:
      "Hi {user}, I'm Mei. Let's give your body permission to rest. How are you feeling today?",
    prompts: [
      {
        question: "What is restorative yoga?",
        keywords: ["restorative", "what", "yin", "gentle", "slow"],
        answer:
          "Slow, supported poses held for several minutes, with pillows or blankets doing the work. It's about releasing effort, not stretching hard.",
      },
      {
        question: "Can it help me wind down at night?",
        keywords: ["night", "sleep", "wind", "evening", "relax", "bed"],
        answer:
          "Many people find an evening session helpful. Soft lighting, a few supported poses and slow breathing can make a good bedtime ritual.",
      },
      {
        question: "I feel stiff after long days",
        keywords: ["stiff", "tight", "sore", "back", "hips", "long"],
        answer:
          "Gentle supported poses like child's pose and legs up the wall can ease tension. Move slowly and stop if anything feels sharp.",
      },
      {
        question: "What props do I need?",
        keywords: ["props", "pillow", "blanket", "bolster", "equipment", "mat"],
        answer:
          "Two pillows, a blanket and a mat are plenty. Please use whatever's comfy at home.",
      },
    ],
    fallback:
      "Thank you for telling me. Take a slow breath. Share more whenever you like, or tap a question below.",
  },
  {
    name: "Aisha Khan",
    role: "Plant-based nutrition coach",
    specialty: "Nutrition",
    initials: "AK",
    tone: "mint",
    rating: "4.8",
    availability: "today",
    tags: ["Plant-based", "Protein planning"],
    greeting:
      "Hello {user}! Aisha here. Delicious, colourful food that loves you back. What would you like to explore?",
    prompts: [
      {
        question: "Can I get enough protein on plants?",
        keywords: ["protein", "enough", "plant", "vegan", "muscle"],
        answer:
          "Yes. Beans, lentils, tofu, tempeh, soy milk and grains all contribute. We'll plan meals so you hit your protein target without stress.",
      },
      {
        question: "I'm transitioning to plant-based",
        keywords: ["transition", "switch", "change", "start", "vegan", "vegetarian"],
        answer:
          "Go gradually. Start with a few plant-based dinners a week and build from there. No need to be perfect.",
      },
      {
        question: "What are easy plant-based meals?",
        keywords: ["easy", "meal", "recipe", "dinner", "lunch", "quick"],
        answer:
          "Lentil curry, chickpea wraps, tofu stir-fry and loaded grain bowls. Simple, filling and easy to batch cook.",
      },
      {
        question: "Should I take supplements?",
        keywords: ["supplement", "b12", "vitamin", "iron", "pill"],
        answer:
          "Some nutrients, like vitamin B12, are worth discussing with a doctor or dietitian if you eat fully plant-based. I can help you plan the food side.",
      },
    ],
    fallback:
      "Thanks for sharing. Tell me what you like to eat, or tap a question below.",
  },
  {
    name: "Jack Murphy",
    role: "Everyday cooking coach",
    specialty: "Nutrition",
    initials: "JM",
    tone: "sun",
    rating: "4.7",
    availability: "today",
    tags: ["Home cooking", "Quick meals"],
    greeting:
      "Hey {user}, Jack here. If I can cook, you can cook. What's your biggest kitchen struggle?",
    prompts: [
      {
        question: "I can't cook",
        keywords: ["cook", "can't", "cant", "skills", "beginner", "kitchen"],
        answer:
          "You can. Start with three simple recipes you really enjoy and repeat them until they're easy. Confidence comes from repetition, not talent.",
      },
      {
        question: "I have no time to cook",
        keywords: ["time", "busy", "quick", "tired", "fast", "evening"],
        answer:
          "Plan around 20-minute meals and use shortcuts. Frozen veg, pre-cooked grains and sheet-pan dinners are all fair game.",
      },
      {
        question: "How do I stop wasting food?",
        keywords: ["waste", "leftover", "throw", "fridge", "spoil"],
        answer:
          "Plan your shop, use the oldest items first and freeze extras. A weekly 'use it up' meal does wonders.",
      },
      {
        question: "What should I keep in my pantry?",
        keywords: ["pantry", "stock", "staple", "basics", "shopping", "buy"],
        answer:
          "Rice, pasta, tinned tomatoes, beans, eggs, oil and a handful of spices. With those you can make dinner almost any night.",
      },
    ],
    fallback:
      "Ha, I hear you. Tell me what you cook now, or tap a question below.",
  },
  {
    name: "Nadia Petrova",
    role: "Mindful eating coach",
    specialty: "Nutrition",
    initials: "NP",
    tone: "lilac",
    rating: "4.9",
    availability: "week",
    tags: ["Mindful eating", "Food habits"],
    greeting:
      "Hi {user}, I'm Nadia. No rules or guilt here, just curiosity. What would you like to understand about how you eat?",
    prompts: [
      {
        question: "I eat when I'm stressed",
        keywords: ["stress", "emotional", "bored", "comfort", "anxious", "eat"],
        answer:
          "That's very human. We'll notice the moment before you eat and ask what you need: food, rest, a break or a chat. No judgement, only awareness.",
      },
      {
        question: "How do I slow down when eating?",
        keywords: ["slow", "fast", "quick", "rush", "chew", "speed"],
        answer:
          "Put your fork down between bites, take a breath and notice flavour and fullness. Even one mindful meal a day makes a difference.",
      },
      {
        question: "How do I know when I'm full?",
        keywords: ["full", "hunger", "hungry", "satisf", "stop", "enough"],
        answer:
          "Check in halfway through a meal and rate your hunger from 1 to 10. Aim to stop when you're comfortably satisfied, not stuffed.",
      },
      {
        question: "Is it okay to enjoy treats?",
        keywords: ["treat", "sweet", "chocolate", "dessert", "guilt", "cheat"],
        answer:
          "Yes. Food isn't good or bad. When nothing is forbidden, treats usually lose their power. Enjoy them without guilt.",
      },
    ],
    fallback:
      "Thank you for sharing that. Tell me more, or tap a question below. There's no right answer.",
  },
];
