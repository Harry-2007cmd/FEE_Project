// index.js — behavior scoped only to index.html (hero stat counters,
// hero image slider, contact form validation).

document.addEventListener('DOMContentLoaded', () => {
  // Animated hero stat counters
  function runCounters() {
    const counters = document.querySelectorAll('.counter');
    counters.forEach((counter) => {
      const target = Number(counter.dataset.target || 0);
      let current = 0;
      const step = target / 60;
      const isPercent = target === 95;
      const update = () => {
        current += step;
        if (current < target) {
          counter.textContent = Math.round(current);
          requestAnimationFrame(() => setTimeout(update, 18));
        } else {
          counter.textContent = target + (isPercent ? '%' : '');
        }
      };
      update();
    });
  }
  runCounters();

  // Hero image slider
  const slides = document.querySelectorAll('.slide');
  const slideDots = document.querySelectorAll('.slider-dots .dot');
  let slideIndex = 0;

  function showSlide(index) {
    slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
    slideDots.forEach((dot, i) => dot.classList.toggle('active', i === index));
  }

  slideDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      slideIndex = index;
      showSlide(slideIndex);
    });
  });

  if (slides.length > 1) {
    setInterval(() => {
      slideIndex = (slideIndex + 1) % slides.length;
      showSlide(slideIndex);
    }, 3500);
  }

  // Contact form (mock — no backend, just validates and confirms)
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !message) {
        showToast('Please fill in all contact form fields.');
        return;
      }

      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!emailOk) {
        showToast('Please enter a valid email address.');
        return;
      }

      showToast('Your message has been sent successfully!');
      contactForm.reset();
    });
  }
});
