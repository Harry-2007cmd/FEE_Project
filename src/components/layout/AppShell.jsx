import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";
import Footer from "./Footer.jsx";
import MobileNav from "./MobileNav.jsx";
import Toast from "./Toast.jsx";

export default function AppShell() {
  const location = useLocation();
  const pageKey = location.pathname.slice(1) || "home";

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