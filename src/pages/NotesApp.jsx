import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../context/AuthContext";
import Topbar from "../components/Topbar";
import NoteList from "../components/NoteList";
import NoteEditor from "../components/NoteEditor";

export default function NotesApp() {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadNotes() {
      setLoading(true);
      // RLS on the "notes" table means this only ever returns rows where
      // user_id = auth.uid() — no need to filter by user here ourselves.
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .order("created_at", { ascending: false });

      if (ignore) return;

      if (error) {
        setErrorMsg(error.message);
      } else {
        setNotes(data);
        if (data.length > 0) setSelectedId((prev) => prev ?? data[0].id);
      }
      setLoading(false);
    }

    loadNotes();
    return () => {
      ignore = true;
    };
  }, [user.id]);

  const filteredNotes = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter(
      (n) => n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q)
    );
  }, [notes, search]);

  const selectedNote = notes.find((n) => n.id === selectedId) ?? null;

  async function handleNewNote() {
    const { data, error } = await supabase
      .from("notes")
      .insert({ user_id: user.id, title: "", body: "" })
      .select()
      .single();

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    setNotes((prev) => [data, ...prev]);
    setSelectedId(data.id);
    setSearch("");
  }

  async function handleSave(id, { title, body }) {
    // Optimistic local update so the sidebar reflects edits immediately.
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, title, body } : n))
    );

    const { error } = await supabase
      .from("notes")
      .update({ title, body })
      .eq("id", id);

    if (error) setErrorMsg(error.message);
  }

  async function handleDelete(id) {
    const confirmed = window.confirm("Delete this note? This can't be undone.");
    if (!confirmed) return;

    const previous = notes;
    const next = notes.filter((n) => n.id !== id);
    setNotes(next);
    if (selectedId === id) {
      setSelectedId(next[0]?.id ?? null);
    }

    const { error } = await supabase.from("notes").delete().eq("id", id);
    if (error) {
      setErrorMsg(error.message);
      setNotes(previous); // roll back on failure
    }
  }

  return (
    <div className="flex h-screen flex-col bg-paper">
      <Topbar search={search} onSearchChange={setSearch} onNewNote={handleNewNote} />

      {errorMsg && (
        <div className="border-b border-coral/20 bg-coral-pale px-5 py-2 text-sm text-coral">
          {errorMsg}
          <button onClick={() => setErrorMsg("")} className="ml-3 underline">
            Dismiss
          </button>
        </div>
      )}

      <div className="flex min-h-0 flex-1">
        <aside className="w-72 shrink-0 overflow-y-auto border-r border-paper-line bg-paper-deep/40">
          <NoteList
            notes={filteredNotes}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onDelete={handleDelete}
            loading={loading}
          />
        </aside>

        <main className="flex-1 overflow-y-auto">
          {selectedNote ? (
            <NoteEditor key={selectedNote.id} note={selectedNote} onSave={handleSave} onDelete={handleDelete} />
          ) : (
            !loading && (
              <div className="flex h-full flex-col items-center justify-center px-6 text-center">
                <p className="font-display text-2xl italic text-ink-soft">
                  Nothing selected
                </p>
                <p className="mt-2 max-w-xs text-sm text-ink-faint">
                  Pick a note from the list, or start a new page.
                </p>
              </div>
            )
          )}
        </main>
      </div>
    </div>
  );
}
