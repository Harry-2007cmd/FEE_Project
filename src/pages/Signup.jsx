import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { flexformAuth } from "../lib/auth.js";
import { flexformAuthUI } from "../lib/auth-ui-utils.js";
import "../styles/styles.css";
import "../styles/auth.css";

const auth = flexformAuth;
const ui = flexformAuthUI;

export default function Signup() {
  const navigate = useNavigate();
  const [step, setStep] = useState("signup"); // "signup" | "verify"
  const [verifyEmail, setVerifyEmail] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [code, setCode] = useState("");

  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [resendSeconds, setResendSeconds] = useState(0);
  const [inbox, setInbox] = useState([]);

  const fieldError = (id, message) => setErrors((prev) => ({ ...prev, [id]: message }));
  const clearAllErrors = () => { setErrors({}); setFormError(""); };

  const passwordChecks = auth.passwordChecks(password);
  const strength = auth.passwordStrength(password);

  // Resume a pending verification after a refresh or a redirect from login.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      await auth.ready;
      if (cancelled) return;
      if (auth.isLoggedIn()) { navigate("/"); return; }
      const pending = auth.pendingEmail();
      const account = pending && auth.getAccount(pending);
      if (account && !account.verified) enterVerifyStep(pending);
      else auth.clearPendingEmail();
    })();
    return () => { cancelled = true; };
  }, [navigate]);

  // Resend cooldown ticker.
  useEffect(() => {
    if (!verifyEmail) return;
    const tick = () => setResendSeconds(auth.resendWaitSeconds(verifyEmail));
    tick();
    const timer = setInterval(tick, 500);
    return () => clearInterval(timer);
  }, [verifyEmail, inbox.length]);

  const formatTime = (timestamp) =>
    new Date(timestamp).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

  const enterVerifyStep = (address) => {
    setVerifyEmail(address);
    setStep("verify");
    setCode("");
    clearAllErrors();
    setInbox(auth.getInbox(address).slice(0, 3));
  };

  const backToSignup = () => {
    setStep("signup");
    setVerifyEmail(null);
    setCode("");
    clearAllErrors();
    auth.clearPendingEmail();
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    clearAllErrors();
    setBusy(true);
    await ui.delay(700);
    const result = await auth.register({ name, email, password, confirm });
    setBusy(false);
    if (!result.ok) {
      Object.entries(result.errors).forEach(([field, message]) => fieldError(field, message));
      return;
    }
    enterVerifyStep(result.email);
  };

  const handleVerify = async (event) => {
    event.preventDefault();
    clearAllErrors();
    setBusy(true);
    await ui.delay(500);
    const result = auth.verifyCode(verifyEmail, code);
    setBusy(false);
    if (!result.ok) { fieldError("code", result.error); return; }
    auth.signInVerified(verifyEmail, false);
    navigate("/");
  };

  const handleResend = () => {
    const result = auth.sendVerificationCode(verifyEmail);
    if (!result.ok) { setFormError(result.error); return; }
    clearAllErrors();
    setCode("");
    setInbox(auth.getInbox(verifyEmail).slice(0, 3));
  };

  return (
    <div id="app" className="app">
      <main id="pages">
        <section className="page active auth-page" id="page-signup">
          <div className="auth-wrap">
            <a className="brand" href="/"><span className="brand-mark">⌁</span><b>flexform<span>.</span></b></a>

            {step === "signup" ? (
              <div id="signupStep">
                <p className="eyebrow">Start with one good choice</p>
                <h1>Make room for feeling good.</h1>
                <p className="lede">Your coaches, courses and progress — all in one calm place.</p>
                <form className="auth-form" id="signupForm" noValidate onSubmit={handleRegister}>
                  <p className="form-error" id="signupError" role="alert" hidden={!formError}>{formError}</p>
                  <div className="field">
                    <label htmlFor="name">Your name</label>
                    <input
                      id="name" name="name" autoComplete="name" placeholder="Alex Lee" maxLength="60"
                      value={name} aria-invalid={!!errors.name} aria-describedby="name-error"
                      onChange={(e) => { setName(e.target.value); fieldError("name", ""); }}
                      onBlur={() => { if (name) fieldError("name", auth.validateName(name)); }}
                    />
                    <p className="field-error" id="name-error">{errors.name || ""}</p>
                  </div>
                  <div className="field">
                    <label htmlFor="email">Email address</label>
                    <input
                      id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com"
                      value={email} aria-invalid={!!errors.email} aria-describedby="email-error"
                      onChange={(e) => { setEmail(e.target.value); fieldError("email", ""); }}
                      onBlur={() => { if (email) fieldError("email", auth.validateEmail(email)); }}
                    />
                    <p className="field-error" id="email-error">{errors.email || ""}</p>
                  </div>
                  <div className="field">
                    <label htmlFor="password">Password</label>
                    <div className="password-field">
                      <input
                        id="password" name="password" type="password" autoComplete="new-password" placeholder="Create a password"
                        value={password} aria-invalid={!!errors.password} aria-describedby="password-error password-rules"
                        onChange={(e) => {
                          const value = e.target.value;
                          setPassword(value);
                          fieldError("password", "");
                          if (confirm) fieldError("confirm", confirm === value ? "" : "The passwords don't match.");
                        }}
                      />
                      <button className="toggle-password" type="button" aria-controls="password" aria-label="Show password"
                        onClick={(e) => {
                          const input = document.getElementById("password");
                          const show = input.type === "password";
                          input.type = show ? "text" : "password";
                          e.currentTarget.textContent = show ? "Hide" : "Show";
                        }}>Show</button>
                    </div>
                    <div className="strength" id="strength" data-score={String(strength.score)} aria-live="polite">
                      <div className="strength-bars" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
                      <span className="strength-label" id="strengthLabel">{strength.label ? `Strength: ${strength.label}` : ""}</span>
                    </div>
                    <ul className="password-rules" id="password-rules">
                      <li data-rule="length" className={passwordChecks.length ? "met" : ""}>At least 8 characters</li>
                      <li data-rule="upper" className={passwordChecks.upper ? "met" : ""}>One uppercase letter</li>
                      <li data-rule="lower" className={passwordChecks.lower ? "met" : ""}>One lowercase letter</li>
                      <li data-rule="number" className={passwordChecks.number ? "met" : ""}>One number</li>
                    </ul>
                    <p className="field-error" id="password-error">{errors.password || ""}</p>
                  </div>
                  <div className="field">
                    <label htmlFor="confirm">Confirm password</label>
                    <div className="password-field">
                      <input
                        id="confirm" name="confirm" type="password" autoComplete="new-password" placeholder="Repeat your password"
                        value={confirm} aria-invalid={!!errors.confirm} aria-describedby="confirm-error"
                        onChange={(e) => {
                          const value = e.target.value;
                          setConfirm(value);
                          fieldError("confirm", value === password ? "" : "The passwords don't match.");
                        }}
                      />
                      <button className="toggle-password" type="button" aria-controls="confirm" aria-label="Show password"
                        onClick={(e) => {
                          const input = document.getElementById("confirm");
                          const show = input.type === "password";
                          input.type = show ? "text" : "password";
                          e.currentTarget.textContent = show ? "Hide" : "Show";
                        }}>Show</button>
                    </div>
                    <p className="field-error" id="confirm-error">{errors.confirm || ""}</p>
                  </div>
                  <button className="action-button" type="submit" id="signupSubmit" disabled={busy}>
                    {busy ? "Creating your space…" : "Create my space →"}
                  </button>
                </form>
                <p className="auth-switch">Already have a space? <a href="/login">Sign in</a></p>
              </div>
            ) : (
              <div id="verifyStep">
                <p className="eyebrow">Check your inbox</p>
                <h1>Verify your email.</h1>
                <p className="lede">We sent a 6-digit code to <b id="verifyEmail">{verifyEmail}</b>. It expires in 10 minutes.</p>
                <form className="auth-form" id="verifyForm" noValidate onSubmit={handleVerify}>
                  <p className="form-error" id="verifyError" role="alert" hidden={!formError}>{formError}</p>
                  <div className="field">
                    <label htmlFor="code">Verification code</label>
                    <input
                      id="code" name="code" className="code-input" inputMode="numeric" autoComplete="one-time-code" maxLength="6" placeholder="000000"
                      value={code} aria-invalid={!!errors.code} aria-describedby="code-error"
                      onChange={(e) => { setCode(e.target.value.replace(/\D/g, "").slice(0, 6)); fieldError("code", ""); }}
                    />
                    <p className="field-error" id="code-error">{errors.code || ""}</p>
                  </div>
                  <button className="action-button" type="submit" id="verifySubmit" disabled={busy}>
                    {busy ? "Verifying…" : "Verify and continue →"}
                  </button>
                </form>
                <p className="auth-switch verify-actions">
                  <button className="link-button" type="button" id="resendCode" disabled={resendSeconds > 0} onClick={handleResend}>
                    {resendSeconds > 0 ? `Resend code (${resendSeconds}s)` : "Resend code"}
                  </button>
                  <span aria-hidden="true">·</span>
                  <button className="link-button" type="button" id="changeEmail" onClick={backToSignup}>Use a different email</button>
                </p>
                <aside className="demo-inbox" aria-labelledby="inboxTitle">
                  <h2 id="inboxTitle">Demo inbox</h2>
                  <p className="demo-inbox-note">No real email is sent. This box stands in for your email app.</p>
                  <ul id="demoInbox" className="demo-inbox-list">
                    {inbox.map((mail) => (
                      <li className="mail" key={`${mail.subject}-${mail.sentAt}`}>
                        <p className="mail-meta">{mail.from} · {formatTime(mail.sentAt)}</p>
                        <p className="mail-subject">{mail.subject}</p>
                        <p className="mail-body">
                          {mail.code && mail.body.includes(mail.code)
                            ? (() => {
                                const [before, after] = mail.body.split(mail.code);
                                return <>{before}<strong className="mail-code">{mail.code}</strong>{after}</>;
                              })()
                            : mail.body}
                        </p>
                      </li>
                    ))}
                  </ul>
                </aside>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}