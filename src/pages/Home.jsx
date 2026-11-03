import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import "../styles/styles.css";
import "../styles/home.css";
import GuestHome from "../components/home/GuestHome.jsx";
import MemberHome from "../components/home/MemberHome.jsx";

export default function Home() {
  const { isLoggedIn, loading } = useAuth();
  const [showLoader, setShowLoader] = useState(true);
  const loggedIn = isLoggedIn();

  // Loader logic from index.js — keep it a React state so no DOM removeChild
  // can ever race with React reconciliation (which crashes the whole tree).
  useEffect(() => {
    if (typeof sessionStorage !== "undefined" && sessionStorage.getItem("flexformSplashSeen")) {
      setShowLoader(false);
      return;
    }
    if (typeof sessionStorage !== "undefined") {
      try { sessionStorage.setItem("flexformSplashSeen", "true"); } catch {}
    }
    const timer = setTimeout(() => setShowLoader(false), 1600);
    return () => clearTimeout(timer);
  }, []);

  // Wait for auth to be ready before rendering to avoid flash
  if (loading) return null;

  return (
    <>
      {showLoader && (
        <div className="loader" id="siteLoader" role="status" aria-label="Loading flexform">
          <div className="loader-inner">
            <div className="logo-mark">⌁</div>
            <div className="loader-logo">flexform<span>.</span></div>
            <p>Start in a way that feels good.</p>
            <div className="loader-line" aria-hidden="true"><i></i></div>
          </div>
        </div>
      )}
      <GuestHome className={loggedIn ? "hidden" : ""} />
      <MemberHome className={loggedIn ? "" : "hidden"} />
    </>
  );
}