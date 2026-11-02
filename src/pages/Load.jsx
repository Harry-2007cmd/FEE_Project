import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Load() {
  const navigate = useNavigate();

  useEffect(() => {
    const redirectToHome = () => {
      try {
        sessionStorage.setItem("flexformSplashSeen", "true");
      } catch (error) {
        /* storage unavailable: index.html will show its loader instead */
      }
      navigate("/");
    };

    const timer = setTimeout(redirectToHome, 1600);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <>
      <script dangerouslySetInnerHTML={{
        __html: `// Theme (light / dark). Loaded in <head> of every page so the right theme is applied before first paint.
const KEY = "flexformTheme";
const media = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
const saved = () => { try { const value = localStorage.getItem(KEY); return value === "light" || value === "dark" ? value : null; } catch { return null; } };
const current = () => saved() || (media && media.matches ? "dark" : "light");
const apply = () => { document.documentElement.setAttribute("data-theme", current()); document.dispatchEvent(new CustomEvent("flexform:themechange", { detail: current() })); };
apply();
if (media) { const onChange = () => { if (!saved()) apply(); }; media.addEventListener ? media.addEventListener("change", onChange) : media.addListener(onChange); }
window.flexformTheme = { current, set(value) { try { localStorage.setItem(KEY, value); } catch {} document.documentElement.setAttribute("data-theme", value); document.dispatchEvent(new CustomEvent("flexform:themechange", { detail: value })); }, toggle() { this.set(current() === "dark" ? "light" : "dark"); } };`
      }} />
      <style dangerouslySetInnerHTML={{
        __html: `:root { --ink: #292825; --cream: #f7f3ec; --paper: #fffaf0; --line: #ded9cd; --stone: #8b877e; --coral: #ff665d; --sun: #ffd33d; --mint: #b9ddc6; --purple: #d8cce8; --display: "Space Grotesk", sans-serif; --body: "DM Sans", sans-serif; } * { box-sizing: border-box; } html, body { margin: 0; min-height: 100%; background: var(--cream); color: var(--ink); font-family: var(--body); } body { display: grid; place-items: center; min-height: 100vh; padding: 32px 20px; } .loader-card { width: min(640px, 100%); background: rgba(255, 255, 255, 0.28); border: 1px solid var(--line); border-radius: 28px; padding: 52px 40px 40px; text-align: center; } .brand { display: inline-flex; align-items: center; gap: 10px; font: 700 30px var(--display); letter-spacing: -0.06em; } .brand-mark { width: 42px; height: 42px; border-radius: 14px; display: grid; place-items: center; background: var(--sun); color: var(--ink); font-size: 24px; } .brand span { color: var(--coral); } .eyebrow { margin: 42px 0 16px; color: var(--coral); letter-spacing: 0.22em; text-transform: uppercase; font-size: 11px; font-weight: 700; } h1 { margin: 0; font-family: var(--display); font-size: clamp(2.8rem, 5vw, 5rem); line-height: 0.96; letter-spacing: -0.08em; } .tagline { margin: 22px auto 0; max-width: 500px; color: var(--stone); font-size: 1.08rem; line-height: 1.7; } .loader-wrap { margin-top: 34px; display: flex; align-items: center; justify-content: center; gap: 16px; } .loader-bar { width: min(210px, 45%); height: 8px; border-radius: 999px; background: rgba(41, 40, 37, 0.2); overflow: hidden; } .loader-bar i { display: block; width: 42%; height: 100%; border-radius: inherit; background: var(--sun); animation: load 1.15s ease-in-out infinite; } .loading-text { color: var(--ink); font-weight: 700; } @keyframes load { 50% { transform: translateX(160%); } } @media (max-width: 640px) { .loader-card { padding: 36px 24px 28px; } .loader-wrap { flex-direction: column; gap: 12px; } .loader-bar { width: 100%; } }`
      }} />
      <div className="loader-card">
        <div className="brand"><span className="brand-mark">⌁</span><b>flexform<span>.</span></b></div>
        <p className="eyebrow">Build your rhythm</p>
        <h1>Start in a way that feels good.</h1>
        <p className="tagline">Meet your coach, shape your plan, and create a routine that supports the life you already live.</p>
        <div className="loader-wrap" aria-label="Loading your home page">
          <div className="loader-bar"><i></i></div>
          <span className="loading-text">Preparing…</span>
        </div>
      </div>
    </>
  );
}