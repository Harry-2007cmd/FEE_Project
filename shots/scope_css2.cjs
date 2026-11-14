const fs = require('fs');
const path = require('path');

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
  'auth.css': 'login',   // shared but used on login/signup
};

const GLOBAL_SELECTORS = new Set([
  ':root', 'html', 'body', '*', 'a', 'button', 'input', 'select', 'textarea',
  'img', 'svg', 'i', 'b', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'small', 'strong',
  'em', 'ul', 'ol', 'li', 'form', 'label', 'main', 'header', 'footer', 'nav',
  'section', 'article', 'div', 'details', 'summary', 'time', 'blockquote',
  '.hidden', '.sr-only', '.active', '.selected', '.met',
  '.app', '#app', '#root', '#toast',
  '.action-button', '.dark-button', '.sun-button', '.light-button', '.outline-button',
  '.link-button', '.icon-button', '.brand', '.brand-mark', '.eyebrow', '.lede',
  '.card-top', '.big-number', '.progress', '.progress-copy', '.page-intro', '.section-heading',
  '.side-label', '.side-nav', '.side-link', '.sidebar', '.mobile-nav', '.topbar',
  '.top-message', '.top-actions', '.notification', '.user-chip', '.logout-button',
  '.footer-block', '.footer-grid', '.footer-link', '.site-footer',
]);

function scopeSelector(sel, page) {
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

  // Parse CSS: find all rule blocks (selector { ... })
  // Use a state machine to handle multi-line selectors
  let inBlock = false;
  let selectorBuf = '';
  const out = [];
  const lines = src.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (inBlock) {
      out.push(line);
      if (line.includes('}')) {
        inBlock = false;
      }
      continue;
    }

    // Check if this line starts a selector (contains { but not })
    const hasOpen = line.includes('{');
    const hasClose = line.includes('}');

    if (hasOpen && !hasClose) {
      // Multi-line selector starts
      selectorBuf = line;
      out.push(line);
      inBlock = true;
    } else if (hasOpen && hasClose) {
      // Single-line rule
      const idx = line.indexOf('{');
      const selector = line.slice(0, idx).trim();
      const rest = line.slice(idx);
      const selectors = selector.split(',').map(s => s.trim()).filter(Boolean);
      const scoped = selectors.map(s => scopeSelector(s, page)).join(', ');
      out.push(scoped + rest);
    } else if (selectorBuf) {
      // Continuation of multi-line selector
      selectorBuf += line;
      out.push(line);
      if (hasClose) {
        // End of selector block - need to rewrite the selector part
        // This is complex; for now just keep as-is and scope at build time
        selectorBuf = '';
        inBlock = false;
      }
    } else {
      out.push(line);
    }
  }

  fs.writeFileSync(path.join(dir, file), out.join('\n'));
  console.log('Processed', file);
}

for (const f of Object.keys(pageFor)) {
  processFile(f);
}
console.log('Done');