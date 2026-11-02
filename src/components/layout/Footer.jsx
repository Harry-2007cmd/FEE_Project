import { NavLink } from "react-router-dom";

const footerCopy = {
  home: {
    about: "flexform is a thoughtful wellness space designed to help you move in a way that feels sustainable, supportive, and true to your life. We blend gentle coaching, practical tools, and steady routines to make healthy habits feel possible.",
    contact: "Reach out at hello@flexform.com or call +1 (415) 555-0148 for support, bookings, or questions about memberships and coaching.",
  },
  trainers: {
    about: "flexform is built for people who want expert guidance without the noise, helping you create steady habits that support your routines and goals.",
    contact: "Connect with us at hello@flexform.com or +1 (415) 555-0148 to ask about coaching and memberships.",
  },
  courses: {
    about: "flexform helps people build a sustainable rhythm with practical coaching, accessible classes, and routines designed for real life.",
    contact: "Reach the flexform team at hello@flexform.com or +1 (415) 555-0148.",
  },
  tools: {
    about: "flexform brings together practical habits, movement coaching, and a calmer approach to everyday wellbeing so you can thrive without the pressure.",
    contact: "Send us a note at hello@flexform.com or call +1 (415) 555-0148 for support.",
  },
  pricing: {
    about: "flexform helps people build a sustainable rhythm with practical coaching, accessible classes, and routines designed for real life.",
    contact: "Reach the flexform team at hello@flexform.com or +1 (415) 555-0148.",
  },
  profile: {
    about: "flexform is a thoughtful wellness studio helping people build better rhythms through movement, coaching, and simple routines that fit real life.",
    contact: "Contact our care team at hello@flexform.com or +1 (415) 555-0148 for coaching support and account questions.",
  },
  planner: {
    about: "flexform helps people build a sustainable rhythm with practical coaching, accessible classes, and routines designed for real life.",
    contact: "Reach the flexform team at hello@flexform.com or +1 (415) 555-0148.",
  },
  coach: {
    about: "flexform helps people build a sustainable rhythm with practical coaching, accessible classes, and routines designed for real life.",
    contact: "Reach the flexform team at hello@flexform.com or +1 (415) 555-0148.",
  },
  course: {
    about: "flexform helps people build a sustainable rhythm with practical coaching, accessible classes, and routines designed for real life.",
    contact: "Reach the flexform team at hello@flexform.com or +1 (415) 555-0148.",
  },
  lesson: {
    about: "flexform helps people build a sustainable rhythm with practical coaching, accessible classes, and routines designed for real life.",
    contact: "Reach the flexform team at hello@flexform.com or +1 (415) 555-0148.",
  },
  login: { about: "", contact: "" },
  signup: { about: "", contact: "" },
  load: { about: "", contact: "" },
};

export default function Footer({ pageKey }) {
  const copy = footerCopy[pageKey] || footerCopy.home;
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-block">
          <h3>About us</h3>
          <p>{copy.about}</p>
          <NavLink className="footer-link" to="/pricing">Plans & pricing →</NavLink>
        </div>
        <div className="footer-block">
          <h3>Contact us</h3>
          <p>{copy.contact}</p>
        </div>
      </div>
    </footer>
  );
}