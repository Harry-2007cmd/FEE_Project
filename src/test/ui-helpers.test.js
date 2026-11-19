import { describe, it, expect, beforeEach } from "vitest";
import fs from "node:fs";
import path from "node:path";
import "../lib/common.js";
import { flexformAuthUI } from "../lib/auth-ui-utils.js";
import { coachSlug } from "../data/coach-profiles-data.js";
import trainers from "../data/trainers-data.js";
import { pageKeyFor, navSectionFor } from "../lib/nav.js";

describe("per-user storage keys", () => {
  beforeEach(() => localStorage.clear());

  it("uses flexform:<email>:<kind> for a signed-in user", () => {
    localStorage.setItem("flexformUserEmail", "sam@example.com");
    expect(window.flexform.userKey("savedCoaches")).toBe("flexform:sam@example.com:savedCoaches");
  });

  it("falls back to the guest namespace", () => {
    expect(window.flexform.userKey("planner")).toBe("flexform:guest:planner");
  });
});

describe("post-login return page", () => {
  const withReturn = (value) => window.history.replaceState({}, "", `/login?return=${encodeURIComponent(value)}`);

  it.each([
    ["/profile", "/profile"],
    ["/planner", "/planner"],
    ["profile.html", "/profile"],
    ["pricing.html", "/pricing"],
  ])("maps %s to %s", (input, expected) => {
    withReturn(input);
    expect(flexformAuthUI.returnPage()).toBe(expected);
  });

  it("rejects off-site and unknown destinations", () => {
    withReturn("https://evil.example/");
    expect(flexformAuthUI.returnPage()).toBe("/");
    withReturn("//evil.example");
    expect(flexformAuthUI.returnPage()).toBe("/");
  });
});

describe("coach slugs", () => {
  it("strips accents", () => {
    expect(coachSlug("Tomás Silva")).toBe("tomas-silva");
  });

  it("is unique for every trainer", () => {
    const slugs = trainers.map((t) => coachSlug(t.name));
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe("navigation helpers", () => {
  it("derives page keys from the pathname", () => {
    expect(pageKeyFor("/")).toBe("home");
    expect(pageKeyFor("/lesson")).toBe("lesson");
  });

  it("highlights the parent section for detail pages", () => {
    expect(navSectionFor("/course")).toBe("courses");
    expect(navSectionFor("/lesson")).toBe("courses");
    expect(navSectionFor("/coach")).toBe("trainers");
    expect(navSectionFor("/")).toBe("home");
    expect(navSectionFor("/nope")).toBeNull();
  });
});

describe("generated stylesheets", () => {
  const dir = path.resolve(__dirname, "../styles");
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".css"));

  it.each(files)("%s has balanced braces and no comment fused into a selector", (file) => {
    const css = fs.readFileSync(path.join(dir, file), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
    expect(css.split("{").length).toBe(css.split("}").length);
    expect(css).not.toMatch(/\/\*|\*\//);
  });

  it.each(files.filter((f) => !["styles.css", "load.css"].includes(f)))("%s is fully scoped to body[data-page]", (file) => {
    const css = fs.readFileSync(path.join(dir, file), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
    const unscoped = [...css.matchAll(/(^|\})\s*([^@{}\s][^{}]*)\{/g)]
      .map((m) => m[2].trim())
      .filter((sel) => !/^\d+%|^from|^to/.test(sel) && !sel.startsWith("body"));
    expect(unscoped).toEqual([]);
  });
});
