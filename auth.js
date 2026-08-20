// auth.js — mock authentication only. There is no backend: this simply
// persists a fake "user" in localStorage so the UI can react to a
// logged-in / logged-out state across pages.

const storage = {
  get: (key, fallback) => {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  },
  set: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
};

function showToast(message) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2200);
}

function getMockUser() {
  return storage.get('gym-user', null);
}

function setMockUser(user) {
  storage.set('gym-user', user);
}

function logoutMockUser() {
  storage.set('gym-user', null);
}

// Updates the navbar (login/signup buttons vs. logout + badge) on every page.
function updateAuthUI() {
  const user = getMockUser();
  const isLoggedIn = Boolean(user && user.email);

  document.querySelectorAll('[data-auth-action="login"], [data-auth-action="signup"]').forEach((el) => {
    el.classList.toggle('hidden', isLoggedIn);
  });

  document.querySelectorAll('[data-auth-action="logout"]').forEach((el) => {
    el.classList.toggle('hidden', !isLoggedIn);
  });

  const badge = document.getElementById('auth-user-badge');
  if (badge) {
    if (isLoggedIn) {
      badge.textContent = `Hi, ${user.name || 'Member'}`;
      badge.classList.remove('hidden');
    } else {
      badge.textContent = '';
      badge.classList.add('hidden');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateAuthUI();

  document.querySelectorAll('[data-auth-action="logout"]').forEach((btn) => {
    btn.addEventListener('click', () => {
      logoutMockUser();
      updateAuthUI();
      showToast('You have been logged out.');
    });
  });
});
