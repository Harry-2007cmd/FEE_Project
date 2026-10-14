/*
 * auth.js — MOCK authentication, frontend-only (localStorage + sessionStorage).
 *
 * This SIMULATES a real sign-up / sign-in system so the UI behaves like one:
 * validation, salted password hashes, email verification codes, login
 * lockouts and "remember me" sessions. It is NOT secure: everything lives in
 * the browser, so anyone with dev tools can read or edit it. There is no
 * server and no email is ever sent; "emails" are written to a demo inbox that
 * the pages render on screen.
 *
 * Exposes window.flexformAuth. Load before common.js, login.js, signup.js.
 *
 * Storage layout
 *   localStorage   flexformAccounts       { [email]: account }
 *   localStorage   flexformInbox          [ email message ]
 *   localStorage   flexformVerification   { [email]: pending code }
 *   localStorage   flexformLoginAttempts  { [email]: { count, lockedUntil } }
 *   localStorage   flexformSession        { email, remember, expiresAt }
 *   sessionStorage flexformTabSession     "true" when signed in without "remember me"
 *   sessionStorage flexformPendingEmail   email waiting on verification in this tab
 *   localStorage   flexformLoggedIn / flexformUserName / flexformUserEmail
 *                  (mirrors of the session for the rest of the site)
 */
