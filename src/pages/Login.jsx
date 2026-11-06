import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { flexformAuth } from "../lib/auth.js";
import { flexformAuthUI } from "../lib/auth-ui-utils.js";
import "../styles/styles.css";
import "../styles/auth.css";

const ui = flexformAuthUI;

export default function Login() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [lockSeconds, setLockSeconds] = useState(0);

  // A countdown timer that ticks the lockout remaining time.
  useEffect(() => {
    if (!email) return;
    const tick = () => setLockSeconds(flexformAuth.lockSeconds(email));
    tick();
    const timer = setInterval(tick, 500);
    return () => clearInterval(timer);
  }, [email]);

  // Redirect if already logged in once auth is ready.
  useEffect(() => {
    if (loading) return;
    if (flexformAuth.isLoggedIn()) navigate(ui.returnPage());
  }, [loading, navigate]);

  const fieldError = (id, message) =>
    setErrors((prev) => ({ ...prev, [id]: message }));

  const clearAllErrors = () => {
    setErrors({});
    setFormError("");
  };

  const showDemo = () => {
    const demo = flexformAuth.config.demo;
    setEmail(demo.email);
    setPassword(demo.password);
    clearAllErrors();
    document.getElementById("email")?.focus();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (lockSeconds > 0) return;
    clearAllErrors();
    setBusy(true);
    await ui.delay(600);
    const result = await login({ email, password, remember });
    setBusy(false);

    if (result.ok) {
      navigate(ui.returnPage());
      return;
    }
    if (result.needsVerification) {
      navigate("/signup?verify=1");
      return;
    }
    if (result.errors) {
      Object.entries(result.errors).forEach(([field, message]) => fieldError(field, message));
      return;
    }
    if (result.locked) {
      setFormError(`Too many failed attempts. Try again in ${flexformAuth.lockSeconds(email)}s.`);
      setPassword("");
      return;
    }
    setFormError(result.error || "We couldn't sign you in.");
    setPassword("");
    document.getElementById("password")?.focus();
  };

  return (
    <div id="app" className="app">
      <main id="pages">
        <section className="page active auth-page" id="page-login">
          <div className="auth-wrap">
            <a className="brand" href="/"><span className="brand-mark">⌁</span><b>flexform<span>.</span></b></a>
            <p className="eyebrow">Welcome back</p>
            <h1>Let's pick up where you left off.</h1>
            <p className="lede">Sign in to see your plan, upcoming sessions and little wins.</p>
            <form className="auth-form" id="loginForm" noValidate onSubmit={handleSubmit}>
              <p className="form-error" id="loginError" role="alert" hidden={!formError}>{formError}</p>
              <div className="field">
                <label htmlFor="email">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  placeholder="you@example.com"
                  value={email}
                  aria-invalid={!!errors.email}
                  aria-describedby="email-error"
                  onChange={(e) => { setEmail(e.target.value); fieldError("email", ""); }}
                  onBlur={() => { if (email) fieldError("email", flexformAuth.validateEmail(email)); }}
                />
                <p className="field-error" id="email-error">{errors.email || ""}</p>
              </div>
              <div className="field">
                <label htmlFor="password">Password</label>
                <div className="password-field">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Your password"
                    value={password}
                    aria-invalid={!!errors.password}
                    aria-describedby="password-error"
                    onChange={(e) => { setPassword(e.target.value); fieldError("password", ""); }}
                  />
                  <button
                    className="toggle-password"
                    type="button"
                    aria-controls="password"
                    aria-pressed="false"
                    aria-label="Show password"
                    onClick={() => {
                      const input = document.getElementById("password");
                      const show = input.type === "password";
                      input.type = show ? "text" : "password";
                    }}
                  >
                    Show
                  </button>
                </div>
                <p className="field-error" id="password-error">{errors.password || ""}</p>
              </div>
              <label className="check-row" htmlFor="remember">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <span>Remember me for 30 days</span>
              </label>
              <button className="action-button" type="submit" id="loginSubmit" disabled={busy || lockSeconds > 0}>
                {busy ? "Signing in…" : lockSeconds > 0 ? `Try again in ${lockSeconds}s` : "Sign me in →"}
              </button>
            </form>
            <p className="auth-switch">New to flexform? <a href="/signup">Create an account</a></p>
            <aside className="demo-hint" aria-label="Demo account">
              <p><b>Demo account</b> · demo@flexform.com / Demo1234</p>
              <button className="link-button" type="button" id="useDemo" onClick={showDemo}>Fill it in</button>
            </aside>
          </div>
        </section>
      </main>
    </div>
  );
}