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
/* ---- Mock coach chat (frontend-only: scripted replies, nothing is sent) ---- */
const mockChatReplies = [
  "Thanks for sharing that. Could you tell me a bit about your current routine?",
  "That makes sense. We can start small and build from there.",
  "Great. Book a session and we can plan your first week together.",
];
let chatCoach = null;
let chatReplyIndex = 0;

function addChatMessage(text, fromUser = false) {
  const body = select("#chatBody");
  const message = document.createElement("p");
  if (fromUser) message.classList.add("from-user");
  message.textContent = text;
  body.appendChild(message);
  body.scrollTop = body.scrollHeight;
}

function openChat(coachName) {
  const coach = trainers.find((trainer) => trainer.name === coachName);
  if (!coach) return;
  if (chatCoach !== coach.name) {
    chatCoach = coach.name;
    chatReplyIndex = 0;
    select("#chatBody").innerHTML = "";
    select("#chat .avatar").textContent = coach.initials;
    select("#chat .avatar").className = `avatar ${coach.tone}`;
    select("#chat .chat-head b").textContent = coach.name;
    const firstName = (window.flexform?.getStoredUserName() || "Friend").split(/\s+/)[0];
    addChatMessage(
      `Hi ${firstName}, I’m glad you’re here. What would you like to work toward?`,
    );
  }
  select("#chat").classList.remove("hidden");
  select("#chatInput").focus();
}

function bindChat() {
  select("#closeChat")?.addEventListener("click", () =>
    select("#chat").classList.add("hidden"),
  );
  select("#chatForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = select("#chatInput");
    const text = input.value.trim();
    if (!text) return;
    addChatMessage(text, true);
    input.value = "";
    setTimeout(() => {
      addChatMessage(mockChatReplies[chatReplyIndex % mockChatReplies.length]);
      chatReplyIndex += 1;
    }, 700);
  });
}

window.addEventListener("DOMContentLoaded", () => {
  select("#app").classList.remove("hidden");
  renderTrainers();
  bindChat();
  select("#trainerSearch")?.addEventListener("input", renderTrainers);
  all(".filter").forEach((button) =>
    button.addEventListener("click", () => {
      all(".filter").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      renderTrainers();
    }),
  );
  document.addEventListener("click", (event) => {
    const book = event.target.closest("[data-book]");
    if (book) {
      book.textContent = "✓ Request sent";
      book.classList.add("booked");
      toast(`Session request sent to ${book.dataset.book}`);
    }
    const chatButton = event.target.closest("[data-chat]");
    if (chatButton) openChat(chatButton.dataset.chat);
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
