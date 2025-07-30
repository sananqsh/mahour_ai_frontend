import React, { createContext, useContext, useState } from "react";

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  tier?: string;
  points?: number;
}

interface AuthContextValue {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (first_name: string, last_name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  token: string | null;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const API_BASE_URL = 'http://localhost:8000';

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("access_token"));

  // Attach token to all future fetches if needed. (axios interceptors can work too)

  const login = async (email: string, password: string) => {
    // Call your backend login endpoint
    const resp = await fetch(`${API_BASE_URL}/api/v1/accounts/auth/token/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });
    if (!resp.ok) throw new Error("Login failed");
    const data = await resp.json();
    setToken(data.access);
    setUser(data.user);
    localStorage.setItem("access_token", data.access);
    // You may want to also persist refresh token (if sent)
  };

  const signup = async (first_name: string, last_name: string, email: string, password: string) => {
    const resp = await fetch(`${API_BASE_URL}/api/v1/accounts/auth/register/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ first_name, last_name, email, password })
    });
    if (!resp.ok) throw new Error("Signup failed");
    const data = await resp.json();
    setToken(data.access);
    setUser(data.user);
    localStorage.setItem("access_token", data.access);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("access_token");
  };

  return (
    <AuthContext.Provider value={{user, login, signup, logout, token}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
