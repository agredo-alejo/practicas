"use client";
import { useState } from "react";
import { useNotebook } from "@/lib/notebook";

export function ProjectNotes({ slug, title }: { slug: string; title: string }) {
  const { entries, update } = useNotebook();
  const note = typeof entries[slug]?.note === "string" ? entries[slug].note! : "";
  const pinned = entries[slug]?.pinned === true;
  const [persistent, setPersistent] = useState(true);
  const markdown = `# ${title}\n\n${note}\n`;
  return <section className="personal-notes" aria-labelledby="personal-notes-heading"><div className="flex flex-wrap items-center justify-between gap-3"><h2 id="personal-notes-heading" className="text-xl">A note to myself</h2><button type="button" className={`pin-button ${pinned ? "is-pinned" : ""}`} aria-pressed={pinned} onClick={() => setPersistent(update(slug, { pinned: !pinned }))}>{pinned ? "★ Pinned for later" : "☆ Pin for later"}</button></div><label htmlFor="personal-note" className="mt-3 block text-sm text-muted">What clicked? What’s still confusing? What would I try next?</label><textarea id="personal-note" rows={6} value={note} onChange={event => setPersistent(update(slug, { note: event.target.value }))} placeholder="Leave something for the next time I’m here…" /><div className="notes-footer"><p role="status">{persistent ? "Saved only in this browser. These notes aren’t published or synced." : "Browser storage is unavailable. This note is temporary—download it to keep it."}</p>{note.trim() && <a href={`data:text/markdown;charset=utf-8,${encodeURIComponent(markdown)}`} download={`${slug}-notes.md`}>Download note .md ↓</a>}</div></section>;
}
