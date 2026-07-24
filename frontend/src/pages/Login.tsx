import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { login } from "../services/api/auth";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      toast.error("Please enter email and password.");
      return;
    }

    setLoading(true);

    try {
      await login(email, password);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (error: any) {
      const detail =
        error.response?.data?.detail ?? "Login failed. Please try again.";
      toast.error(detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="w-full max-w-md rounded-xl bg-white p-10 shadow-xl">
        <h1 className="text-3xl font-bold">Kamra ClimateOS Login</h1>

        <p className="mt-2 text-slate-500">
          Net Zero &amp; ESG Intelligence Platform
        </p>

        <input
          className="mt-8 w-full rounded-lg border p-3"
          placeholder="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="mt-4 w-full rounded-lg border p-3"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />

        <button
          className="mt-6 w-full rounded-lg bg-blue-600 p-3 font-semibold text-white disabled:opacity-50"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p className="mt-6 text-center text-sm text-slate-500">
          New organization?{" "}
          <Link to="/signup" className="font-semibold text-blue-600">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
