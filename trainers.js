const select = (selector) => document.querySelector(selector);
const all = (selector) => [...document.querySelectorAll(selector)];
const toast = (message) => {
  const element = select("#toast");
  if (!element) return;
  element.textContent = message;
  element.classList.add("show");
  setTimeout(() => element.classList.remove("show"), 2600);
};
/* ---- Saved / booked coaches, persisted per user in localStorage (mock, frontend-only) ---- */
const coachStateKey = (kind) => window.flexform.userKey(kind);
const loadCoachSet = (kind) => {
  try {
    return new Set(JSON.parse(localStorage.getItem(coachStateKey(kind)) || "[]"));
  } catch {
    return new Set();
  }
};
const storeCoachSet = (kind, set) => {
  try {
    localStorage.setItem(coachStateKey(kind), JSON.stringify([...set]));
  } catch {
    /* storage unavailable: state just won't persist */
  }
};
const savedCoaches = loadCoachSet("savedCoaches");
const bookedCoaches = loadCoachSet("bookedCoaches");

const TRAINERS_PER_PAGE = 8;
let trainerPage = 1;

/** Filters changed: go back to the first page and redraw. */
function renderTrainers() {
  trainerPage = 1;
  drawTrainers();
}

function drawTrainers() {
  const query = (select("#trainerSearch")?.value || "").toLowerCase();
  const active = select(".filter.active")?.dataset.filter || "All coaches";
  const availability = select("#availability")?.value || "any";
  const filtered = trainers.filter(
    (trainer) =>
      (active === "All coaches" || trainer.specialty === active) &&
      // "this week" includes coaches who are free today
      (availability === "any" ||
        availability === "week" ||
        trainer.availability === "today") &&
      (trainer.name.toLowerCase().includes(query) ||
        trainer.role.toLowerCase().includes(query)),
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / TRAINERS_PER_PAGE));
  trainerPage = Math.min(trainerPage, totalPages);
  const start = (trainerPage - 1) * TRAINERS_PER_PAGE;
  const pageItems = filtered.slice(start, start + TRAINERS_PER_PAGE);

  select("#trainerCount").textContent =
    `${filtered.length} ${filtered.length === 1 ? "coach matches" : "coaches match"} your search` +
    (totalPages > 1
      ? ` · showing ${start + 1}–${start + pageItems.length}`
      : "");
  renderPagination(totalPages);
  select("#trainerList").innerHTML =
    pageItems
      .map(
        (trainer) =>
          `<article class="trainer-card"><div class="card-top"><span class="avatar ${trainer.tone}">${trainer.initials}</span><button class="icon-button save" data-save="${trainer.name}" aria-pressed="${savedCoaches.has(trainer.name)}" aria-label="Save ${trainer.name}"${savedCoaches.has(trainer.name) ? ' style="color:var(--coral)"' : ""}>${savedCoaches.has(trainer.name) ? "♥" : "♡"}</button></div><h3>${trainer.name}</h3><p>${trainer.role}</p><div class="tags">${trainer.tags.map((tag) => `<span>${tag}</span>`).join("")}</div><div class="rating">★ ${trainer.rating} <span>● ${trainer.availability === "today" ? "Available today" : "Available this week"}</span></div><button class="book-button${bookedCoaches.has(trainer.name) ? " booked" : ""}" data-book="${trainer.name}">${bookedCoaches.has(trainer.name) ? "✓ Request sent" : "Book a session"}</button><button class="outline-button chat-button" data-chat="${trainer.name}">Chat with ${trainer.name.split(" ")[0]}</button></article>`,
      )
      .join("") ||
    `<div class="cream-card"><h2>No one by that name yet.</h2><button class="sun-button" data-reset>Reset filters</button></div>`;
}
function renderPagination(totalPages) {
  const nav = select("#trainerPagination");
  if (!nav) return;
  if (totalPages <= 1) {
    nav.innerHTML = "";
    return;
  }
  const numbers = Array.from({ length: totalPages }, (_, index) => index + 1)
    .map(
      (number) =>
        `<button type="button" class="page-button${number === trainerPage ? " active" : ""}" data-page="${number}" aria-label="Page ${number}"${number === trainerPage ? ' aria-current="page"' : ""}>${number}</button>`,
    )
    .join("");
  nav.innerHTML =
    `<button type="button" class="page-button" data-page="${trainerPage - 1}" aria-label="Previous page"${trainerPage === 1 ? " disabled" : ""}>←</button>` +
    numbers +
    `<button type="button" class="page-button" data-page="${trainerPage + 1}" aria-label="Next page"${trainerPage === totalPages ? " disabled" : ""}>→</button>`;
}

/* ---- Mock coach chat (frontend-only: scripted replies from trainers-data.js) ---- */
let activeCoach = null;

function addChatMessage(text, fromUser = false) {
  const body = select("#chatBody");
  const message = document.createElement("p");
  if (fromUser) message.classList.add("from-user");
  message.textContent = text;
  body.appendChild(message);
  body.scrollTop = body.scrollHeight;
}

