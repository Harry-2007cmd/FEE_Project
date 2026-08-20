// register.js — registration form logic (register.html only).
// Prefills the membership dropdown if a plan was previously chosen
// on features-plans.html.

document.addEventListener('DOMContentLoaded', () => {
  const registrationForm = document.getElementById('registration-form');
  const membershipSelect = document.getElementById('membership-select');

  const savedMembership = storage.get('selected-membership', '');
  if (membershipSelect && savedMembership) {
    membershipSelect.value = savedMembership;
  }

  if (registrationForm) {
    registrationForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const membership = document.getElementById('membership-select').value;

      if (!name || !email || !phone || !membership) {
        showToast('Please fill in all registration details.');
        return;
      }

      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!emailOk) {
        showToast('Please enter a valid email address.');
        return;
      }

      storage.set('selected-membership', membership);
      showToast(`Welcome ${name}! You registered for ${membership}.`);
      registrationForm.reset();
      membershipSelect.value = '';
    });
  }
});
