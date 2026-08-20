// free-class.js — free class reservation form logic (free-class.html only)

document.addEventListener('DOMContentLoaded', () => {
  const freeClassForm = document.getElementById('free-class-form');

  if (freeClassForm) {
    freeClassForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const name = document.getElementById('fc-name').value.trim();
      const email = document.getElementById('fc-email').value.trim();
      const phone = document.getElementById('fc-phone').value.trim();
      const goal = document.getElementById('fc-goal').value;

      if (!name || !email || !phone || !goal) {
        showToast('Please fill in all fields to reserve your spot.');
        return;
      }

      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!emailOk) {
        showToast('Please enter a valid email address.');
        return;
      }

      const bookings = storage.get('free-class-bookings', []);
      bookings.push({ name, email, phone, goal, requestedAt: new Date().toISOString() });
      storage.set('free-class-bookings', bookings);

      showToast(`You're in, ${name}! We'll email you the class details shortly.`);
      freeClassForm.reset();
    });
  }
});
