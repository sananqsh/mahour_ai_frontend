import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchWithAuth } from "../../utils/jwt";

export interface AuthUser {
  id?: number;
  email?: string;
  name?: string;
  tier?: string;
  points?: number;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean, message?: string }>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const API_BASE_URL = 'http://localhost:8000';

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("access_token"));
  const [loading, setLoading] = useState(true);

  // Rehydrate on mount
  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = localStorage.getItem("access_token");
      if (storedToken) {
        setToken(storedToken);
        // Try to fetch user with stored token
        try {
          const resp = await fetchWithAuth(`${API_BASE_URL}/api/v1/dashboard/`, {
            headers: { Authorization: `Bearer ${storedToken}` }
          });
          if (resp.ok) {
            const data = await resp.json();
            setUser(data.user || { id: data.user_id || null });
          } else {
            // Token invalid, remove it
            setUser(null);
            setToken(null);
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
          }
        } catch {
          // Network error, act as logged out
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };
    restoreSession();
  }, []);

  // Actual login: sets token, fetches user, etc.
  const login = async (email: string, password: string) => {
    setLoading(true);
    const resp = await fetch(`${API_BASE_URL}/api/v1/accounts/auth/token/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    if (!resp.ok) throw new Error("Login failed");
    const data = await resp.json();
    // Save tokens
    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh_token", data.refresh);
    setToken(data.access);

    // You should fetch the user profile here:
    const u = await fetchWithAuth(`${API_BASE_URL}/api/v1/dashboard/`, {
      headers: { Authorization: `Bearer ${data.access}` }
    });
    if (u.ok) {
      const dash = await u.json();
      // If user info is in dash.user, pick it out (adjust to YOUR response structure)
      setUser(dash.user || { id: dash.user_id || null });
    // } else {
    //   setUser({ id: null });
    }

    setLoading(false);
  };

  // Signup: only shows a message; does NOT set token or user
  const signup = async (name: string, email: string, password: string) => {
    setLoading(true);
    const resp = await fetch(`${API_BASE_URL}/api/v1/accounts/auth/signup/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });
    const data = await resp.json();
    setLoading(false);
    if (!resp.ok) throw new Error(data.message || "Signup failed");
    // data: { message, user_id }
    return { success: true, message: data.message };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
