/* screenshot.js — render each route with headless Chrome and dump the DOM + screenshot.
 * Usage: node screenshot.js [width] [height]
 * Requires Chrome/Edge installed; connects to the running Vite dev server on :5190.
 */
const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const BASE = process.env.BASE || "http://localhost:5190";
const OUT = path.join(__dirname, "shots");
const W = parseInt(process.argv[2] || "1440", 10);
const H = parseInt(process.argv[3] || "900", 10);

const CHROME = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
].find((p) => fs.existsSync(p));

if (!CHROME) { console.error("No Chrome/Edge found"); process.exit(2); }

const routes = [
  "/load",
  "/",
  "/trainers",
  "/courses",
  "/course?id=start-strong",
  "/lesson?course=start-strong&n=1",
  "/coach?id=maria-chen",
  "/tools",
  "/pricing",
  "/planner",
  "/profile",
  "/login",
  "/signup",
  "/nope/here",
];

if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

const escape = (s) => s.replace(/"/g, '\\"');

for (const route of routes) {
  const url = route.startsWith("http") ? route : `${BASE}${route}`;
  const safe = route.replace(/[?=&]/g, "_").replace(/^\//, "") || "root";
  const png = path.join(OUT, `${safe}.png`);
  const dom = path.join(OUT, `${safe}.dom.html`);

  const args = [
    "--headless=new",
    "--no-sandbox",
    `--window-size=${W},${H}`,
    "--disable-gpu",
    "--virtual-time-budget=4000",
    `--screenshot=${png}`,
    url,
  ];

  const r = spawnSync(CHROME, args, { encoding: "utf8", timeout: 30000 });
  const ok = r.status === 0;
  let bodyLen = 0;
  if (ok) {
    try { bodyLen = fs.statSync(png).size; } catch {}
  }
  console.log(`${ok ? "OK " : "FAIL"} ${route.padEnd(32)} ${bodyLen} bytes`);
}