import { useAuth } from "../context/AuthContext";

export default function Topbar({ search, onSearchChange, onNewNote }) {
  const { user, signOut } = useAuth();

  return (
    <header className="flex items-center gap-4 border-b border-paper-line bg-paper/95 px-5 py-3.5 backdrop-blur">
      <div className="flex items-center gap-2.5">
        <span className="h-6 w-2 rounded-full bg-pen" aria-hidden="true" />
        <span className="font-display text-xl italic text-ink">Tosh note</span>
      </div>

      <div className="ml-2 flex-1 max-w-md">
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search your notes"
          aria-label="Search your notes"
          className="w-full rounded-md border border-paper-line bg-white/70 px-3 py-1.5 text-sm text-ink placeholder:text-ink-faint focus:border-pen"
        />
      </div>

      <button
        onClick={onNewNote}
        className="rounded-md bg-pen px-3.5 py-1.5 text-sm font-medium text-white transition hover:bg-pen-light"
      >
        New note
      </button>

      <div className="flex items-center gap-3 pl-2">
        <span className="hidden text-sm text-ink-soft sm:inline">{user?.email}</span>
        <button
          onClick={signOut}
          className="text-sm font-medium text-ink-soft transition hover:text-ink"
        >
          Log out
        </button>
      </div>
    </header>
  );
}
