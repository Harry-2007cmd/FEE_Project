import { useEffect, useRef, useState } from "react";

export default function ChatPanel({ isOpen, coach, onClose, userName }) {
  const chatBodyRef = useRef(null);
  const chatInputRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [prompts, setPrompts] = useState([]);

  useEffect(() => {
    if (isOpen && coach) {
      const firstName = (userName || "Friend").split(/\s+/)[0];
      const greeting = coach.greeting.replace("{user}", firstName);
      setMessages([{ text: greeting, fromUser: false }]);
      setPrompts(coach.prompts);
      chatInputRef.current?.focus();
    }
  }, [isOpen, coach, userName]);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  const addMessage = (text, fromUser) => {
    setMessages((prev) => [...prev, { text, fromUser }]);
  };

  const sendChatMessage = (text, reply) => {
    addMessage(text, true);
    setTimeout(() => addMessage(reply, false), 700);
  };

  const handlePromptClick = (prompt) => {
    sendChatMessage(prompt.question, prompt.answer);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const input = chatInputRef.current;
    const text = input.value.trim();
    if (!text || !coach) return;
    input.value = "";
    const lower = text.toLowerCase();
    const match = coach.prompts.find((p) => p.keywords.some((k) => lower.includes(k)));
    const reply = match ? match.answer : coach.fallback;
    sendChatMessage(text, reply);
  };

  if (!isOpen) return null;

  return (
    <div id="chat" className="chat" role="dialog" aria-modal="true" aria-label={`Chat with ${coach?.name}`}>
      <div className="chat-head">
        <span className={`avatar ${coach?.tone}`}>{coach?.initials}</span>
        <div>
          <b>{coach?.name}</b>
          <small>Usually replies in 10 min</small>
        </div>
        <button id="closeChat" type="button" aria-label="Close chat" onClick={onClose}>
          ×
        </button>
      </div>
      <div className="chat-body" id="chatBody" ref={chatBodyRef} aria-live="polite">
        {messages.map((msg, i) => (
          <p key={i} className={msg.fromUser ? "from-user" : ""}>
            {msg.text}
          </p>
        ))}
      </div>
      <div className="chat-prompts" id="chatPrompts" aria-label="Suggested questions">
        {prompts.map((prompt, index) => (
          <button key={index} type="button" className="chat-prompt" onClick={() => handlePromptClick(prompt)}>
            {prompt.question}
          </button>
        ))}
      </div>
      <form id="chatForm" onSubmit={handleSubmit}>
        <input ref={chatInputRef} id="chatInput" placeholder="Write a note..." />
        <button type="submit">→</button>
      </form>
    </div>
  );
}