(() => {
  const KEYS = {
    accounts: "flexformAccounts",
    inbox: "flexformInbox",
    verification: "flexformVerification",
    attempts: "flexformLoginAttempts",
    session: "flexformSession",
    tab: "flexformTabSession",
    pending: "flexformPendingEmail",
    loggedIn: "flexformLoggedIn",
    name: "flexformUserName",
    email: "flexformUserEmail",
  };

  const CONFIG = {
    codeTtlMs: 10 * 60 * 1000,
    resendCooldownMs: 30 * 1000,
    maxCodeAttempts: 5,
    maxLoginAttempts: 5,
    lockMs: 30 * 1000,
    rememberDays: 30,
    pbkdf2Iterations: 100000,
    inboxLimit: 20,
    demo: { name: "Demo User", email: "demo@flexform.com", password: "Demo1234" },
  };

  const COMMON_PASSWORDS = [
    "password", "password1", "password123", "12345678", "123456789",
    "qwerty123", "qwertyui", "iloveyou", "admin123", "welcome1",
    "letmein1", "abc12345", "flexform1",
  ];

  /* ---------- storage helpers (every access is guarded) ---------- */

  const read = (key, fallback, storage = localStorage) => {
    try {
      const raw = storage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch {
      return fallback;
    }
  };

  const write = (key, value, storage = localStorage) => {
    try {
      storage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage unavailable: the simulation just won't persist */
    }
  };

  const remove = (key, storage = localStorage) => {
    try {
      storage.removeItem(key);
    } catch {
      /* ignore */
    }
  };

  const readRaw = (key, storage = localStorage) => {
    try {
      return storage.getItem(key);
    } catch {
      return null;
    }
  };

  const writeRaw = (key, value, storage = localStorage) => {
    try {
      storage.setItem(key, value);
    } catch {
      /* ignore */
    }
  };

  const now = () => Date.now();

  const normaliseEmail = (email = "") => String(email).trim().toLowerCase();

  /* ---------- validation ---------- */

  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const validateName = (value = "") => {
    const name = String(value).trim().replace(/\s+/g, " ");
    if (!name) return "Enter your name.";
    if (name.length < 2) return "Your name needs at least 2 characters.";
    if (name.length > 60) return "Your name must be 60 characters or fewer.";
    if (!/^[\p{L}][\p{L}\p{M}' .-]*$/u.test(name)) {
      return "Use letters, spaces, apostrophes, dots or hyphens only.";
    }
    return null;
  };

  const validateEmail = (value = "") => {
    const email = normaliseEmail(value);
    if (!email) return "Enter your email address.";
    if (email.length > 254 || !EMAIL_PATTERN.test(email)) {
      return "Enter a valid email address, like you@example.com.";
    }
    return null;
  };

  /** Which password rules are met. */
  const passwordChecks = (password = "") => ({
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /\d/.test(password),
  });

  const validatePassword = (password = "") => {
    if (!password) return "Enter a password.";
    if (password.length > 64) return "Use 64 characters or fewer.";
    const checks = passwordChecks(password);
    if (!checks.length) return "Use at least 8 characters.";
    if (!checks.upper || !checks.lower || !checks.number) {
      return "Include an uppercase letter, a lowercase letter and a number.";
    }
    if (COMMON_PASSWORDS.includes(password.toLowerCase())) {
      return "That password is too common. Choose something harder to guess.";
    }
    return null;
  };

  /** 0 (empty) to 4 (strong), with a label for the meter. */
  const passwordStrength = (password = "") => {
    if (!password) return { score: 0, label: "" };
    const checks = passwordChecks(password);
    let score = Object.values(checks).filter(Boolean).length - 1; // 0..3
    if (password.length >= 12) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    if (COMMON_PASSWORDS.includes(password.toLowerCase())) score = 0;
    score = Math.max(1, Math.min(4, score));
    return { score, label: ["", "Weak", "Fair", "Good", "Strong"][score] };
  };

  /* ---------- hashing ---------- */

  const encoder = new TextEncoder();
  const toHex = (buffer) =>
    [...new Uint8Array(buffer)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  const randomHex = (bytes) => toHex(crypto.getRandomValues(new Uint8Array(bytes)));

  /** Last-resort hash if Web Crypto is missing. Not secure; marked "weak". */
  const weakHash = (text) => {
    let hash = 5381;
    for (let index = 0; index < text.length; index += 1) {
      hash = ((hash << 5) + hash + text.charCodeAt(index)) >>> 0;
    }
    return hash.toString(16);
  };

  const hashPassword = async (password, salt, alg) => {
    const algorithm = alg || (crypto.subtle ? "pbkdf2" : "weak");
    if (algorithm === "pbkdf2") {
      if (!crypto.subtle) return { alg: algorithm, hash: null };
      const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(password),
        "PBKDF2",
        false,
        ["deriveBits"],
      );
      const bits = await crypto.subtle.deriveBits(
        {
          name: "PBKDF2",
          salt: encoder.encode(salt),
          iterations: CONFIG.pbkdf2Iterations,
          hash: "SHA-256",
        },
        key,
        256,
      );
      return { alg: algorithm, hash: toHex(bits) };
    }
    return { alg: "weak", hash: weakHash(`${salt}:${password}`) };
  };

  const checkPassword = async (account, password) => {
    const { hash } = await hashPassword(password, account.salt, account.alg);
    return hash !== null && hash === account.hash;
  };

  /* ---------- accounts ---------- */

  const readAccounts = () => read(KEYS.accounts, {});
  const writeAccounts = (accounts) => write(KEYS.accounts, accounts);
  const getAccount = (email) => readAccounts()[normaliseEmail(email)] || null;

  const saveAccount = (account) => {
    const accounts = readAccounts();
    accounts[account.email] = account;
    writeAccounts(accounts);
  };

  const buildAccount = async ({ name, email, password, verified }) => {
    const salt = randomHex(16);
    const { alg, hash } = await hashPassword(password, salt);
    return {
      name: String(name).trim().replace(/\s+/g, " "),
      email: normaliseEmail(email),
      salt,
      alg,
      hash,
      verified: Boolean(verified),
      createdAt: now(),
    };
  };

  /* ---------- demo inbox + verification codes ---------- */

  const readInbox = () => read(KEYS.inbox, []);

  const sendMail = ({ to, subject, body, code }) => {
    const inbox = readInbox();
    inbox.unshift({
      id: `${now()}-${randomHex(3)}`,
      to: normaliseEmail(to),
      from: "flexform <no-reply@flexform.com>",
      subject,
      body,
      code: code || null,
      sentAt: now(),
    });
    write(KEYS.inbox, inbox.slice(0, CONFIG.inboxLimit));
  };

  /** Demo-inbox messages for one address, newest first. */
  const getInbox = (email) => {
    const address = normaliseEmail(email);
    return readInbox().filter((message) => message.to === address);
  };

  const readVerifications = () => read(KEYS.verification, {});

  const getVerification = (email) => {
    const record = readVerifications()[normaliseEmail(email)];
    return record || null;
  };

  const newCode = () => {
    // 6 digits, uniformly random.
    const value = crypto.getRandomValues(new Uint32Array(1))[0] % 1000000;
    return String(value).padStart(6, "0");
  };

  const secondsLeft = (until) => Math.max(0, Math.ceil((until - now()) / 1000));

  /**
   * Create a code and "email" it. Enforces a resend cooldown unless `force`.
   * Returns { ok, error?, retryInSeconds? }.
   */
  const sendVerificationCode = (email, { force = false } = {}) => {
    const address = normaliseEmail(email);
    const account = getAccount(address);
    if (!account) return { ok: false, error: "We couldn't find that account." };

    const existing = getVerification(address);
    if (!force && existing && now() < existing.lastSentAt + CONFIG.resendCooldownMs) {
      const retryInSeconds = secondsLeft(existing.lastSentAt + CONFIG.resendCooldownMs);
      return {
        ok: false,
        error: `Please wait ${retryInSeconds}s before requesting another code.`,
        retryInSeconds,
      };
    }

    const code = newCode();
    const records = readVerifications();
    records[address] = {
      code,
      expiresAt: now() + CONFIG.codeTtlMs,
      attempts: 0,
      lastSentAt: now(),
    };
    write(KEYS.verification, records);

    sendMail({
      to: address,
      subject: "Your flexform verification code",
      code,
      body:
        `Hi ${account.name.split(" ")[0]}, your flexform verification code is ${code}. ` +
        `It expires in ${CONFIG.codeTtlMs / 60000} minutes. ` +
        "If you didn't create an account, you can ignore this email.",
    });
    return { ok: true };
  };

  /** Seconds until another code may be requested (0 = now). */
  const resendWaitSeconds = (email) => {
    const record = getVerification(email);
    return record ? secondsLeft(record.lastSentAt + CONFIG.resendCooldownMs) : 0;
  };

  const verifyCode = (email, input) => {
    const address = normaliseEmail(email);
    const account = getAccount(address);
    const records = readVerifications();
    const record = records[address];
    const entered = String(input || "").replace(/\s+/g, "");

    if (!account) return { ok: false, error: "We couldn't find that account." };
    if (account.verified) return { ok: true };
    if (!record) {
      return { ok: false, error: "No active code. Request a new one.", expired: true };
    }
    if (now() > record.expiresAt) {
      return { ok: false, error: "That code has expired. Request a new one.", expired: true };
    }
    if (record.attempts >= CONFIG.maxCodeAttempts) {
      return {
        ok: false,
        error: "Too many incorrect attempts. Request a new code.",
        expired: true,
      };
    }
    if (!/^\d{6}$/.test(entered)) {
      return { ok: false, error: "Enter the 6-digit code from your email." };
    }

    if (entered !== record.code) {
      record.attempts += 1;
      write(KEYS.verification, records);
      const attemptsLeft = CONFIG.maxCodeAttempts - record.attempts;
      return {
        ok: false,
        attemptsLeft,
        error:
          attemptsLeft > 0
            ? `That code isn't right. ${attemptsLeft} ${attemptsLeft === 1 ? "attempt" : "attempts"} left.`
            : "Too many incorrect attempts. Request a new code.",
        expired: attemptsLeft <= 0,
      };
    }

    account.verified = true;
    saveAccount(account);
    delete records[address];
    write(KEYS.verification, records);
    return { ok: true };
  };

  /* ---------- sign up ---------- */

  /**
   * Validate and create an unverified account, then "email" a code.
   * Returns { ok: true, email } or { ok: false, errors: { field: message } }.
   */
  const register = async ({ name, email, password, confirm }) => {
    const errors = {};
    const nameError = validateName(name);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    if (nameError) errors.name = nameError;
    if (emailError) errors.email = emailError;
    if (passwordError) errors.password = passwordError;
    if (!passwordError) {
      if (!confirm) errors.confirm = "Confirm your password.";
      else if (password !== confirm) errors.confirm = "The passwords don't match.";
    }

    const address = normaliseEmail(email);
    const existing = emailError ? null : getAccount(address);
    if (existing && existing.verified) {
      errors.email = "An account with this email already exists. Try signing in.";
    }
    if (Object.keys(errors).length) return { ok: false, errors };

    // An unverified account for the same email is simply replaced.
    saveAccount(await buildAccount({ name, email: address, password, verified: false }));
    sendVerificationCode(address, { force: true });
    writeRaw(KEYS.pending, address, sessionStorage);
    return { ok: true, email: address };
  };

  /* ---------- login, lockout, sessions ---------- */

  const readAttempts = () => read(KEYS.attempts, {});

  /** Seconds left on a login lock for this email (0 = not locked). */
  const lockSeconds = (email) => {
    const entry = readAttempts()[normaliseEmail(email)];
    return entry && entry.lockedUntil ? secondsLeft(entry.lockedUntil) : 0;
  };

  const recordFailure = (address) => {
    const attempts = readAttempts();
    const entry = attempts[address] || { count: 0, lockedUntil: 0 };
    if (entry.lockedUntil && now() >= entry.lockedUntil) {
      entry.count = 0; // an expired lock starts a fresh count
      entry.lockedUntil = 0;
    }
    entry.count += 1;
    if (entry.count >= CONFIG.maxLoginAttempts) {
      entry.lockedUntil = now() + CONFIG.lockMs;
    }
    attempts[address] = entry;
    write(KEYS.attempts, attempts);
    return entry;
  };

  const clearFailures = (address) => {
    const attempts = readAttempts();
    delete attempts[address];
    write(KEYS.attempts, attempts);
  };

  const clearLegacyKeys = () => {
    remove(KEYS.loggedIn);
    remove(KEYS.name);
    remove(KEYS.email);
  };

  const startSession = (account, remember) => {
    write(KEYS.session, {
      email: account.email,
      remember: Boolean(remember),
      expiresAt: remember ? now() + CONFIG.rememberDays * 86400000 : null,
    });
    if (remember) remove(KEYS.tab, sessionStorage);
    else writeRaw(KEYS.tab, "true", sessionStorage);
    // Mirrors used by the rest of the site.
    writeRaw(KEYS.loggedIn, "true");
    writeRaw(KEYS.name, account.name);
    writeRaw(KEYS.email, account.email);
    remove(KEYS.pending, sessionStorage);
  };

  /** Sign in. Errors are deliberately vague so emails can't be probed. */
  const login = async ({ email, password, remember }) => {
    const errors = {};
    const emailError = validateEmail(email);
    if (emailError) errors.email = emailError;
    if (!password) errors.password = "Enter your password.";
    if (Object.keys(errors).length) return { ok: false, errors };

    const address = normaliseEmail(email);
    const locked = lockSeconds(address);
    if (locked) {
      return {
        ok: false,
        locked: true,
        secondsLeft: locked,
        error: `Too many failed attempts. Try again in ${locked}s.`,
      };
    }

    const account = getAccount(address);
    const passwordOk = account ? await checkPassword(account, password) : false;
    if (!passwordOk) {
      const entry = recordFailure(address);
      if (entry.lockedUntil && now() < entry.lockedUntil) {
        const wait = secondsLeft(entry.lockedUntil);
        return {
          ok: false,
          locked: true,
          secondsLeft: wait,
          error: `Too many failed attempts. Try again in ${wait}s.`,
        };
      }
      const attemptsLeft = CONFIG.maxLoginAttempts - entry.count;
      return {
        ok: false,
        attemptsLeft,
        error:
          attemptsLeft <= 2
            ? `Incorrect email or password. ${attemptsLeft} ${attemptsLeft === 1 ? "attempt" : "attempts"} left before a ${CONFIG.lockMs / 1000}-second lock.`
            : "Incorrect email or password.",
      };
    }

    clearFailures(address);

    if (!account.verified) {
      const existing = getVerification(address);
      if (!existing || now() > existing.expiresAt) {
        sendVerificationCode(address, { force: true });
      }
      writeRaw(KEYS.pending, address, sessionStorage);
      return { ok: false, needsVerification: true, email: address };
    }

    startSession(account, remember);
    return { ok: true, account };
  };

  /** Complete a signup after the code was accepted. */
  const signInVerified = (email, remember = false) => {
    const account = getAccount(email);
    if (!account || !account.verified) return false;
    clearFailures(account.email);
    startSession(account, remember);
    return true;
  };

  const logout = () => {
    remove(KEYS.session);
    remove(KEYS.tab, sessionStorage);
    remove(KEYS.pending, sessionStorage);
    clearLegacyKeys();
  };

  const currentSession = () => {
    const session = read(KEYS.session, null);
    if (!session || !session.email) return null;
    if (session.expiresAt && now() > session.expiresAt) return null;
    if (!session.remember && readRaw(KEYS.tab, sessionStorage) !== "true") return null;
    return getAccount(session.email) ? session : null;
  };

  const isLoggedIn = () => {
    if (currentSession()) return true;
    // Stale or legacy flags must not count as being signed in.
    if (readRaw(KEYS.loggedIn) !== null) {
      remove(KEYS.session);
      clearLegacyKeys();
    }
    return false;
  };

  const currentUser = () => {
    const session = currentSession();
    const account = session && getAccount(session.email);
    return account ? { name: account.name, email: account.email } : null;
  };

  /** Edit name / email from the profile page. Returns { ok } or { ok:false, errors }. */
  const updateAccount = (currentEmail, { name, email }) => {
    const errors = {};
    const nameError = validateName(name);
    const emailError = validateEmail(email);
    if (nameError) errors.name = nameError;
    if (emailError) errors.email = emailError;

    const from = normaliseEmail(currentEmail);
    const to = normaliseEmail(email);
    const account = getAccount(from);
    if (!account) errors.email = errors.email || "Sign in again to edit your profile.";
    if (!errors.email && to !== from && getAccount(to)) {
      errors.email = "Another account already uses this email.";
    }
    if (Object.keys(errors).length) return { ok: false, errors };

    const accounts = readAccounts();
    delete accounts[from];
    accounts[to] = { ...account, email: to, name: String(name).trim().replace(/\s+/g, " ") };
    writeAccounts(accounts);

    const session = read(KEYS.session, null);
    if (session) write(KEYS.session, { ...session, email: to });
    writeRaw(KEYS.name, accounts[to].name);
    writeRaw(KEYS.email, to);
    return { ok: true, account: accounts[to] };
  };

  /* ---------- demo account ---------- */

  const seedDemoAccount = async () => {
    if (getAccount(CONFIG.demo.email)) return;
    saveAccount(await buildAccount({ ...CONFIG.demo, verified: true }));
  };

  const ready = seedDemoAccount().catch(() => {});

  window.flexformAuth = {
    config: CONFIG,
    ready,
    // validation
    validateName,
    validateEmail,
    validatePassword,
    passwordChecks,
    passwordStrength,
    // flows
    register,
    sendVerificationCode,
    verifyCode,
    resendWaitSeconds,
    login,
    signInVerified,
    logout,
    updateAccount,
    // state
    isLoggedIn,
    currentUser,
    getAccount,
    getInbox,
    getVerification,
    lockSeconds,
    pendingEmail: () => readRaw(KEYS.pending, sessionStorage),
    setPendingEmail: (email) => writeRaw(KEYS.pending, normaliseEmail(email), sessionStorage),
    clearPendingEmail: () => remove(KEYS.pending, sessionStorage),
    normaliseEmail,
  };
})();
