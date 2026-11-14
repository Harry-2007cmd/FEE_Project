const fs = require('fs');
const path = require('path');

// Map each page CSS file to its data-page value
const pageFor = {
  'home.css': 'home',
  'profile.css': 'profile',
  'planner.css': 'planner',
  'tools.css': 'tools',
  'courses.css': 'courses',
  'course-detail.css': 'course',
  'lesson.css': 'lesson',
  'coach.css': 'coach',
  'pricing.css': 'pricing',
  'trainers.css': 'trainers',
  'auth.css': 'login',   // auth pages use data-page="login"/"signup" but share auth.css
};

// Global rules that must NOT be scoped (defined in styles.css or shared)
const GLOBAL_SELECTORS = new Set([
  ':root', 'html', 'body', '*', 'a', 'button', 'input', 'select', 'textarea',
  'img', 'svg', 'i', 'b', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'small', 'strong',
  'em', 'ul', 'ol', 'li', 'form', 'label', 'main', 'header', 'footer', 'nav',
  'section', 'article', 'div', 'details', 'summary', 'time', 'blockquote',
  '.hidden', '.sr-only', '.active', '.selected', '.met',
  '.app', '#app', '#root', '#toast',
]);

function scopeSelector(sel, page) {
  // Skip pseudo-elements and pseudo-classes
  const parts = sel.split(/(?=[.:])/);
  const out = [];
  for (const p of parts) {
    if (GLOBAL_SELECTORS.has(p)) {
      out.push(p);
    } else if (p.startsWith('.') || p.startsWith('#')) {
      out.push(`body[data-page="${page}"] ${p}`);
    } else {
      out.push(p);
    }
  }
  return out.join('');
}

function processFile(file) {
  const page = pageFor[file];
  if (!page) return;
  const dir = 'src/styles';
  const src = fs.readFileSync(path.join(dir, file), 'utf8');
  const lines = src.split('\n');
  const out = [];
  for (let line of lines) {
    // Skip comments
    if (line.trim().startsWith('//') || line.trim().startsWith('/*')) {
      out.push(line);
      continue;
    }
    // Match a selector line (starts with . or # or element, before {)
    const m = line.match(/^(\s*)((?:[.#][\w-]+|\*|[\w]+)(?:\s*,\s*(?:[.#][\w-]+|\*|[\w]+))*)\s*\{/);
    if (m) {
      const indent = m[1];
      const selectors = m[2].split(',').map(s => s.trim());
      const scoped = selectors.map(s => scopeSelector(s, page)).join(', ');
      out.push(indent + scoped + ' {');
      // Keep the rest of the line after {
      const after = line.slice(m[0].length);
      if (after) out[out.length - 1] += after;
    } else {
      out.push(line);
    }
  }
  fs.writeFileSync(path.join(dir, file), out.join('\n'));
  console.log('Scoped', file);
}

for (const f of Object.keys(pageFor)) {
  processFile(f);
}
console.log('Done');