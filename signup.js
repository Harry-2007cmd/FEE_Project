(() => {
  const auth = window.flexformAuth;
  const ui = window.flexformAuthUI;
  const $ = (id) => document.getElementById(id);

  let verifyEmail = null;
  let resendTimer = null;

  /* ---------- password rules + strength meter ---------- */

  const renderPasswordFeedback = () => {
    const value = $("password").value;
    const checks = auth.passwordChecks(value);
    document.querySelectorAll("#password-rules li").forEach((item) => {
      item.classList.toggle("met", checks[item.dataset.rule]);
    });
    const { score, label } = auth.passwordStrength(value);
    $("strength").dataset.score = String(score);
    $("strengthLabel").textContent = label ? `Strength: ${label}` : "";
  };

  /* ---------- verification step ---------- */

  const formatTime = (timestamp) =>
    new Date(timestamp).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

  const renderInbox = () => {
    const list = $("demoInbox");
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
    const button = $("resendCode");
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
    $("signupStep").classList.add("hidden");
    $("verifyStep").classList.remove("hidden");
    $("verifyEmail").textContent = email;
    ui.clearErrors($("verifyForm"), "verifyError");
    $("code").value = "";
    renderInbox();
    startResendTimer();
    $("code").focus();
  };

  const showSignupStep = () => {
    clearInterval(resendTimer);
    $("verifyStep").classList.add("hidden");
    $("signupStep").classList.remove("hidden");
    auth.clearPendingEmail();
    $("email").focus();
  };

  /* ---------- wiring ---------- */

  window.addEventListener("DOMContentLoaded", async () => {
    await auth.ready;
    if (auth.isLoggedIn()) {
      window.location.replace("index.html");
      return;
    }

    document.querySelector("#app").classList.remove("hidden");
    ui.bindPasswordToggles();

    const form = $("signupForm");
    const submit = $("signupSubmit");

    // Resume a pending verification (e.g. after a refresh, or from the login page).
    const pending = auth.pendingEmail();
    const pendingAccount = pending && auth.getAccount(pending);
    if (pendingAccount && !pendingAccount.verified) showVerifyStep(pending);
    else auth.clearPendingEmail();

    $("password").addEventListener("input", () => {
      renderPasswordFeedback();
      ui.setFieldError("password", "");
      if ($("confirm").value) {
        ui.setFieldError(
          "confirm",
          $("confirm").value === $("password").value ? "" : "The passwords don't match.",
        );
      }
    });
    $("confirm").addEventListener("input", () =>
      ui.setFieldError(
        "confirm",
        $("confirm").value === $("password").value ? "" : "The passwords don't match.",
      ),
    );
    $("name").addEventListener("blur", () => {
      if ($("name").value) ui.setFieldError("name", auth.validateName($("name").value));
    });
    $("email").addEventListener("blur", () => {
      if ($("email").value) ui.setFieldError("email", auth.validateEmail($("email").value));
    });
    $("name").addEventListener("input", () => ui.setFieldError("name", ""));
    $("email").addEventListener("input", () => ui.setFieldError("email", ""));

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      ui.clearErrors(form, "signupError");

      ui.setBusy(submit, true, "Creating your space…");
      await ui.delay(700); // simulated network round trip
      const result = await auth.register({
        name: $("name").value,
        email: $("email").value,
        password: $("password").value,
        confirm: $("confirm").value,
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

    const verifyForm = $("verifyForm");
    $("code").addEventListener("input", () => {
      $("code").value = $("code").value.replace(/\D/g, "").slice(0, 6);
      ui.setFieldError("code", "");
    });

    verifyForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      ui.clearErrors(verifyForm, "verifyError");
      const button = $("verifySubmit");

      ui.setBusy(button, true, "Verifying…");
      await ui.delay(500);
      const result = auth.verifyCode(verifyEmail, $("code").value);
      ui.setBusy(button, false);

      if (!result.ok) {
        ui.setFieldError("code", result.error);
        if (result.expired) $("resendCode").focus();
        else $("code").focus();
        return;
      }
      auth.signInVerified(verifyEmail, false);
      window.location.href = "index.html";
    });

    $("resendCode").addEventListener("click", () => {
      const result = auth.sendVerificationCode(verifyEmail);
      if (!result.ok) {
        ui.showFormError("verifyError", result.error);
        return;
      }
      ui.clearErrors(verifyForm, "verifyError");
      $("code").value = "";
      renderInbox();
      startResendTimer();
      $("code").focus();
    });

    $("changeEmail").addEventListener("click", showSignupStep);
  });
})();
