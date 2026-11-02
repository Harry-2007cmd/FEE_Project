import { useEffect, useState } from "react";
import "../styles/styles.css";
import "../styles/pricing.css";

export default function Pricing() {
  const [plans, setPlans] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const planKey = () => `flexform:${localStorage.getItem("flexformUserEmail") || "guest"}:plan`;
  const getPlan = () => {
    try {
      const id = localStorage.getItem(planKey());
      return window.plans.some((plan) => plan.id === id) ? id : "free";
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

  useEffect(() => {
    // plans data is loaded globally from pricing-data.js
    setPlans(window.plans);
    setLoaded(true);
  }, []);

  const draw = () => {
    const list = document.querySelector("#planList");
    if (!list) return;
    const currentId = getPlan();
    list.innerHTML = plans
      .map((plan) => {
        const current = plan.id === currentId;
        return `<article class="plan-card${plan.featured ? " featured" : ""}${current ? " current" : ""}" aria-labelledby="plan-${plan.id}">
          ${plan.featured ? '<span class="plan-badge">Most popular</span>' : ""}
          <h2 id="plan-${plan.id}">${plan.name}</h2>
          <p class="plan-tagline">${plan.tagline}</p>
          <p class="plan-price"><b>${plan.price ? `$${plan.price}` : "$0"}</b><span>${plan.price ? "/ month" : "forever"}</span></p>
          <ul class="plan-features">${plan.features.map((feature) => `<li>${feature}</li>`).join("")}</ul>
          <button type="button" class="plan-button" data-plan="${plan.id}"${current ? " disabled" : ""}>${current ? "✓ Your plan" : `Choose ${plan.name}`}</button>
        </article>`;
      })
      .join("");
  };

  useEffect(() => {
    if (loaded) draw();
  }, [loaded]);

  useEffect(() => {
    if (!loaded) return;
    const list = document.querySelector("#planList");
    list?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-plan]");
      if (!button || button.disabled) return;
      const plan = plans.find((item) => item.id === button.dataset.plan);
      savePlan(plan.id);
      draw();
      list.querySelector(`[data-plan="${plan.id}"]`)?.focus();
      notify(`You're on the ${plan.name} plan. (Demo — no payment taken.)`);
    });
  }, [loaded]);

  if (!loaded) {
    return (
      <section className="page active" id="page-pricing">
        <div className="page-intro">
          <p className="eyebrow">Simple, honest pricing</p>
          <h1>Pick your <em>plan.</em></h1>
          <p className="lede">Start free and move up when it feels right. Cancel any time.</p>
        </div>
        <div id="planList" className="plan-grid">Loading…</div>
        <p className="plan-note">Demo only — no payment is taken and plans are not enforced.</p>
      </section>
    );
  }

  return (
    <section className="page active" id="page-pricing">
      <div className="page-intro">
        <p className="eyebrow">Simple, honest pricing</p>
        <h1>Pick your <em>plan.</em></h1>
        <p className="lede">Start free and move up when it feels right. Cancel any time.</p>
      </div>
      <div id="planList" className="plan-grid" dangerouslySetInnerHTML={{ __html: "" }} />
      <p className="plan-note">Demo only — no payment is taken and plans are not enforced.</p>
    </section>
  );
}