import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { session, signIn } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (session) {
    return <Navigate to={location.state?.from ?? "/"} replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const { error } = await signIn(email, password);
    setSubmitting(false);
    if (error) setError(error.message);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center gap-3">
          <span className="h-9 w-3 rounded-full bg-pen" aria-hidden="true" />
          <h1 className="font-display text-3xl italic text-ink">Tosh note</h1>
        </div>

        <div className="relative rounded-page border border-paper-line bg-white/60 p-8 shadow-page">
          <span
            className="absolute inset-y-0 left-0 w-2 rounded-l-page bg-pen"
            aria-hidden="true"
          />
          <h2 className="font-display text-xl text-ink">Welcome back</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Log in to pick up where you left off.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-ink">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 w-full rounded-md border border-paper-line bg-white px-3 py-2 text-ink placeholder:text-ink-faint focus:border-pen"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-ink">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 w-full rounded-md border border-paper-line bg-white px-3 py-2 text-ink placeholder:text-ink-faint focus:border-pen"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="rounded-md bg-coral-pale px-3 py-2 text-sm text-coral">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-md bg-pen px-4 py-2.5 font-medium text-white transition hover:bg-pen-light disabled:opacity-60"
            >
              {submitting ? "Logging in…" : "Log in"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-ink-soft">
          New here?{" "}
          <Link to="/signup" className="font-medium text-pen hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
