import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

const userKey = (kind) => `flexform:${localStorage.getItem("flexformUserEmail") || "guest"}:${kind}`;

export default function TrainerCard({ trainer, onBook, onSave, onChat }) {
  const [saved, setSaved] = useState(false);
  const [booked, setBooked] = useState(false);

  useEffect(() => {
    const savedCoaches = new Set(JSON.parse(localStorage.getItem(userKey("savedCoaches")) || "[]"));
    const bookedCoaches = new Set(JSON.parse(localStorage.getItem(userKey("bookedCoaches")) || "[]"));
    setSaved(savedCoaches.has(trainer.name));
    setBooked(bookedCoaches.has(trainer.name));
  }, [trainer.name]);

  const handleSave = (e) => {
    e.stopPropagation();
    const nowSaved = !saved;
    if (nowSaved) onSave(trainer.name);
    else onSave(trainer.name);
    setSaved(nowSaved);
  };

  const handleBook = async (e) => {
    e.stopPropagation();
    if (booked) return;
    const btn = e.currentTarget;
    btn.disabled = true;
    btn.textContent = "Sending…";
    try {
      await onBook(trainer.name);
      setBooked(true);
      btn.textContent = "✓ Request sent";
      btn.classList.add("booked");
    } catch (error) {
      btn.textContent = "Book a session";
    } finally {
      btn.disabled = false;
    }
  };

  return (
    <article className="trainer-card">
      <div className="card-top">
        <span className={`avatar ${trainer.tone}`}>{trainer.initials}</span>
        <button
          className={`icon-button save ${saved ? "" : ""}`}
          data-save={trainer.name}
          aria-pressed={saved}
          aria-label={`Save ${trainer.name}`}
          style={{ color: saved ? "var(--coral)" : "" }}
          onClick={handleSave}
        >
          {saved ? "♥" : "♡"}
        </button>
      </div>
      <h3>{trainer.name}</h3>
      <p>{trainer.role}</p>
      <div className="tags">
        {trainer.tags.map((tag) => <span key={tag}>{tag}</span>)}
      </div>
      <NavLink
        className="profile-link"
        to={`/coach?id=${encodeURIComponent(trainer.name.toLowerCase().replace(/\s+/g, "-"))}`}
        aria-label={`View ${trainer.name}'s profile`}
      >
        View profile →
      </NavLink>
      <div className="rating">
        ★ {trainer.rating}{" "}
        <span>
          ● {trainer.availability === "today" ? "Available today" : "Available this week"}
        </span>
      </div>
      <button className={`book-button${booked ? " booked" : ""}`} data-book={trainer.name} disabled={booked} onClick={handleBook}>
        {booked ? "✓ Request sent" : "Book a session"}
      </button>
      <button className="outline-button chat-button" data-chat={trainer.name} onClick={(e) => { e.stopPropagation(); onChat(trainer.name); }}>
        Chat with {trainer.name.split(" ")[0]}
      </button>
    </article>
  );
}