import { useEffect, useRef, useState } from "react";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function NoteEditor({ note, onSave, onDelete }) {
  const [title, setTitle] = useState(note.title);
  const [body, setBody] = useState(note.body);
  const [status, setStatus] = useState("saved"); // "saved" | "saving" | "unsaved"
  const debounceRef = useRef(null);
  const noteId = note.id;

  // Reset local draft whenever a different note is selected.
  useEffect(() => {
    setTitle(note.title);
    setBody(note.body);
    setStatus("saved");
  }, [noteId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (title === note.title && body === note.body) return;

    setStatus("unsaved");
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setStatus("saving");
      await onSave(noteId, { title, body });
      setStatus("saved");
    }, 600);

    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, body]);

  return (
    <div className="mx-auto max-w-2xl px-6 py-8 sm:px-10">
      <div className="relative overflow-hidden rounded-page border border-paper-line bg-white shadow-page">
        <span className="absolute inset-y-0 left-0 w-2 bg-pen" aria-hidden="true" />

        <div className="px-8 pb-2 pt-7 sm:px-12">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled"
            aria-label="Note title"
            className="w-full border-none bg-transparent font-display text-2xl text-ink placeholder:text-ink-faint focus:outline-none focus-visible:outline-none"
          />

          <div className="mt-1.5 flex items-center justify-between text-xs text-ink-faint">
            <span>{formatDate(note.created_at)}</span>
            <span className="italic">
              {status === "saving" && "Saving…"}
              {status === "saved" && "Saved"}
              {status === "unsaved" && "Editing…"}
            </span>
          </div>
        </div>

        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Start writing…"
          aria-label="Note body"
          rows={16}
          className="ruled-page w-full resize-none border-none bg-transparent px-8 pb-8 pt-3 leading-[2.15rem] text-ink placeholder:text-ink-faint focus:outline-none sm:px-12"
        />
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={() => onDelete(noteId)}
          className="text-sm font-medium text-ink-faint transition hover:text-coral"
        >
          Delete this note
        </button>
      </div>
    </div>
  );
}
