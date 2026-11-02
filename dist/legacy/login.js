(() => {
  const auth = window.flexformAuth;
  const ui = window.flexformAuthUI;

  let lockTimer = null;

  /** Show a live countdown while this email is locked out. */
  const watchLock = (email) => {
    clearInterval(lockTimer);
    const submit = document.getElementById("loginSubmit");
    const tick = () => {
      const seconds = auth.lockSeconds(email);
      if (seconds > 0) {
        ui.showFormError(
          "loginError",
          `Too many failed attempts. Try again in ${seconds}s.`,
        );
        submit.disabled = true;
      } else {
        clearInterval(lockTimer);
        ui.showFormError("loginError", "");
        submit.disabled = false;
      }
    };
    tick();
    if (auth.lockSeconds(email) > 0) lockTimer = setInterval(tick, 500);
  };

  window.addEventListener("DOMContentLoaded", async () => {
    await auth.ready;
    if (auth.isLoggedIn()) {
      window.location.replace(ui.returnPage());
      return;
    }

    document.querySelector("#app").classList.remove("hidden");
    ui.bindPasswordToggles();

    const form = document.getElementById("loginForm");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const remember = document.getElementById("remember");
    const submit = document.getElementById("loginSubmit");

    email.addEventListener("blur", () => {
      if (!email.value) return;
      ui.setFieldError("email", auth.validateEmail(email.value));
      if (auth.lockSeconds(email.value)) watchLock(email.value);
    });
    email.addEventListener("input", () => ui.setFieldError("email", ""));
    password.addEventListener("input", () => ui.setFieldError("password", ""));

    document.getElementById("useDemo").addEventListener("click", () => {
      const demo = auth.config.demo;
      email.value = demo.email;
      password.value = demo.password;
      ui.clearErrors(form, "loginError");
      submit.focus();
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      ui.clearErrors(form, "loginError");

      const locked = auth.lockSeconds(email.value);
      if (locked) {
        watchLock(email.value);
        return;
      }

      ui.setBusy(submit, true, "Signing in…");
      await ui.delay(600); // simulated network round trip
      const result = await auth.login({
        email: email.value,
        password: password.value,
        remember: remember.checked,
      });
      ui.setBusy(submit, false);

      if (result.ok) {
        window.location.href = ui.returnPage();
        return;
      }
      if (result.needsVerification) {
        window.location.href = "signup.html?verify=1";
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
      password.focus();
    });
  });
})();
