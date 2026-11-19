import { useRef, useState } from "react";

const planKey = () => `flexform:${localStorage.getItem("flexformUserEmail") || "guest"}:plan`;

const readPlan = () => {
  try {
    const id = localStorage.getItem(planKey());
    return window.plans.some((plan) => plan.id === id) ? id : "free";
  } catch {
    return "free";
  }
};

const writePlan = (id) => {
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

export default function Pricing() {
  const plans = window.plans;
  const [currentId, setCurrentId] = useState(readPlan);
  const listRef = useRef(null);

  const choose = (plan) => {
    writePlan(plan.id);
    setCurrentId(plan.id);
    // Keep keyboard focus on the button that was just used (disabled buttons drop focus).
    requestAnimationFrame(() => listRef.current?.querySelector(`[data-plan="${plan.id}"]`)?.focus());
    notify(`You're on the ${plan.name} plan. (Demo — no payment taken.)`);
  };

  return (
    <section className="page active" id="page-pricing">
      <div className="page-intro">
        <p className="eyebrow">Simple, honest pricing</p>
        <h1>Pick your <em>plan.</em></h1>
        <p className="lede">Start free and move up when it feels right. Cancel any time.</p>
      </div>
      <div id="planList" className="plan-grid" ref={listRef}>
        {plans.map((plan) => {
          const current = plan.id === currentId;
          return (
            <article
              key={plan.id}
              className={`plan-card${plan.featured ? " featured" : ""}${current ? " current" : ""}`}
              aria-labelledby={`plan-${plan.id}`}
            >
              {plan.featured && <span className="plan-badge">Most popular</span>}
              <h2 id={`plan-${plan.id}`}>{plan.name}</h2>
              <p className="plan-tagline">{plan.tagline}</p>
              <p className="plan-price">
                <b>{plan.price ? `$${plan.price}` : "$0"}</b>
                <span>{plan.price ? "/ month" : "forever"}</span>
              </p>
              <ul className="plan-features">
                {plan.features.map((feature) => <li key={feature}>{feature}</li>)}
              </ul>
              <button
                type="button"
                className="plan-button"
                data-plan={plan.id}
                disabled={current}
                onClick={() => choose(plan)}
              >
                {current ? "✓ Your plan" : `Choose ${plan.name}`}
              </button>
            </article>
          );
        })}
      </div>
      <p className="plan-note">Demo only — no payment is taken and plans are not enforced.</p>
    </section>
  );
}
