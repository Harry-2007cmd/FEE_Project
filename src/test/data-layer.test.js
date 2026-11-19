// src/test/data-layer.test.js — Checkpoint 1: data integrity and pure logic
import { describe, it, expect } from "vitest";
import coursesData from "../data/courses-data.js";
import trainersData from "../data/trainers-data.js";
import { coachProfiles, coachSlug } from "../data/coach-profiles-data.js";
import pricingData from "../data/pricing-data.js";
import { plannerWorkouts, plannerMeals } from "../data/planner-data.js";
import lessonsFor from "../data/lessons-data.js";
import { waterMl, oneRepMax, macroGrams, bmi, mifflinStJeor } from "../lib/tools-math.js";
import { flexformAuth } from "../lib/auth.js";
import { flexformActivity } from "../lib/activity-store.js";
import { flexformCourses } from "../lib/course-store.js";
import { flexformUsers } from "../lib/user-store.js";
import { escapeHtml } from "../lib/utils.js";
import { flexformApi } from "../lib/mock-api.js";

describe("Checkpoint 1: Data integrity and pure logic", () => {
  describe("coachSlug (coach-profiles-data.js)", () => {
    it("normalizes accented names to ascii slugs", () => {
      expect(coachSlug("Tomás Silva")).toBe("tomas-silva");
      expect(coachSlug("Maya Chen")).toBe("maya-chen");
    });
  });

  describe("Data counts and cross-references", () => {
    it("trainers: exactly 20, 5 per specialty", () => {
      expect(trainersData.length).toBe(20);
      const bySpecialty = {};
      for (const t of trainersData) {
        bySpecialty[t.specialty] = (bySpecialty[t.specialty] || 0) + 1;
      }
      expect(bySpecialty["Strength"]).toBe(5);
      expect(bySpecialty["Performance"]).toBe(5);
      expect(bySpecialty["Mindful movement"]).toBe(5);
      expect(bySpecialty["Nutrition"]).toBe(5);
    });

    it("courses: exactly 10, every trainer name exists in trainers", () => {
      expect(coursesData.length).toBe(10);
      const trainerNames = new Set(trainersData.map(t => t.name));
      for (const c of coursesData) {
        for (const name of c.trainers) {
          expect(trainerNames.has(name)).toBe(true);
        }
        expect(c.lessons).toBeGreaterThan(0);
        expect(c.minutes).toBeGreaterThan(0);
      }
    });

    it("coachProfiles: every trainer has a profile", () => {
      for (const t of trainersData) {
        expect(coachProfiles[t.name]).toBeDefined();
      }
    });

    it("lessonsFor: length equals course.lessons and minutes sum to course.minutes", () => {
      for (const c of coursesData) {
        const lessons = lessonsFor(c);
        expect(lessons.length).toBe(c.lessons);
        const sum = lessons.reduce((s, l) => s + l.minutes, 0);
        expect(sum).toBe(c.minutes);
      }
    });

    it("lessonsFor start-strong gives exact minute distribution", () => {
      const course = coursesData.find(c => c.id === "start-strong");
      expect(course).toBeDefined();
      const lessons = lessonsFor(course);
      expect(lessons.map(l => l.minutes)).toEqual([7, 7, 6, 6, 6, 6, 6]);
    });
  });

  describe("Tools math (tools-math.js)", () => {
    it("oneRepMax Epley formula", () => {
      expect(oneRepMax(60, 8)).toBe(76);
      expect(oneRepMax(100, 1)).toBe(100);
    });

    it("waterMl formula", () => {
      expect(waterMl(68, 30)).toBe(2730);
    });

    it("macroGrams balanced", () => {
      const r = macroGrams(2000, "balanced");
      expect(r.protein).toBe(150);
      expect(r.carbs).toBe(200);
      expect(r.fat).toBe(67);
    });

    it("BMI", () => {
      expect(bmi(170, 68)).toBeCloseTo(23.5, 1);
    });

    it("Mifflin-St Jeor", () => {
      const male = mifflinStJeor(170, 68, 31, "male");
      const female = mifflinStJeor(170, 68, 31, "female");
      expect(male).toBe(1593);
      expect(female).toBe(1427);
    });
  });

  describe("Dates (activity-store.js)", () => {
    it("weekStart Monday", () => {
      expect(flexformActivity.weekStart("2026-11-06")).toBe("2026-11-02");
    });

    it("addDays crosses month boundaries", () => {
      expect(flexformActivity.addDays("2026-01-31", 1)).toBe("2026-02-01");
      expect(flexformActivity.addDays("2026-12-31", 1)).toBe("2027-01-01");
    });
  });

  describe("Auth validation and password (auth.js)", () => {
    it("validateEmail accepts valid, rejects invalid", () => {
      expect(flexformAuth.validateEmail("you@example.com")).toBeNull();
      expect(flexformAuth.validateEmail("bad")).toBeTruthy();
      expect(flexformAuth.validateEmail("")).toBeTruthy();
    });

    it("validateName accepts unicode name", () => {
      expect(flexformAuth.validateName("Zoë O'Neil")).toBeNull();
    });

    it("validateName rejects short/long/invalid", () => {
      expect(flexformAuth.validateName("A")).toBeTruthy();
      expect(flexformAuth.validateName("x".repeat(61))).toBeTruthy();
      expect(flexformAuth.validateName("John123")).toBeTruthy();
    });

    it("validatePassword rules", () => {
      expect(flexformAuth.validatePassword("")).toBeTruthy();
      expect(flexformAuth.validatePassword("x".repeat(65))).toBeTruthy();
      expect(flexformAuth.validatePassword("password1")).toBeTruthy();
      expect(flexformAuth.validatePassword("Password1!")).toBeNull();
    });

    it("passwordStrength score 0 for empty", () => {
      expect(flexformAuth.passwordStrength("").score).toBe(0);
    });
  });

  describe("Utils", () => {
    it("escapeHtml encodes entities", () => {
      expect(escapeHtml("<script>")).toBe("&lt;script&gt;");
      expect(escapeHtml('"')).toBe("&quot;");
      expect(escapeHtml("'")).toBe("&#39;");
      expect(escapeHtml("&")).toBe("&amp;");
    });
  });

  describe("Mock API", () => {
    it("getCourses and getCoaches return promises resolving to arrays", async () => {
      const courses = await flexformApi.getCourses();
      const coaches = await flexformApi.getCoaches();
      expect(Array.isArray(courses)).toBe(true);
      expect(courses.length).toBeGreaterThan(0);
      expect(Array.isArray(coaches)).toBe(true);
      expect(coaches.length).toBeGreaterThan(0);
    });
  });
});