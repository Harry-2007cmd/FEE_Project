/* Pricing page. Plans come from pricing-data.js (mock). The chosen plan is saved per user in localStorage. */
const planKey = () => window.flexform.userKey("plan");
const getPlan = () => {
  try {
    const id = localStorage.getItem(planKey());
    return plans.some((plan) => plan.id === id) ? id : "free";
  } catch {
    return "free";
  }
};
const savePlan = (id) => {
  try {
    localStorage.setItem(planKey(), id);
  } catch {
    /* storage unavailable: choice just won't persist */
  }
};

const notify = (message) => {
  const toast = document.querySelector("#toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2600);
};

const planCardHtml = (plan, currentId) => {
  const current = plan.id === currentId;
  return `<article class="plan-card${plan.featured ? " featured" : ""}${current ? " current" : ""}" aria-labelledby="plan-${plan.id}">
      ${plan.featured ? '<span class="plan-badge">Most popular</span>' : ""}
      <h2 id="plan-${plan.id}">${plan.name}</h2>
      <p class="plan-tagline">${plan.tagline}</p>
      <p class="plan-price"><b>${plan.price ? `$${plan.price}` : "$0"}</b><span>${plan.price ? "/ month" : "forever"}</span></p>
      <ul class="plan-features">${plan.features.map((feature) => `<li>${feature}</li>`).join("")}</ul>
      <button type="button" class="plan-button" data-plan="${plan.id}"${current ? " disabled" : ""}>${current ? "✓ Your plan" : `Choose ${plan.name}`}</button>
    </article>`;
};

window.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#app").classList.remove("hidden");
  const list = document.querySelector("#planList");
  const draw = () => {
    list.innerHTML = plans.map((plan) => planCardHtml(plan, getPlan())).join("");
  };
  draw();

  list.addEventListener("click", (event) => {
    const button = event.target.closest("[data-plan]");
    if (!button || button.disabled) return;
    const plan = plans.find((item) => item.id === button.dataset.plan);
    savePlan(plan.id);
    draw();
    list.querySelector(`[data-plan="${plan.id}"]`)?.focus();
    notify(`You’re on the ${plan.name} plan. (Demo — no payment taken.)`);
  });
});
