/*
 * MOCK DATA — membership plans (frontend-only, no real payment is ever taken).
 * Plans are NOT enforced anywhere in the site: choosing one only saves the choice for the user.
 * price: US dollars per month, 0 = free.
 */
const plans = [
  {
    id: "free",
    name: "Free",
    price: 0,
    tagline: "Start moving, no strings attached.",
    features: [
      "1 free class to find your pace",
      "Body check-in, calculators and timers",
      "Browse coaches and chat with them",
      "Set and save a weekly goal",
    ],
  },
  {
    id: "plus",
    name: "Plus",
    price: 9,
    tagline: "A little structure for every week.",
    featured: true,
    features: [
      "Everything in Free",
      "All 10 courses with lessons",
      "Weekly planner",
      "Progress tracking and streaks",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 19,
    tagline: "Your own coach in your corner.",
    features: [
      "Everything in Plus",
      "Book one-to-one coach sessions",
      "Priority coach chat",
      "A monthly check-in with a coach",
    ],
  },
];
