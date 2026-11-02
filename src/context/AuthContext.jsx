import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { flexformAuth } from "../lib/auth.js";
import { flexformUsers } from "../lib/user-store.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    if (flexformAuth.isLoggedIn()) {
      const u = flexformAuth.currentUser();
      setUser(u);
    } else {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    // Wait for demo account seeding
    flexformAuth.ready.then(() => {
      refresh();
      setLoading(false);
    });
  }, [refresh]);

  // Listen for storage changes (other tabs)
  useEffect(() => {
    const onStorage = () => refresh();
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [refresh]);

  const login = async ({ email, password, remember }) => {
    const result = await flexformAuth.login({ email, password, remember });
    if (result.ok) {
      setUser(result.account ? { name: result.account.name, email: result.account.email } : flexformAuth.currentUser());
    }
    return result;
  };

  const logout = () => {
    flexformAuth.logout();
    setUser(null);
  };

  const updateProfile = (currentEmail, { name, email }) => {
    const result = flexformAuth.updateAccount(currentEmail, { name, email });
    if (result.ok) {
      flexformUsers.renameEmail(currentEmail, email);
      flexformUsers.setName(email, result.account.name);
      setUser({ name: result.account.name, email: result.account.email });
    }
    return result;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateProfile, refresh, isLoggedIn: flexformAuth.isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}