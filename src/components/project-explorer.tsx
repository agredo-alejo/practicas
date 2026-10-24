"use client";
import { useDeferredValue, useState } from "react";
import { categories, stages, getCategory, type Project } from "@/lib/projects";
import { useNotebook } from "@/lib/notebook";
import Link from "next/link";

export function ProjectExplorer({ projects }: { projects: Project[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [stage, setStage] = useState("all");
  const [order, setOrder] = useState("stage");
  const [pinnedOnly, setPinnedOnly] = useState(false);
  const { entries, update } = useNotebook();
  const search = useDeferredValue(query.trim().toLowerCase());
  const filtered = projects.filter(project => (category === "all" || category === project.category)
    && (stage === "all" || Number(stage) === project.stage)
    && (!pinnedOnly || entries[project.slug]?.pinned === true)
    && `${project.title} ${project.description} ${project.folder} ${project.tags.join(" ")}`.toLowerCase().includes(search))
    .sort((a, b) => order === "name" ? a.folder.localeCompare(b.folder) : a.stage - b.stage || a.folder.localeCompare(b.folder));
  const active = query || category !== "all" || stage !== "all" || pinnedOnly;
  const pinCount = projects.filter(project => entries[project.slug]?.pinned === true).length;
  function reset() { setQuery(""); setCategory("all"); setStage("all"); setPinnedOnly(false); }

  return <div className="explorer-layout">
    <aside className="archive-sidebar"><p className="eyebrow mb-4">Browse by subject</p><div className="category-tabs" aria-label="Project categories"><button type="button" aria-pressed={category === "all"} onClick={() => setCategory("all")} className={category === "all" ? "active" : ""}>Everything <span>{projects.length}</span></button>{categories.map(item => <button key={item.id} type="button" aria-pressed={category === item.id} onClick={() => setCategory(item.id)} className={category === item.id ? "active" : ""}>{item.title}<span>{projects.filter(project => project.category === item.id).length}</span></button>)}</div><button type="button" className={`pinned-filter ${pinnedOnly ? "active" : ""}`} aria-pressed={pinnedOnly} onClick={() => setPinnedOnly(!pinnedOnly)}><span>☆ Pinned for later</span><span>{pinCount}</span></button><p className="sidebar-note">Pins and personal notes stay in this browser. The original experiments stay in the archive.</p></aside>
    <div className="archive-entries">
      <div className="explorer-toolbar"><label className="search-field"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></svg><span className="sr-only">Search projects</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Find a project, idea, or old folder…" /></label><div className="filter-selects"><label className="select-field"><span className="sr-only">Filter by learning stage</span><select value={stage} onChange={event => setStage(event.target.value)}><option value="all">All connections</option>{stages.map(item => <option key={item.id} value={item.id}>0{item.id} · {item.eyebrow}</option>)}</select></label><label className="select-field"><span className="sr-only">Sort projects</span><select value={order} onChange={event => setOrder(event.target.value)}><option value="stage">Concept order</option><option value="name">Folder A–Z</option></select></label></div></div>
      <div className="entries-status"><p className="font-mono text-xs text-muted" role="status" aria-live="polite">{filtered.length} {filtered.length === 1 ? "entry" : "entries"}{active ? " found" : " / sketches, experiments, loose ends"}</p>{active && <button type="button" onClick={reset}>Reset filters ×</button>}</div>
      {filtered.length ? <div className="project-list">{filtered.map(project => { const pinned = entries[project.slug]?.pinned === true; return <article className="project-row" key={project.slug}><button type="button" className={`row-pin ${pinned ? "is-pinned" : ""}`} aria-pressed={pinned} aria-label={`${pinned ? "Unpin" : "Pin"} ${project.folder}`} onClick={() => update(project.slug, { pinned: !pinned })}>{pinned ? "★" : "☆"}</button><Link href={`/projects/${project.slug}/`} className="row-main"><div className="row-top"><h3>{project.folder.split("/").at(-1)}</h3><span className="row-category">{getCategory(project.category).title}</span></div><p className="row-description">{project.description}</p><div className="row-meta"><span className="row-concepts">{project.tags.join(" / ")}</span>{project.nested && <span>↳ neuralnet collection</span>}{project.status === "source" && <span>source only</span>}{project.status === "incomplete" && <span className="status-incomplete">missing files</span>}{project.status === "linked" && <span>linked project ↗</span>}{entries[project.slug]?.note && <span className="note-indicator">has a note</span>}</div></Link><Link href={`/projects/${project.slug}/`} className="row-open" aria-label={`Open ${project.folder}`}>↗</Link></article>; })}</div> : <div className="empty-state"><h3>{pinnedOnly ? "Nothing pinned with these filters." : "No entries here."}</h3><p>Try another subject or clear the search.</p><button className="button button-outline mt-5" onClick={reset} type="button">Show everything</button></div>}
    </div>
  </div>;
}
