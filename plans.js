// plans.js — plan selection modal, testimonial carousel, FAQ accordion
// (features-plans.html only)

document.addEventListener('DOMContentLoaded', () => {
  // Plan selection modal
  const planDetails = {
    Basic: {
      title: 'Basic Plan',
      body: 'Best for building a consistent habit. Includes gym floor access, one weekly class, and locker room access.',
    },
    Premium: {
      title: 'Premium Plan',
      body: 'Perfect for goal-focused members. Includes unlimited classes, one personal training session, and nutrition support.',
    },
    VIP: {
      title: 'VIP Plan',
      body: 'For members who want full support and accelerated results. Includes advanced coaching, recovery access, and priority scheduling.',
    },
  };

  const modal = document.getElementById('plan-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  const modalClose = document.querySelector('.modal-close');

  function openPlanModal(plan) {
    const info = planDetails[plan];
    if (!info) return;
    modalTitle.textContent = info.title;
    modalBody.textContent = info.body;
    modal.classList.add('visible');
    modal.setAttribute('aria-hidden', 'false');
  }

  function closePlanModal() {
    modal.classList.remove('visible');
    modal.setAttribute('aria-hidden', 'true');
  }

  document.querySelectorAll('.choose-plan').forEach((button) => {
    button.addEventListener('click', () => {
      const plan = button.dataset.plan;
      storage.set('selected-membership', plan);
      showToast(`${plan} plan selected`);
      openPlanModal(plan);
    });
  });

  if (modalClose) modalClose.addEventListener('click', closePlanModal);
  if (modal) {
    modal.addEventListener('click', (event) => {
      if (event.target === modal) closePlanModal();
    });
  }

  // Testimonial carousel
  const testimonialItems = document.querySelectorAll('.testimonial');
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
