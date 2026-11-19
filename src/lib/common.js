/*
 * common.js — the window.flexform helper from the original common.js.
 * Only the data helpers live here; DOM visibility (auth-only / guest-only,
 * header chip, greeting) is handled by React components.
 */
const NAME_KEY = "flexformUserName";
const EMAIL_KEY = "flexformUserEmail";
const DEFAULT_NAME = "Friend";

const read = (key) => {
  try { return localStorage.getItem(key); } catch { return null; }
};

const isLoggedIn = () => Boolean(window.flexformAuth?.isLoggedIn());

const getStoredUserName = () => read(NAME_KEY)?.trim() || DEFAULT_NAME;

const getUserInitials = (name = getStoredUserName()) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("") || "F";

const getFirstName = (name = getStoredUserName()) =>
  name.split(/\s+/)[0] || DEFAULT_NAME;

/** localStorage key for per-user mock data, e.g. "flexform:sam@x.com:savedCoaches". */
const userKey = (kind) => `flexform:${read(EMAIL_KEY) || "guest"}:${kind}`;

export const flexform = { userKey, isLoggedIn, getStoredUserName, getUserInitials, getFirstName };
window.flexform = flexform;
export default flexform;
