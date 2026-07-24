import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { signup } from "../services/api/auth";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    organization_code: "",
    organization_name: "",
    full_name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const setField = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    const { organization_code, organization_name, full_name, email, password } =
      form;

    if (
      !organization_code ||
      !organization_name ||
      !full_name ||
      !email ||
      !password
    ) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      await signup(form);
      toast.success("Organization created. Welcome to Kamra ClimateOS!");
      navigate("/dashboard");
    } catch (error: any) {
      const detail =
        error.response?.data?.detail ?? "Signup failed. Please try again.";
      toast.error(detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="w-full max-w-md rounded-xl bg-white p-10 shadow-xl">
        <h1 className="text-3xl font-bold">Create Organization</h1>

        <p className="mt-2 text-slate-500">
          Start your Net Zero journey with Kamra ClimateOS
        </p>

        <input
          className="mt-8 w-full rounded-lg border p-3"
          placeholder="Organization Code (e.g. KES01)"
          value={form.organization_code}
          onChange={(e) => setField("organization_code", e.target.value)}
        />

        <input
          className="mt-4 w-full rounded-lg border p-3"
          placeholder="Organization Name"
          value={form.organization_name}
          onChange={(e) => setField("organization_name", e.target.value)}
        />

        <input
          className="mt-4 w-full rounded-lg border p-3"
          placeholder="Your Full Name"
          value={form.full_name}
          onChange={(e) => setField("full_name", e.target.value)}
        />

        <input
          type="email"
          className="mt-4 w-full rounded-lg border p-3"
          placeholder="Email Address"
          value={form.email}
          onChange={(e) => setField("email", e.target.value)}
        />

        <input
          type="password"
          className="mt-4 w-full rounded-lg border p-3"
          placeholder="Password (min 8 characters)"
          value={form.password}
          onChange={(e) => setField("password", e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />

        <button
          className="mt-6 w-full rounded-lg bg-blue-600 p-3 font-semibold text-white disabled:opacity-50"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Organization"}
        </button>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already registered?{" "}
          <Link to="/login" className="font-semibold text-blue-600">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
