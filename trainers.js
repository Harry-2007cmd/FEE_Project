// trainers.js — consultation request form, testimonial carousel, FAQ accordion
// (features-trainers.html only)

document.addEventListener('DOMContentLoaded', () => {
  // Consultation request form (mock — no backend, just validates and confirms)
  const consultForm = document.getElementById('consult-form');

  if (consultForm) {
    consultForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const name = document.getElementById('consult-name').value.trim();
      const email = document.getElementById('consult-email').value.trim();
      const phone = document.getElementById('consult-phone').value.trim();
      const goal = document.getElementById('consult-goal').value;

      if (!name || !email || !phone || !goal) {
        showToast('Please fill in all fields so we can match you with a trainer.');
        return;
      }

      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!emailOk) {
        showToast('Please enter a valid email address.');
        return;
      }

      const requests = storage.get('consultation-requests', []);
      requests.push({ name, email, phone, goal, requestedAt: new Date().toISOString() });
      storage.set('consultation-requests', requests);

      showToast(`Thanks ${name}! We'll match you with a trainer within 24 hours.`);
      consultForm.reset();
    });
  }

  // Testimonial carousel
  const testimonialItems = document.querySelectorAll('.testimonial-carousel .testimonial');
  const testimonialDots = document.querySelectorAll('.testimonial-dot');
  let testimonialIndex = 0;

  function showTestimonial(index) {
    testimonialItems.forEach((item, i) => item.classList.toggle('active', i === index));
    testimonialDots.forEach((dot, i) => dot.classList.toggle('active', i === index));
  }

  testimonialDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      testimonialIndex = index;
      showTestimonial(testimonialIndex);
    });
  });

  if (testimonialItems.length > 1) {
    setInterval(() => {
      testimonialIndex = (testimonialIndex + 1) % testimonialItems.length;
      showTestimonial(testimonialIndex);
    }, 4000);
  }

  // FAQ accordion
  document.querySelectorAll('.faq-item').forEach((item) => {
    const button = item.querySelector('.faq-question');
    button.addEventListener('click', () => {
      item.classList.toggle('active');
    });
  });
});
