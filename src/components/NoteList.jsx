function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function preview(body) {
  const trimmed = body.trim();
  return trimmed.length > 0 ? trimmed.slice(0, 70) : "No content yet";
}

export default function NoteList({ notes, selectedId, onSelect, onDelete, loading }) {
  if (loading) {
    return (
      <div className="px-4 py-6 text-sm text-ink-soft">Loading your notes…</div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="px-4 py-8 text-center">
        <p className="font-display text-lg italic text-ink-soft">
          A blank notebook
        </p>
        <p className="mt-1 text-sm text-ink-faint">
          Click "New note" to write your first page.
        </p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-paper-line">
      {notes.map((note) => {
        const active = note.id === selectedId;
        return (
          <li key={note.id} className="group relative">
            <button
              onClick={() => onSelect(note.id)}
              className={`block w-full px-4 py-3 text-left transition ${
                active ? "bg-pen-pale" : "hover:bg-paper-deep"
              }`}
            >
              <p className="truncate pr-6 font-display text-base text-ink">
                {note.title.trim() || "Untitled"}
              </p>
              <p className="mt-0.5 truncate text-sm text-ink-soft">
                {preview(note.body)}
              </p>
              <p className="mt-1 text-xs text-ink-faint">
                {formatDate(note.created_at)}
              </p>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(note.id);
              }}
              aria-label={`Delete ${note.title.trim() || "Untitled"}`}
              className="absolute right-3 top-3 rounded px-1.5 py-0.5 text-xs text-ink-faint opacity-0 transition hover:bg-coral-pale hover:text-coral focus-visible:opacity-100 group-hover:opacity-100"
            >
              Delete
            </button>
          </li>
        );
      })}
    </ul>
  );
}
