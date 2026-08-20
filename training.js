// training.js — program filter, schedule filter, trainer booking
// (features-training.html only)
//
// NOTE: filter buttons are scoped by their specific data attribute
// (data-filter vs data-schedule-filter), not the shared .filter-btn
// class, since both filter groups share that class on this page.

document.addEventListener('DOMContentLoaded', () => {
  const programFilterButtons = document.querySelectorAll('[data-filter]');
  const programCards = document.querySelectorAll('.program-card');

  function handleProgramFilter(event) {
    const filter = event.currentTarget.dataset.filter;
    programFilterButtons.forEach((button) => button.classList.toggle('active', button === event.currentTarget));

    programCards.forEach((card) => {
      const matches = filter === 'all' || card.dataset.category === filter;
      card.style.display = matches ? 'flex' : 'none';
    });
  }

  programFilterButtons.forEach((button) => button.addEventListener('click', handleProgramFilter));

  const scheduleFilterButtons = document.querySelectorAll('[data-schedule-filter]');
  const classCards = document.querySelectorAll('.schedule-card');

  function handleScheduleFilter(event) {
    const filter = event.currentTarget.dataset.scheduleFilter;
    scheduleFilterButtons.forEach((button) => button.classList.toggle('active', button === event.currentTarget));

    classCards.forEach((card) => {
      const matches = filter === 'all' || card.dataset.day === filter;
      card.style.display = matches ? 'block' : 'none';
    });
  }

  scheduleFilterButtons.forEach((button) => button.addEventListener('click', handleScheduleFilter));

  document.querySelectorAll('.book-trainer').forEach((button) => {
    button.addEventListener('click', () => {
      const trainerName = button.dataset.trainer || 'a trainer';
      showToast(`Booking request sent to ${trainerName}.`);
    });
  });
});
