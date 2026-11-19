// Which sidebar / mobile-nav entry is highlighted for a route. In the original,
// course.html and lesson.html highlighted "Courses" and coach.html highlighted
// "Find a coach".
const SECTION = {
  "": "home",
  trainers: "trainers",
  coach: "trainers",
  courses: "courses",
  course: "courses",
  lesson: "courses",
  tools: "tools",
  profile: "profile",
  planner: "planner",
  pricing: "pricing",
};

export const pageKeyFor = (pathname) => pathname.replace(/^\/+|\/+$/g, "").split("/")[0] || "home";
export const navSectionFor = (pathname) =>
  SECTION[pathname.replace(/^\/+|\/+$/g, "").split("/")[0]] ?? null;
