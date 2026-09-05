# Tosh note

A calm, distraction-free notes app. React + Vite + Tailwind CSS on the
frontend, Supabase for email/password auth and storage. Every note is
locked to the person who wrote it with Postgres Row Level Security — not
just app-level filtering — so one user can never read, edit, or delete
another user's notes, even via a direct API call.

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. In **Project Settings -> API**, copy the **Project URL** and the
   **anon public** key. You'll need both in step 3.
3. In **Authentication -> Providers**, make sure **Email** is enabled
   (it is by default).
   - Optional: in **Authentication -> Settings**, you can turn off
     "Confirm email" while developing, so new accounts can log in
     immediately without clicking a confirmation link. Leave it on
     for production.

## 2. Set up the database

1. Open **SQL Editor** in your Supabase project.
2. Paste in the contents of [`supabase/schema.sql`](./supabase/schema.sql)
   and run it.

This creates a `notes` table with columns `id`, `user_id`, `title`,
`body`, `created_at`, `updated_at`, and turns on Row Level Security with
four policies (select/insert/update/delete) that all require
`auth.uid() = user_id`. That check runs inside Postgres itself, so it
applies no matter what client makes the request.

## 3. Configure the app

```bash
cp .env.example .env
```

Fill in `.env` with the Project URL and anon key from step 1:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

The anon key is safe to ship in frontend code — it identifies the
project, not a privileged user. Row Level Security is what actually
protects the data.

## 4. Install and run

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`. Sign up with an email and
password, log in, and start writing.

To build for production:

```bash
npm run build
npm run preview   # preview the production build locally
```

Deploy the contents of `dist/` to any static host (Vercel, Netlify,
Cloudflare Pages, etc.) and set the same two environment variables
there.

## How the pieces fit together

- `src/lib/supabaseClient.js` — one shared Supabase client, configured
  from the env vars above.
- `src/context/AuthContext.jsx` — tracks the current session, exposes
  `signUp`, `signIn`, `signOut`.
- `src/components/ProtectedRoute.jsx` — redirects to `/login` if
  there's no session.
- `src/pages/Login.jsx`, `src/pages/Signup.jsx` — email/password forms.
- `src/pages/NotesApp.jsx` — loads the signed-in user's notes, and
  handles create / autosave / delete.
- `src/components/NoteList.jsx`, `src/components/NoteEditor.jsx` — the
  sidebar list and the page-style editor, with autosave ~600ms after
  you stop typing.
- `supabase/schema.sql` — table definition and RLS policies.

## Notes on security

- Every read/write goes straight from the browser to Supabase using the
  anon key — there's no custom backend in between.
- Because RLS is enabled and `force row level security` is set, no
  query against `notes` — from this app, from `curl`, or from the
  Supabase table editor as another user — can return or modify a row
  that doesn't belong to the requester. The app-level `.eq("user_id", …)`
  filters you'd see in some tutorials aren't needed here; the database
  enforces it directly.
