// auth-forms.js — inline field validation + mock login/signup submission.
// Only ever one of these forms exists on a given page, so both are safe
// to check for.

function setFieldError(inputId, message) {
  const input = document.getElementById(inputId);
  const errorEl = document.querySelector(`[data-error-for="${inputId}"]`);
  if (!input || !errorEl) return;

  if (message) {
    input.classList.add('invalid');
    errorEl.textContent = message;
    errorEl.classList.remove('hidden');
  } else {
    input.classList.remove('invalid');
    errorEl.textContent = '';
    errorEl.classList.add('hidden');
  }
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');

  if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value.trim();

      let valid = true;

      if (!email) {
        setFieldError('login-email', 'Email is required.');
        valid = false;
      } else if (!isValidEmail(email)) {
        setFieldError('login-email', 'Enter a valid email address.');
        valid = false;
      } else {
        setFieldError('login-email', '');
      }

      if (!password) {
        setFieldError('login-password', 'Password is required.');
        valid = false;
      } else {
        setFieldError('login-password', '');
      }

      if (!valid) return;

      const existingUser = getMockUser();
      setMockUser({
        name: existingUser?.name || 'Member',
        email,
        joinedAt: existingUser?.joinedAt || new Date().toISOString(),
      });

      showToast('Login successful!');
      updateAuthUI();
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 900);
    });
  }

  if (signupForm) {
    signupForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const name = document.getElementById('signup-name').value.trim();
      const email = document.getElementById('signup-email').value.trim();
      const password = document.getElementById('signup-password').value.trim();

      let valid = true;

      if (!name) {
        setFieldError('signup-name', 'Full name is required.');
        valid = false;
      } else {
        setFieldError('signup-name', '');
      }

      if (!email) {
        setFieldError('signup-email', 'Email is required.');
        valid = false;
      } else if (!isValidEmail(email)) {
        setFieldError('signup-email', 'Enter a valid email address.');
        valid = false;
      } else {
        setFieldError('signup-email', '');
      }

      if (!password) {
        setFieldError('signup-password', 'Password is required.');
        valid = false;
      } else if (password.length < 6) {
        setFieldError('signup-password', 'Use at least 6 characters.');
        valid = false;
      } else {
        setFieldError('signup-password', '');
      }

      if (!valid) return;

      setMockUser({
        name,
        email,
        joinedAt: new Date().toISOString(),
      });

      showToast('Signup successful!');
      updateAuthUI();
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 900);
    });
  }
});