function renderChatPrompts(coach) {
  select("#chatPrompts").innerHTML = coach.prompts
    .map(
      (prompt, index) =>
        `<button type="button" class="chat-prompt" data-prompt="${index}">${prompt.question}</button>`,
    )
    .join("");
}

/** Reply to a message: prefer a prompt whose keywords match, else the fallback. */
function coachReply(coach, text) {
  const lower = text.toLowerCase();
  const match = coach.prompts.find((prompt) =>
    prompt.keywords.some((keyword) => lower.includes(keyword)),
  );
  return match ? match.answer : coach.fallback;
}

function sendChatMessage(text, reply) {
  addChatMessage(text, true);
  setTimeout(() => addChatMessage(reply), 700);
}

function openChat(coachName) {
  const coach = trainers.find((trainer) => trainer.name === coachName);
  if (!coach) return;
  if (activeCoach?.name !== coach.name) {
    activeCoach = coach;
    select("#chatBody").innerHTML = "";
    select("#chat .avatar").textContent = coach.initials;
    select("#chat .avatar").className = `avatar ${coach.tone}`;
    select("#chat .chat-head b").textContent = coach.name;
    const firstName = (window.flexform?.getStoredUserName() || "Friend").split(/\s+/)[0];
    addChatMessage(coach.greeting.replace("{user}", firstName));
    renderChatPrompts(coach);
  }
  select("#chat").classList.remove("hidden");
  select("#chatInput").focus();
}

/** Apply the "Find my match" answers to the filters and show the results. */
function applyMatch(goal, time) {
  const matches = (availability) =>
    trainers.filter(
      (trainer) =>
        trainer.specialty === goal &&
        (availability === "week" || trainer.availability === "today"),
    ).length;

  let availability = time;
  let message;
  if (time === "today" && matches("today") === 0) {
    availability = "week";
    message = `No ${goal.toLowerCase()} coach is free today. Showing coaches free this week.`;
  } else {
    message = `${matches(availability)} ${goal.toLowerCase()} coaches match you.`;
  }

  select("#trainerSearch").value = "";
  select("#availability").value = availability;
  all(".filter").forEach((item) =>
    item.classList.toggle("active", item.dataset.filter === goal),
  );
  renderTrainers();
  select("#trainerList").scrollIntoView({ behavior: "smooth", block: "start" });
  toast(message);
}

function bindMatchDialog() {
  const dialog = select("#matchDialog");
  select("#matchCancel")?.addEventListener("click", () => dialog.close());
  select("#matchForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    dialog.close();
    applyMatch(data.get("goal"), data.get("time"));
  });
  // Clicking the backdrop closes the dialog.
  dialog?.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
}

function bindChat() {
  select("#closeChat")?.addEventListener("click", () =>
    select("#chat").classList.add("hidden"),
  );
  select("#chatPrompts")?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-prompt]");
    if (!button || !activeCoach) return;
    const prompt = activeCoach.prompts[Number(button.dataset.prompt)];
    sendChatMessage(prompt.question, prompt.answer);
  });
  select("#chatForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = select("#chatInput");
    const text = input.value.trim();
    if (!text || !activeCoach) return;
    input.value = "";
    sendChatMessage(text, coachReply(activeCoach, text));
  });
}

window.addEventListener("DOMContentLoaded", () => {
  select("#app").classList.remove("hidden");
  renderTrainers();
  bindChat();
  bindMatchDialog();
  select("#trainerSearch")?.addEventListener("input", renderTrainers);
  select("#availability")?.addEventListener("change", renderTrainers);
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
      bookedCoaches.add(book.dataset.book);
      storeCoachSet("bookedCoaches", bookedCoaches);
      book.textContent = "✓ Request sent";
      book.classList.add("booked");
      toast(`Session request sent to ${book.dataset.book}`);
    }
    const chatButton = event.target.closest("[data-chat]");
    if (chatButton) openChat(chatButton.dataset.chat);
    const save = event.target.closest("[data-save]");
    if (save) {
      const name = save.dataset.save;
      const nowSaved = !savedCoaches.has(name);
      if (nowSaved) savedCoaches.add(name);
      else savedCoaches.delete(name);
      storeCoachSet("savedCoaches", savedCoaches);
      save.textContent = nowSaved ? "♥" : "♡";
      save.style.color = nowSaved ? "var(--coral)" : "";
      save.setAttribute("aria-pressed", String(nowSaved));
      toast(nowSaved ? "Saved to your coaches" : "Removed from your coaches");
    }
    const pageButton = event.target.closest(".page-button[data-page]");
    if (pageButton && !pageButton.disabled) {
      trainerPage = Number(pageButton.dataset.page);
      drawTrainers();
      select("#trainerList").scrollIntoView({ behavior: "smooth", block: "start" });
    }
    if (event.target.closest("[data-filter-match]")) {
      select("#matchForm").reset();
      select("#matchDialog").showModal();
    }
    if (event.target.closest("[data-reset]")) {
      select("#trainerSearch").value = "";
      select("#availability").value = "any";
      select(".filter.active")?.classList.remove("active");
      select(".filter:first-of-type")?.classList.add("active");
      renderTrainers();
    }
  });
});
