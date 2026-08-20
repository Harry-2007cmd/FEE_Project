const body = document.body;
const nav = document.querySelector('.nav');
const navToggle = document.querySelector('.nav-toggle');
const globalSearch = document.getElementById('global-search');
const filterButtons = document.querySelectorAll('.filter-btn');
const scheduleFilterButtons = document.querySelectorAll('[data-schedule-filter]');
const programCards = document.querySelectorAll('.program-card');
const classCards = document.querySelectorAll('.schedule-card');
const planButtons = document.querySelectorAll('.choose-plan');
const modal = document.getElementById('plan-modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const modalClose = document.querySelector('.modal-close');
const scrollTopBtn = document.querySelector('.scroll-top');
const authButtons = document.querySelectorAll('.auth-btn');
const logoutBtn = document.getElementById('logout-btn');
const authUserBadge = document.getElementById('auth-user-badge');
const authModal = document.getElementById('auth-modal');
const authModalTitle = document.getElementById('auth-modal-title');
const authForm = document.getElementById('auth-form');
const authSubmitBtn = document.getElementById('auth-submit-btn');
const authNameField = document.getElementById('auth-name-field');
const authNameInput = document.getElementById('auth-name');
const authEmailInput = document.getElementById('auth-email');
const authPasswordInput = document.getElementById('auth-password');
const authCloseBtn = document.querySelector('.auth-close');
const bmiForm = document.getElementById('bmi-form');
const calorieForm = document.getElementById('calorie-form');
const registrationForm = document.getElementById('registration-form');
const contactForm = document.getElementById('contact-form');
const selectedMembership = document.getElementById('selected-membership');
const membershipSelect = document.getElementById('membership-select');
const faqItems = document.querySelectorAll('.faq-item');
const testimonialItems = document.querySelectorAll('.testimonial');
const testimonialDots = document.querySelectorAll('.testimonial-dot');
const slides = document.querySelectorAll('.slide');
const slideDots = document.querySelectorAll('.dot');

const storage = {
  get: (key, fallback) => {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  },
  set: (key, value) => localStorage.setItem(key, JSON.stringify(value)),
};

function updateAuthUI() {
  const user = storage.get('gym-user', null);
  const isLoggedIn = Boolean(user && user.email);

  authButtons.forEach((button) => {
    const action = button.dataset.authAction;
    const shouldHide = isLoggedIn && (action === 'login' || action === 'signup');
    button.classList.toggle('hidden', shouldHide);
  });

  if (logoutBtn) logoutBtn.classList.toggle('hidden', !isLoggedIn);
  if (authUserBadge) {
    if (isLoggedIn) {
      authUserBadge.textContent = `Hi, ${user.name || 'Member'}`;
      authUserBadge.classList.remove('hidden');
    } else {
      authUserBadge.textContent = '';
      authUserBadge.classList.add('hidden');
    }
  }
}

function openAuthModal(mode) {
  const isSignup = mode === 'signup';
  authModalTitle.textContent = isSignup ? 'Signup' : 'Login';
  authSubmitBtn.textContent = isSignup ? 'Create Account' : 'Login';
  authNameField.classList.toggle('hidden', !isSignup);
  authNameInput.required = isSignup;
  authModal.classList.add('visible');
  authModal.setAttribute('aria-hidden', 'false');
}

function closeAuthModal() {
  authModal.classList.remove('visible');
  authModal.setAttribute('aria-hidden', 'true');
  authForm.reset();
}

const showToast = (message) => {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  Object.assign(toast.style, {
    position: 'fixed',
    right: '20px',
    bottom: '80px',
    background: '#111827',
    color: '#fff',
    padding: '12px 16px',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
    zIndex: 100,
    fontWeight: 600,
  });
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2200);
};

authButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const action = button.dataset.authAction;
    if (action === 'logout') {
      storage.set('gym-user', null);
      updateAuthUI();
      showToast('You have been logged out.');
      return;
    }
    openAuthModal(action);
  });
});

if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    storage.set('gym-user', null);
    updateAuthUI();
    showToast('You have been logged out.');
  });
}

if (authCloseBtn) {
  authCloseBtn.addEventListener('click', closeAuthModal);
}

authModal.addEventListener('click', (event) => {
  if (event.target === authModal) closeAuthModal();
});

authForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const isSignup = authModalTitle.textContent === 'Signup';
  const name = authNameInput.value.trim();
  const email = authEmailInput.value.trim();
  const password = authPasswordInput.value.trim();

  if (!email || !password) {
    showToast('Please enter your email and password.');
    return;
  }

  if (isSignup && !name) {
    showToast('Please enter your full name to sign up.');
    return;
  }

  const user = {
    name: isSignup ? name : (storage.get('gym-user', null)?.name || 'Member'),
    email,
    password,
    joinedAt: new Date().toISOString()
  };

  storage.set('gym-user', user);
  updateAuthUI();
  closeAuthModal();
  showToast(isSignup ? 'Signup successful!' : 'Login successful!');
});

updateAuthUI();

if (navToggle) {
  navToggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', nav.classList.contains('open'));
  });
}

const closeMenu = () => {
  nav.classList.remove('open');
  navToggle?.setAttribute('aria-expanded', 'false');
};

document.querySelectorAll('.nav-links a').forEach((link) => {
  link.addEventListener('click', closeMenu);
});

function runCounter() {
  const counters = document.querySelectorAll('.counter');
  counters.forEach((counter) => {
    const target = Number(counter.dataset.target || 0);
    let current = 0;
    const step = target / 60;
    const update = () => {
      current += step;
      if (current < target) {
        counter.textContent = `${Math.round(current)}${target >= 100 ? '' : ''}`;
        setTimeout(update, 18);
      } else {
        counter.textContent = target + (target === 95 ? '%' : '');
      }
    };
    update();
  });
}

runCounter();

function handleProgramFilter(event) {
  const filter = event.currentTarget.dataset.filter;
  filterButtons.forEach((button) => button.classList.toggle('active', button === event.currentTarget));

  programCards.forEach((card) => {
    const matches = filter === 'all' || card.dataset.category === filter;
    card.style.display = matches ? 'flex' : 'none';
  });
}

filterButtons.forEach((button) => button.addEventListener('click', handleProgramFilter));

function handleScheduleFilter(event) {
  const filter = event.currentTarget.dataset.scheduleFilter;
  scheduleFilterButtons.forEach((button) => button.classList.toggle('active', button === event.currentTarget));

  classCards.forEach((card) => {
    const matches = filter === 'all' || card.dataset.day === filter;
    card.style.display = matches ? 'block' : 'none';
  });
}

scheduleFilterButtons.forEach((button) => button.addEventListener('click', handleScheduleFilter));

function togglePlanModal(plan) {
  const details = {
    Basic: {
      title: 'Basic Plan',
      body: 'Best for building a consistent habit. Includes gym floor access, one weekly class, and locker room access.'
    },
    Premium: {
      title: 'Premium Plan',
      body: 'Perfect for goal-focused members. Includes unlimited classes, one personal training session, and nutrition support.'
    },
    VIP: {
      title: 'VIP Plan',
      body: 'For members who want full support and accelerated results. Includes advanced coaching, recovery access, and priority scheduling.'
    }
  };

  const info = details[plan];
  modalTitle.textContent = info.title;
  modalBody.textContent = info.body;
  modal.classList.add('visible');
  modal.setAttribute('aria-hidden', 'false');
}

planButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const plan = button.dataset.plan;
    const savedPlan = storage.get('selected-membership', plan);
    storage.set('selected-membership', plan);
    if (selectedMembership) selectedMembership.textContent = plan;
    if (membershipSelect) membershipSelect.value = plan;
    showToast(`${plan} plan selected`);
    togglePlanModal(plan);
    if (selectedMembership && !savedPlan) selectedMembership.textContent = plan;
  });
});

if (modalClose) {
  modalClose.addEventListener('click', () => {
    modal.classList.remove('visible');
    modal.setAttribute('aria-hidden', 'true');
  });
}

modal.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.classList.remove('visible');
  }
});

window.addEventListener('scroll', () => {
  scrollTopBtn.classList.toggle('visible', window.scrollY > 300);
});

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

function calculateBMI(heightCm, weightKg) {
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
}

function getBMICategory(bmi) {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}

bmiForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const height = Number(document.getElementById('height').value);
  const weight = Number(document.getElementById('weight').value);
  const result = document.getElementById('bmi-result');
  const category = document.getElementById('bmi-category');

  if (!height || !weight || height <= 0 || weight <= 0) {
    showToast('Please enter valid height and weight values.');
    return;
  }

  const bmi = calculateBMI(height, weight);
  result.textContent = bmi.toFixed(1);
  category.textContent = `Category: ${getBMICategory(bmi)}`;
  showToast(`BMI ${bmi.toFixed(1)} calculated`);
});

function calculateCalories(age, gender, height, weight, activityFactor) {
  const base = gender === 'male'
    ? 10 * weight + 6.25 * height - 5 * age + 5
    : 10 * weight + 6.25 * height - 5 * age - 161;
  return Math.round(base * activityFactor);
}

calorieForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const age = Number(document.getElementById('age').value);
  const gender = document.getElementById('gender').value;
  const height = Number(document.getElementById('calorie-height').value);
  const weight = Number(document.getElementById('calorie-weight').value);
  const activityLevel = Number(document.getElementById('activity-level').value);
  const result = document.getElementById('calorie-result');
  const summary = document.getElementById('calorie-summary');

  if (!age || !height || !weight) {
    showToast('Please complete all calorie calculator fields.');
    return;
  }

  const calories = calculateCalories(age, gender, height, weight, activityLevel);
  result.textContent = `${calories} kcal`;
  summary.textContent = `Estimated daily intake for maintenance: ${calories} kcal.`;
  showToast('Calories estimated successfully');
});

const defaultPlan = storage.get('selected-membership', 'Premium');
if (selectedMembership) selectedMembership.textContent = defaultPlan;
if (membershipSelect) membershipSelect.value = defaultPlan;

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
  selectedMembership.textContent = membership;
  if (membershipSelect) membershipSelect.value = membership;
  showToast(`Welcome ${name}! You registered for ${membership}.`);
  registrationForm.reset();
});

contactForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = document.getElementById('contact-name').value.trim();
  const email = document.getElementById('contact-email').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name || !email || !message) {
    showToast('Please fill in all contact form fields.');
    return;
  }

  showToast('Your message has been sent successfully!');
  contactForm.reset();
});

faqItems.forEach((item) => {
  const button = item.querySelector('.faq-question');
  button.addEventListener('click', () => {
    item.classList.toggle('active');
  });
});

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

setInterval(() => {
  testimonialIndex = (testimonialIndex + 1) % testimonialItems.length;
  showTestimonial(testimonialIndex);
}, 4000);

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

setInterval(() => {
  slideIndex = (slideIndex + 1) % slides.length;
  showSlide(slideIndex);
}, 3500);

globalSearch.addEventListener('input', (event) => {
  const query = event.target.value.trim().toLowerCase();

  const searchableCards = [...document.querySelectorAll('.program-card, .trainer-card, .service-card')];
  searchableCards.forEach((card) => {
    const content = card.textContent.toLowerCase();
    const matches = !query || content.includes(query);
    card.style.display = matches ? '' : 'none';
  });
});

const exerciseList = document.getElementById('exercise-list');
const exerciseForm = document.getElementById('exercise-form');
const exerciseStorageKey = 'gym-workout-tracker';

function updateExerciseTable() {
  const exercises = storage.get(exerciseStorageKey, [
    { name: 'Bench Press', sets: 4, reps: 8, weight: 60, done: true },
    { name: 'Squat', sets: 5, reps: 6, weight: 90, done: false }
  ]);

  exerciseList.innerHTML = exercises
    .map(
      (exercise, index) => `
        <tr>
          <td>${exercise.name}</td>
          <td>${exercise.sets}</td>
          <td>${exercise.reps}</td>
          <td>${exercise.weight} kg</td>
          <td><input type="checkbox" data-index="${index}" ${exercise.done ? 'checked' : ''} /></td>
        </tr>
      `
    )
    .join('');

  exerciseList.querySelectorAll('input[type="checkbox"]').forEach((box) => {
    box.addEventListener('change', (event) => {
      const index = Number(event.target.dataset.index);
      const exercises = storage.get(exerciseStorageKey, []);
      exercises[index].done = event.target.checked;
      storage.set(exerciseStorageKey, exercises);
    });
  });
}

exerciseForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = document.getElementById('exercise-name').value.trim();
  const sets = Number(document.getElementById('exercise-sets').value);
  const reps = Number(document.getElementById('exercise-reps').value);
  const weight = Number(document.getElementById('exercise-weight').value);

  if (!name || !sets || !reps || !weight) {
    showToast('Please add complete exercise details.');
    return;
  }

  const exercises = storage.get(exerciseStorageKey, []);
  exercises.push({ name, sets, reps, weight, done: false });
  storage.set(exerciseStorageKey, exercises);
  exerciseForm.reset();
  updateExerciseTable();
  showToast('Workout saved');
});

updateExerciseTable();

const waterKey = 'gym-water-progress';
const waterGoal = 8;
const waterCount = document.getElementById('water-count');
const waterProgress = document.getElementById('water-progress');

function updateWaterProgress() {
  const current = Number(storage.get(waterKey, 0));
  waterCount.textContent = current;
  const percent = Math.min((current / waterGoal) * 100, 100);
  waterProgress.style.width = `${percent}%`;
}

document.getElementById('add-water').addEventListener('click', () => {
  const current = Number(storage.get(waterKey, 0));
  const next = Math.min(current + 1, waterGoal);
  storage.set(waterKey, next);
  updateWaterProgress();
  showToast('Water added');
});

document.getElementById('reset-water').addEventListener('click', () => {
  storage.set(waterKey, 0);
  updateWaterProgress();
  showToast('Water tracker reset');
});

updateWaterProgress();

const timerDisplay = document.getElementById('timer-display');
let timerDuration = 20 * 60;
let timerId = null;
let timerRunning = false;

function renderTimer() {
  const minutes = String(Math.floor(timerDuration / 60)).padStart(2, '0');
  const seconds = String(timerDuration % 60).padStart(2, '0');
  timerDisplay.textContent = `${minutes}:${seconds}`;
}

function stopTimer() {
  if (timerId) clearInterval(timerId);
  timerRunning = false;
  timerId = null;
}



document.getElementById('start-timer').addEventListener('click', () => {
  if (timerRunning) return;
  timerRunning = true;
  timerId = setInterval(() => {
    if (timerDuration > 0) {
      timerDuration -= 1;
      renderTimer();
    } else {
      stopTimer();
      showToast('Workout timer complete!');
    }
  }, 1000);
});

document.getElementById('pause-timer').addEventListener('click', () => {
  stopTimer();
});

document.getElementById('reset-timer').addEventListener('click', () => {
  stopTimer();
  timerDuration = 20 * 60;
  renderTimer();
});

renderTimer();

const progressChartCanvas = document.getElementById('progress-chart');
const ctx = progressChartCanvas.getContext('2d');
const chartKey = 'gym-progress-chart';

function drawChart() {
  const data = storage.get(chartKey, [72, 71, 69, 68, 67, 65]);
  const width = progressChartCanvas.width;
  const height = progressChartCanvas.height;
  const max = Math.max(...data) + 5;
  const min = Math.min(...data) - 5;

  ctx.clearRect(0, 0, width, height);
  ctx.strokeStyle = '#dfe6ef';
  ctx.lineWidth = 1;

  for (let i = 0; i <= 4; i++) {
    const y = (height / 4) * i;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  ctx.beginPath();
  data.forEach((point, index) => {
    const x = (index / (data.length - 1)) * (width - 30) + 15;
    const y = height - ((point - min) / (max - min || 1)) * (height - 30) - 15;
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.strokeStyle = '#ff5a36';
  ctx.lineWidth = 3;
  ctx.stroke();

  data.forEach((point, index) => {
    const x = (index / (data.length - 1)) * (width - 30) + 15;
    const y = height - ((point - min) / (max - min || 1)) * (height - 30) - 15;
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#ff5a36';
    ctx.fill();
  });
}

document.getElementById('add-weight').addEventListener('click', () => {
  const input = document.getElementById('new-weight');
  const current = Number(input.value);
  if (!current) {
    showToast('Enter a valid weight value.');
    return;
  }

  const data = storage.get(chartKey, [72, 71, 69, 68, 67, 65]);
  data.push(current);
  storage.set(chartKey, data);
  drawChart();
  input.value = '';
  showToast('Progress updated');
});

drawChart();

const savedMembership = storage.get('selected-membership', 'Premium');
if (membershipSelect) membershipSelect.value = savedMembership;
if (selectedMembership) selectedMembership.textContent = savedMembership;
