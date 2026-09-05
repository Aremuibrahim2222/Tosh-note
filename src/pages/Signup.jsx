import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { session, signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [checkInbox, setCheckInbox] = useState(false);

  if (session) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);
    const { data, error } = await signUp(email, password);
    setSubmitting(false);

    if (error) {
      setError(error.message);
      return;
    }

    // If email confirmation is on, Supabase returns a user with no session yet.
    if (data.user && !data.session) {
      setCheckInbox(true);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center gap-3">
          <span className="h-9 w-3 rounded-full bg-moss" aria-hidden="true" />
          <h1 className="font-display text-3xl italic text-ink">Tosh note</h1>
        </div>

        <div className="relative rounded-page border border-paper-line bg-white/60 p-8 shadow-page">
          <span
            className="absolute inset-y-0 left-0 w-2 rounded-l-page bg-moss"
            aria-hidden="true"
          />

          {checkInbox ? (
            <>
              <h2 className="font-display text-xl text-ink">Almost there</h2>
              <p className="mt-2 text-sm text-ink-soft">
                We sent a confirmation link to <strong className="text-ink">{email}</strong>.
                Follow it to activate your account, then log in.
              </p>
              <Link
                to="/login"
                className="mt-6 inline-block rounded-md bg-ink px-4 py-2.5 text-sm font-medium text-white transition hover:bg-ink/90"
              >
                Back to log in
              </Link>
            </>
          ) : (
            <>
              <h2 className="font-display text-xl text-ink">Start your notebook</h2>
              <p className="mt-1 text-sm text-ink-soft">
                A calm, private place for your notes.
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
                    className="mt-1.5 w-full rounded-md border border-paper-line bg-white px-3 py-2 text-ink placeholder:text-ink-faint focus:border-moss"
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
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1.5 w-full rounded-md border border-paper-line bg-white px-3 py-2 text-ink placeholder:text-ink-faint focus:border-moss"
                    placeholder="At least 6 characters"
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
                  className="w-full rounded-md bg-moss px-4 py-2.5 font-medium text-white transition hover:bg-moss/90 disabled:opacity-60"
                >
                  {submitting ? "Creating account…" : "Create account"}
                </button>
              </form>
            </>
          )}
        </div>

        {!checkInbox && (
          <p className="mt-6 text-center text-sm text-ink-soft">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-moss hover:underline">
              Log in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
