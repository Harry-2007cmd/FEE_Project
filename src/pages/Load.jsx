import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Load() {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.setAttribute("data-page", "load");
    const timer = setTimeout(() => {
      try {
        sessionStorage.setItem("flexformSplashSeen", "true");
      } catch {
        /* storage unavailable: Home will show its own loader instead */
      }
      navigate("/", { replace: true });
    }, 1600);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
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
  );
}
