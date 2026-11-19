import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { pageKeyFor } from "../../lib/nav.js";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";
import Footer from "./Footer.jsx";
import MobileNav from "./MobileNav.jsx";
import Toast from "./Toast.jsx";

export default function AppShell() {
  const location = useLocation();
  const pageKey = pageKeyFor(location.pathname);

  // Set data-page on body for CSS scoping (matches original)
  useEffect(() => {
    document.body.setAttribute("data-page", pageKey);
  }, [pageKey]);

  return (
    <div id="app" className="app">
      <Sidebar activePath={location.pathname} />
      <div className="main-column">
        <Topbar />
        <main id="pages">
          <Outlet />
        </main>
        <Footer pageKey={pageKey} />
      </div>
      <MobileNav activePath={location.pathname} />
      <Toast />
    </div>
  );
}