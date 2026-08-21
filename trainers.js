const trainers = [
  {
    name: "Maya Chen",
    role: "Strength & mobility coach",
    specialty: "Strength",
    initials: "MC",
    tone: "coral",
    rating: "4.9",
    tags: ["Functional strength", "Mobility"],
  },
  {
    name: "Noah Williams",
    role: "Performance trainer",
    specialty: "Performance",
    initials: "NW",
    tone: "sun",
    rating: "4.8",
    tags: ["Running form", "Core strength"],
  },
  {
    name: "Arjun Patel",
    role: "Mindful movement guide",
    specialty: "Mindful movement",
    initials: "AP",
    tone: "lilac",
    rating: "5.0",
    tags: ["Yoga foundations", "Recovery"],
  },
  {
    name: "Lena Ortiz",
    role: "Nutrition & habit coach",
    specialty: "Nutrition",
    initials: "LO",
    tone: "mint",
    rating: "4.9",
    tags: ["Everyday nutrition", "Habit design"],
  },
];
const select = (selector) => document.querySelector(selector);
const all = (selector) => [...document.querySelectorAll(selector)];
const toast = (message) => {
  const element = select("#toast");
  if (!element) return;
  element.textContent = message;
  element.classList.add("show");
  setTimeout(() => element.classList.remove("show"), 2600);
};
function renderTrainers() {
  const query = (select("#trainerSearch")?.value || "").toLowerCase();
  const active = select(".filter.active")?.dataset.filter || "All coaches";
  const filtered = trainers.filter(
    (trainer) =>
      (active === "All coaches" || trainer.specialty === active) &&
      (trainer.name.toLowerCase().includes(query) ||
        trainer.role.toLowerCase().includes(query)),
  );
  select("#trainerCount").textContent =
    `${filtered.length} coaches match your search`;
  select("#trainerList").innerHTML =
    filtered
      .map(
        (trainer) =>
          `<article class="trainer-card"><div class="card-top"><span class="avatar ${trainer.tone}">${trainer.initials}</span><button class="icon-button save">♡</button></div><h3>${trainer.name}</h3><p>${trainer.role}</p><div class="tags">${trainer.tags.map((tag) => `<span>${tag}</span>`).join("")}</div><div class="rating">★ ${trainer.rating} <span>● Available</span></div><button class="book-button" data-book="${trainer.name}">Book a session</button><button class="outline-button chat-button" data-chat="${trainer.name}">Chat with ${trainer.name.split(" ")[0]}</button></article>`,
      )
      .join("") ||
    `<div class="cream-card"><h2>No one by that name yet.</h2><button class="sun-button" data-reset>Reset filters</button></div>`;
}
const isLoggedIn = () => localStorage.getItem("fitlyLoggedIn") === "true";

const updateAuthUI = () => {
  const loggedIn = isLoggedIn();
  const isProfilePage = window.location.pathname.endsWith("profile.html");

  document.querySelectorAll(".auth-only").forEach((element) => {
    element.classList.toggle("hidden", !loggedIn || isProfilePage);
  });
  document.querySelectorAll(".guest-only").forEach((element) => {
    element.classList.toggle("hidden", loggedIn || isProfilePage);
  });
  document.querySelectorAll(".user-chip--main").forEach((element) => {
    element.classList.toggle("hidden", !loggedIn || isProfilePage);
  });

  document.querySelectorAll('a[href="login.html"], a[href="signup.html"]').forEach((element) => {
    const onAuthPage = ["login.html", "signup.html"].includes(
      window.location.pathname.split("/").pop(),
    );
    element.classList.toggle("hidden", loggedIn && !onAuthPage);
  });
};

window.addEventListener("DOMContentLoaded", () => {
  updateAuthUI();
  select("#app").classList.remove("hidden");
  renderTrainers();
  select("#trainerSearch")?.addEventListener("input", renderTrainers);
  all(".filter").forEach((button) =>
    button.addEventListener("click", () => {
      all(".filter").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      renderTrainers();
    }),
  );
  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-logout]")) {
      localStorage.removeItem("fitlyLoggedIn");
      window.location.href = "index.html";
      return;
    }

    const book = event.target.closest("[data-book]");
    if (book) {
      book.textContent = "✓ Request sent";
      book.classList.add("booked");
      toast(`Session request sent to ${book.dataset.book}`);
    }
    const save = event.target.closest(".save");
    if (save) {
      save.textContent = "♥";
      save.style.color = "var(--coral)";
      toast("Saved to your coaches");
    }
    if (event.target.closest("[data-filter-match]")) {
      select(".filter[data-filter='Strength']")?.click();
      toast("We found a strong starting point for you.");
    }
    if (event.target.closest("[data-reset]")) {
      select("#trainerSearch").value = "";
      select(".filter.active")?.classList.remove("active");
      select(".filter:first-of-type")?.classList.add("active");
      renderTrainers();
    }
  });
});
