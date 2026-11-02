import { useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import "../styles/styles.css";
import "../styles/home.css";
import GuestHome from "../components/home/GuestHome.jsx";
import MemberHome from "../components/home/MemberHome.jsx";

export default function Home() {
  const { isLoggedIn } = useAuth();
  const loggedIn = isLoggedIn();

  // Loader logic from index.js
  useEffect(() => {
    const siteLoader = document.getElementById("siteLoader");
    if (siteLoader) {
      const api = window.flexformApi;
      const minimumTime = api.delay(1600);
      const pageLoaded = new Promise((resolve) => {
        if (document.readyState === "complete") resolve();
        else window.addEventListener("load", resolve, { once: true });
      });
      Promise.all([minimumTime, Promise.race([pageLoaded, api.delay(4000)])]).then(() =>
        siteLoader.remove(),
      );
    }
  }, []);

  return (
    <>
      <div className="loader" id="siteLoader" role="status" aria-label="Loading flexform">
        <div className="loader-inner">
          <div className="logo-mark">⌁</div>
          <div className="loader-logo">flexform<span>.</span></div>
          <p>Start in a way that feels good.</p>
          <div className="loader-line" aria-hidden="true"><i></i></div>
        </div>
      </div>
      <script dangerouslySetInnerHTML={{
        __html: `// Show the splash once per tab session; skip it on later visits.
try {
  if (sessionStorage.getItem("flexformSplashSeen")) {
    document.getElementById("siteLoader")?.remove();
  } else {
    sessionStorage.setItem("flexformSplashSeen", "true");
  }
} catch (error) {
  /* storage unavailable: the splash simply shows each time */
}`
      }} />
      <GuestHome className={loggedIn ? "hidden" : ""} />
      <MemberHome className={loggedIn ? "" : "hidden"} />
    </>
  );
}