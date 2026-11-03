import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { flexformAuth } from "../lib/auth.js";
import { flexformAuthUI } from "../lib/auth-ui-utils.js";
import "../styles/styles.css";
import "../styles/auth.css";

const auth = flexformAuth;
const ui = flexformAuthUI;

export default function Signup() {
  const navigate = useNavigate();
  let verifyEmail = null;
  let resendTimer = null;

  const formatTime = (timestamp) =>
    new Date(timestamp).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

  const renderInbox = () => {
    const list = document.getElementById("demoInbox");
    if (!list) return;
    list.replaceChildren();
    auth.getInbox(verifyEmail).slice(0, 3).forEach((mail) => {
      const item = document.createElement("li");
      item.className = "mail";

      const meta = document.createElement("p");
      meta.className = "mail-meta";
      meta.textContent = `${mail.from} · ${formatTime(mail.sentAt)}`;

      const subject = document.createElement("p");
      subject.className = "mail-subject";
      subject.textContent = mail.subject;

      const body = document.createElement("p");
      body.className = "mail-body";
      if (mail.code && mail.body.includes(mail.code)) {
        const [before, after] = mail.body.split(mail.code);
        const code = document.createElement("strong");
        code.className = "mail-code";
        code.textContent = mail.code;
        body.append(before, code, after);
      } else {
        body.textContent = mail.body;
      }
      item.append(meta, subject, body);
      list.append(item);
    });
  };

  const updateResend = () => {
    const button = document.getElementById("resendCode");
    const seconds = auth.resendWaitSeconds(verifyEmail);
    button.disabled = seconds > 0;
    button.textContent = seconds > 0 ? `Resend code (${seconds}s)` : "Resend code";
    if (seconds <= 0) clearInterval(resendTimer);
  };

  const startResendTimer = () => {
    clearInterval(resendTimer);
    updateResend();
    resendTimer = setInterval(updateResend, 500);
  };

  const showVerifyStep = (email) => {
    verifyEmail = email;
    document.getElementById("signupStep")?.classList.add("hidden");
    document.getElementById("verifyStep")?.classList.remove("hidden");
    document.getElementById("verifyEmail").textContent = email;
    ui.clearErrors(document.getElementById("verifyForm"), "verifyError");
    document.getElementById("code").value = "";
    renderInbox();
    startResendTimer();
    document.getElementById("code").focus();
  };

  const showSignupStep = () => {
    clearInterval(resendTimer);
    document.getElementById("verifyStep")?.classList.add("hidden");
    document.getElementById("signupStep")?.classList.remove("hidden");
    auth.clearPendingEmail();
    document.getElementById("email").focus();
  };

  const renderPasswordFeedback = () => {
    const value = document.getElementById("password")?.value || "";
    const checks = auth.passwordChecks(value);
    document.querySelectorAll("#password-rules li").forEach((item) => {
      item.classList.toggle("met", checks[item.dataset.rule]);
    });
    const { score, label } = auth.passwordStrength(value);
    document.getElementById("strength").dataset.score = String(score);
    document.getElementById("strengthLabel").textContent = label ? `Strength: ${label}` : "";
  };

  useEffect(() => {
    const init = async () => {
      await auth.ready;
      if (auth.isLoggedIn()) {
        navigate("/");
        return;
      }

      document.querySelector("#app")?.classList.remove("hidden");
      ui.bindPasswordToggles();

      const form = document.getElementById("signupForm");
      const submit = document.getElementById("signupSubmit");

      // Resume a pending verification
      const pending = auth.pendingEmail();
      const pendingAccount = pending && auth.getAccount(pending);
      if (pendingAccount && !pendingAccount.verified) showVerifyStep(pending);
      else auth.clearPendingEmail();

      document.getElementById("password")?.addEventListener("input", () => {
        renderPasswordFeedback();
        ui.setFieldError("password", "");
        if (document.getElementById("confirm").value) {
          ui.setFieldError(
            "confirm",
            document.getElementById("confirm").value === document.getElementById("password").value ? "" : "The passwords don't match.",
          );
        }
      });
      document.getElementById("confirm")?.addEventListener("input", () =>
        ui.setFieldError(
          "confirm",
          document.getElementById("confirm").value === document.getElementById("password").value ? "" : "The passwords don't match.",
        ),
      );
      document.getElementById("name")?.addEventListener("blur", () => {
        if (document.getElementById("name").value) ui.setFieldError("name", auth.validateName(document.getElementById("name").value));
      });
      document.getElementById("email")?.addEventListener("blur", () => {
        if (document.getElementById("email").value) ui.setFieldError("email", auth.validateEmail(document.getElementById("email").value));
      });
      document.getElementById("name")?.addEventListener("input", () => ui.setFieldError("name", ""));
      document.getElementById("email")?.addEventListener("input", () => ui.setFieldError("email", ""));

      form?.addEventListener("submit", async (event) => {
        event.preventDefault();
        ui.clearErrors(form, "signupError");

        ui.setBusy(submit, true, "Creating your space…");
        await ui.delay(700);
        const result = await auth.register({
          name: document.getElementById("name").value,
          email: document.getElementById("email").value,
          password: document.getElementById("password").value,
          confirm: document.getElementById("confirm").value,
        });
        ui.setBusy(submit, false);

        if (!result.ok) {
          Object.entries(result.errors).forEach(([field, message]) =>
            ui.setFieldError(field, message),
          );
          form.querySelector("[aria-invalid]")?.focus();
          return;
        }
        showVerifyStep(result.email);
      });

      const verifyForm = document.getElementById("verifyForm");
      document.getElementById("code")?.addEventListener("input", () => {
        document.getElementById("code").value = document.getElementById("code").value.replace(/\D/g, "").slice(0, 6);
        ui.setFieldError("code", "");
      });

      verifyForm?.addEventListener("submit", async (event) => {
        event.preventDefault();
        ui.clearErrors(verifyForm, "verifyError");
        const button = document.getElementById("verifySubmit");

        ui.setBusy(button, true, "Verifying…");
        await ui.delay(500);
        const result = auth.verifyCode(verifyEmail, document.getElementById("code").value);
        ui.setBusy(button, false);

        if (!result.ok) {
          ui.setFieldError("code", result.error);
          if (result.expired) document.getElementById("resendCode").focus();
          else document.getElementById("code").focus();
          return;
        }
        auth.signInVerified(verifyEmail, false);
        navigate("/");
      });

      document.getElementById("resendCode")?.addEventListener("click", () => {
        const result = auth.sendVerificationCode(verifyEmail);
        if (!result.ok) {
          ui.showFormError("verifyError", result.error);
          return;
        }
        ui.clearErrors(verifyForm, "verifyError");
        document.getElementById("code").value = "";
        renderInbox();
        startResendTimer();
        document.getElementById("code").focus();
      });

      document.getElementById("changeEmail")?.addEventListener("click", showSignupStep);
    };
    init();
    return () => clearInterval(resendTimer);
  }, [navigate]);

  return (
    <>
      <div id="app" className="app">
        <main id="pages">
          <section className="page active auth-page" id="page-signup">
            <div className="auth-wrap">
              <a className="brand" href="/"><span className="brand-mark">⌁</span><b>flexform<span>.</span></b></a>

              <div id="signupStep">
                <p className="eyebrow">Start with one good choice</p>
                <h1>Make room for feeling good.</h1>
                <p className="lede">Your coaches, courses and progress — all in one calm place.</p>
                <form className="auth-form" id="signupForm" noValidate>
                  <p className="form-error hidden" id="signupError" role="alert"></p>
                  <div className="field">
                    <label htmlFor="name">Your name</label>
                    <input id="name" name="name" autoComplete="name" placeholder="Alex Lee" maxLength="60" aria-describedby="name-error" />
                    <p className="field-error" id="name-error"></p>
                  </div>
                  <div className="field">
                    <label htmlFor="email">Email address</label>
                    <input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" aria-describedby="email-error" />
                    <p className="field-error" id="email-error"></p>
                  </div>
                  <div className="field">
                    <label htmlFor="password">Password</label>
                    <div className="password-field">
                      <input id="password" name="password" type="password" autoComplete="new-password" placeholder="Create a password" aria-describedby="password-error password-rules" />
                      <button className="toggle-password" type="button" aria-controls="password" aria-pressed="false" aria-label="Show password">Show</button>
                    </div>
                    <div className="strength" id="strength" aria-live="polite">
                      <div className="strength-bars" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
                      <span className="strength-label" id="strengthLabel"></span>
                    </div>
                    <ul className="password-rules" id="password-rules">
                      <li data-rule="length">At least 8 characters</li>
                      <li data-rule="upper">One uppercase letter</li>
                      <li data-rule="lower">One lowercase letter</li>
                      <li data-rule="number">One number</li>
                    </ul>
                    <p className="field-error" id="password-error"></p>
                  </div>
                  <div className="field">
                    <label htmlFor="confirm">Confirm password</label>
                    <div className="password-field">
                      <input id="confirm" name="confirm" type="password" autoComplete="new-password" placeholder="Repeat your password" aria-describedby="confirm-error" />
                      <button className="toggle-password" type="button" aria-controls="confirm" aria-pressed="false" aria-label="Show password">Show</button>
                    </div>
                    <p className="field-error" id="confirm-error"></p>
                  </div>
                  <button className="action-button" type="submit" id="signupSubmit">Create my space →</button>
                </form>
                <p className="auth-switch">Already have a space? <a href="/login">Sign in</a></p>
              </div>

              <div id="verifyStep" className="hidden">
                <p className="eyebrow">Check your inbox</p>
                <h1>Verify your email.</h1>
                <p className="lede">We sent a 6-digit code to <b id="verifyEmail"></b>. It expires in 10 minutes.</p>
                <form className="auth-form" id="verifyForm" noValidate>
                  <p className="form-error hidden" id="verifyError" role="alert"></p>
                  <div className="field">
                    <label htmlFor="code">Verification code</label>
                    <input id="code" name="code" className="code-input" inputMode="numeric" autoComplete="one-time-code" maxLength="6" placeholder="000000" aria-describedby="code-error" />
                    <p className="field-error" id="code-error"></p>
                  </div>
                  <button className="action-button" type="submit" id="verifySubmit">Verify and continue →</button>
                </form>
                <p className="auth-switch verify-actions">
                  <button className="link-button" type="button" id="resendCode">Resend code</button>
                  <span aria-hidden="true">·</span>
                  <button className="link-button" type="button" id="changeEmail">Use a different email</button>
                </p>
                <aside className="demo-inbox" aria-labelledby="inboxTitle">
                  <h2 id="inboxTitle">Demo inbox</h2>
                  <p className="demo-inbox-note">No real email is sent. This box stands in for your email app.</p>
                  <ul id="demoInbox" className="demo-inbox-list"></ul>
                </aside>
              </div>
            </div>
          </section>
        </main>
      </div>
      <div id="toast" className="toast"></div>
    </>
  );
}