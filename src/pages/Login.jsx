import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { flexformAuth } from "../lib/auth.js";
import { flexformAuthUI } from "../lib/auth-ui-utils.js";
import "../styles/styles.css";
import "../styles/auth.css";

const ui = flexformAuthUI;

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const formRef = useRef(null);
  let lockTimer = null;

  const watchLock = (email) => {
    clearInterval(lockTimer);
    const submit = document.getElementById("loginSubmit");
    const tick = () => {
      const seconds = flexformAuth.lockSeconds(email);
      if (seconds > 0) {
        ui.showFormError("loginError", `Too many failed attempts. Try again in ${seconds}s.`);
        submit.disabled = true;
      } else {
        clearInterval(lockTimer);
        ui.showFormError("loginError", "");
        submit.disabled = false;
      }
    };
    tick();
    if (flexformAuth.lockSeconds(email) > 0) lockTimer = setInterval(tick, 500);
  };

  useEffect(() => {
    const init = async () => {
      await flexformAuth.ready;
      if (flexformAuth.isLoggedIn()) {
        navigate(ui.returnPage());
        return;
      }

      document.querySelector("#app")?.classList.remove("hidden");
      ui.bindPasswordToggles();

      const form = document.getElementById("loginForm");
      formRef.current = form;
      const email = document.getElementById("email");
      const password = document.getElementById("password");
      const remember = document.getElementById("remember");
      const submit = document.getElementById("loginSubmit");

      email?.addEventListener("blur", () => {
        if (!email.value) return;
        ui.setFieldError("email", flexformAuth.validateEmail(email.value));
        if (flexformAuth.lockSeconds(email.value)) watchLock(email.value);
      });
      email?.addEventListener("input", () => ui.setFieldError("email", ""));
      password?.addEventListener("input", () => ui.setFieldError("password", ""));

      document.getElementById("useDemo")?.addEventListener("click", () => {
        const demo = flexformAuth.config.demo;
        email.value = demo.email;
        password.value = demo.password;
        ui.clearErrors(form, "loginError");
        submit?.focus();
      });

      form?.addEventListener("submit", async (event) => {
        event.preventDefault();
        ui.clearErrors(form, "loginError");

        const locked = flexformAuth.lockSeconds(email.value);
        if (locked) {
          watchLock(email.value);
          return;
        }

        ui.setBusy(submit, true, "Signing in…");
        await ui.delay(600);
        const result = await flexformAuth.login({
          email: email.value,
          password: password.value,
          remember: remember.checked,
        });
        ui.setBusy(submit, false);

        if (result.ok) {
          navigate(ui.returnPage());
          return;
        }
        if (result.needsVerification) {
          navigate("/signup?verify=1");
          return;
        }
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, message]) =>
            ui.setFieldError(field, message),
          );
          form.querySelector("[aria-invalid]")?.focus();
          return;
        }
        if (result.locked) {
          watchLock(email.value);
          password.value = "";
          return;
        }
        ui.showFormError("loginError", result.error);
        password.value = "";
        password?.focus();
      });
    };
    init();
    return () => clearInterval(lockTimer);
  }, [navigate]);

  return (
    <>
      <div id="app" className="app hidden">
        <main id="pages">
          <section className="page active auth-page" id="page-login">
            <div className="auth-wrap">
              <a className="brand" href="/"><span className="brand-mark">⌁</span><b>flexform<span>.</span></b></a>
              <p className="eyebrow">Welcome back</p>
              <h1>Let's pick up where you left off.</h1>
              <p className="lede">Sign in to see your plan, upcoming sessions and little wins.</p>
              <form className="auth-form" id="loginForm" noValidate>
                <p className="form-error hidden" id="loginError" role="alert"></p>
                <div className="field">
                  <label htmlFor="email">Email address</label>
                  <input id="email" name="email" type="email" autoComplete="username" placeholder="you@example.com" aria-describedby="email-error" />
                  <p className="field-error" id="email-error"></p>
                </div>
                <div className="field">
                  <label htmlFor="password">Password</label>
                  <div className="password-field">
                    <input id="password" name="password" type="password" autoComplete="current-password" placeholder="Your password" aria-describedby="password-error" />
                    <button className="toggle-password" type="button" aria-controls="password" aria-pressed="false" aria-label="Show password">Show</button>
                  </div>
                  <p className="field-error" id="password-error"></p>
                </div>
                <label className="check-row" htmlFor="remember">
                  <input id="remember" name="remember" type="checkbox" />
                  <span>Remember me for 30 days</span>
                </label>
                <button className="action-button" type="submit" id="loginSubmit">Sign me in →</button>
              </form>
              <p className="auth-switch">New to flexform? <a href="/signup">Create an account</a></p>
              <aside className="demo-hint" aria-label="Demo account">
                <p><b>Demo account</b> · demo@flexform.com / Demo1234</p>
                <button className="link-button" type="button" id="useDemo">Fill it in</button>
              </aside>
            </div>
          </section>
        </main>
      </div>
      <div id="toast" className="toast"></div>
    </>
  );
}