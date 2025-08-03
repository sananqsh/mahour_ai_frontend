import React, { useState } from "react";
import { useAuth } from "../../contexts/";

type Mode = "login" | "signup";

export const AuthModal: React.FC = () => {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [signupMsg, setSignupMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === "login") {
      try {
        await login(email, password);
        // Now dashboard will load automatically thanks to AuthContext
      } catch (err: any) {
        setError(err?.message || "Login failed");
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const res: any = await signup(name, email, password);
        setSignupMsg(res.message);  // Show the message "Please verify with OTP..."
        // Switch to login after 2s, prefilling email:
        setTimeout(() => {
          setSignupMsg(null);
          setMode("login");
        }, 2000);
      } catch (err: any) {
        setError(err?.message || "Signup failed");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl p-8 shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent">
          {mode === "login" ? "Sign in to your account" : "Create a new account"}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === "signup" && (
            <input
              className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Full Name"
              value={name}
              onChange={e => setName(e.target.value)}
              autoFocus
            />
          )}
          <input
            className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {signupMsg && <div className="text-green-600 text-sm">{signupMsg}</div>}
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-blue-600 to-purple-500 text-white rounded py-2 font-semibold hover:brightness-110 transition"
          >
            {loading
              ? "Processing..."
              : mode === "login"
                ? "Login"
                : "Sign up"}
          </button>
        </form>
        <div className="mt-4 text-center text-sm">
          {mode === "login" ? (
            <>
              New here?{" "}
              <button
                onClick={() => setMode("signup")}
                className="text-blue-600 hover:underline font-medium"
              >
                Create an account
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setMode("login")}
                className="text-blue-600 hover:underline font-medium"
              >
                Log in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
