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
  'auth.css': 'login',
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
  '.toggle-password', '.password-field', '.field', '.field-error', '.form-error',
  '.auth-wrap', '.auth-form', '.auth-switch', '.demo-hint', '.check-row',
  '.strength', '.strength-bars', '.strength-label', '.password-rules',
  '.verify-actions', '.code-input', '.demo-inbox', '.demo-inbox-list', '.demo-inbox-note',
  // Elements that appear in multiple pages but should remain global
  '.avatar', '.avatar.coral', '.avatar.lilac', '.avatar.mint', '.avatar.sun',
  '.rhythm-pill', '.dot-orbit', '.steps', '.days', '.upcoming', '.history-pill',
  '.plan-list', '.planner-card', '.planner-grid', '.week-bar', '.week-label',
  '.week-nav', '.week-summary', '.add-form', '.add-hint', '.day-tabs',
  '.enrol-button', '.trainer-preview', '.trainer-badge', '.trainer-preview-grid',
  '.guest-hero', '.guest-feature', '.guest-feature-grid', '.guest-content-block',
  '.guest-block-head', '.faq-list', '.focus-card', '.rhythm-card', '.schedule-card',
  '.schedule-list', '.schedule-item', '.schedule-time', '.stats-row', '.stat-icon',
  '.chart-card', '.challenge-card', '.challenge-overlay', '.play', '.light-button',
  '.profile-head', '.intention', '.profile-stats', '.mini-stats', '.progress-copy',
  '.track-card', '.feature-list', '.user-meta', '.insight-card', '.week-chart',
  '.weight-chart', '.weight-form', '.weight-list', '.weight-remove', '.history-list',
  '.history-item', '.history-badge', '.history-meta', '.upcoming-heading',
  '.course-grid', '.course-card', '.course-meta', '.course-actions', '.free-class',
  '.enrol-card', '.detail-hero', '.detail-main', '.detail-side', '.detail-grid',
  '.detail-avatar', '.detail-chips', '.detail-trainer', '.detail-trainers',
  '.syllabus', '.syllabus-locked', '.syllabus-title', '.learn-list', '.good-list',
  '.price', '.review', '.review-head', '.review-list', '.sample-note', '.stars',
  '.back-link', '.lesson-mark', '.timeline', '.side-cta',
  '.tool-card', '.tool-card h2', '.inputs input', '.interval-field', '.inputs',
  '.extra-tools', '.extra-card', '.extra-inputs', '.recommendation-form',
  '.recommendation-card', '.goal-card', '.goal-note', '.goal-buttons',
  '.timer-card', '.timer-face', '.timer-actions', '.timer-reset', '.timer-error',
  '.filter', '.filter-box', '.filter.active', '.trainer-card', '.trainer-grid',
  '.card-top', '.rating', '.book-button', '.save', '.profile-link', '.match-dialog',
  '.match-banner', '.match-actions', '.match-sub', '.pagination', '.page-button',
  '.tags', '.chat-body', '.chat-head', '.chat-prompts', '.chat-prompt',
  '.plan-card', '.plan-price', '.plan-features', '.plan-badge', '.plan-tagline',
  '.plan-button', '.featured', '.current',
]);

function scopeSelector(sel, page) {
  const parts = sel.split(',');
  const scoped = parts.map(p => {
    const trimmed = p.trim();
    if (!trimmed) return p;
    if (GLOBAL_SELECTORS.has(trimmed)) return trimmed;
    // Check first simple selector part
    const firstPart = trimmed.split(/[.>+~ :#\[]/)[0] || trimmed;
    if (GLOBAL_SELECTORS.has(firstPart)) return trimmed;
    // Scope it
    return `body[data-page="${page}"] ${trimmed}`;
  });
  return scoped.join(', ');
}

function processFile(file) {
  const page = pageFor[file];
  if (!page) return;
  const dir = 'src/styles';
  const src = fs.readFileSync(path.join(dir, file), 'utf8');

  const rules = src.split('}');
  const out = [];

  for (const rule of rules) {
    if (!rule.trim()) continue;
    const idx = rule.indexOf('{');
    if (idx === -1) {
      out.push(rule);
      continue;
    }
    const selector = rule.slice(0, idx);
    const body = rule.slice(idx);

    if (selector.trim().startsWith('@')) {
      out.push(selector + body);
      continue;
    }

    const scoped = scopeSelector(selector, page);
    out.push(scoped + body);
  }

  fs.writeFileSync(path.join(dir, file), out.join('}\n'));
  console.log('Scoped', file, '->', page);
}

for (const f of Object.keys(pageFor)) {
  processFile(f);
}
console.log('Done');