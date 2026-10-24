"use client";

import { useDeferredValue, useState } from "react";
import { categories, stages, type Project } from "@/lib/projects";
import { ProjectCard } from "./project-card";

export function ProjectExplorer({ projects }: { projects: Project[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [stage, setStage] = useState("all");
  const [order, setOrder] = useState("stage");
  const search = useDeferredValue(query.trim().toLowerCase());
  const filtered = projects.filter(project => (category === "all" || category === project.category)
    && (stage === "all" || Number(stage) === project.stage)
    && `${project.title} ${project.description} ${project.folder} ${project.tags.join(" ")}`.toLowerCase().includes(search))
    .sort((a, b) => order === "name" ? a.title.localeCompare(b.title) : a.stage - b.stage || a.title.localeCompare(b.title));
  const active = query || category !== "all" || stage !== "all";
  function reset() { setQuery(""); setCategory("all"); setStage("all"); }

  return <div>
    <div className="explorer-toolbar flex flex-col gap-4 lg:flex-row lg:items-center">
      <label className="search-field flex min-w-0 flex-1 items-center gap-3"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></svg><span className="sr-only">Search projects</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search an idea, project, or skill…" className="w-full bg-transparent outline-none" /></label>
      <div className="flex flex-wrap items-center gap-3">
        <label className="select-field"><span className="sr-only">Filter by learning stage</span><select value={stage} onChange={event => setStage(event.target.value)}><option value="all">Every learning stage</option>{stages.map(item => <option key={item.id} value={item.id}>0{item.id} · {item.title}</option>)}</select></label>
        <label className="select-field"><span className="sr-only">Sort projects</span><select value={order} onChange={event => setOrder(event.target.value)}><option value="stage">Learning order</option><option value="name">Alphabetically</option></select></label>
      </div>
    </div>
    <div className="category-tabs flex flex-wrap gap-2" aria-label="Project categories"><button type="button" aria-pressed={category === "all"} onClick={() => setCategory("all")} className={category === "all" ? "active" : ""}>All projects <span>{projects.length}</span></button>{categories.map(item => <button key={item.id} type="button" aria-pressed={category === item.id} onClick={() => setCategory(item.id)} className={category === item.id ? "active" : ""}>{item.title}<span>{projects.filter(project => project.category === item.id).length}</span></button>)}</div>
    <div className="mb-5 flex min-h-8 items-center justify-between gap-4"><p className="font-mono text-xs text-muted" role="status" aria-live="polite">{filtered.length} {filtered.length === 1 ? "entry" : "entries"}{active ? " found" : " / the complete collection"}</p>{active && <button type="button" onClick={reset} className="text-sm underline underline-offset-4">Clear filters ×</button>}</div>
    {filtered.length ? <div className="project-grid grid gap-4 md:grid-cols-2 xl:grid-cols-3">{filtered.map(project => <ProjectCard key={project.slug} project={project} />)}</div> : <div className="empty-state py-20 text-center"><h3 className="text-2xl font-semibold">No experiments here yet.</h3><p className="mb-6 mt-3 text-muted">Try another search or open up the filters.</p><button className="button button-dark" onClick={reset} type="button">Show all projects</button></div>}
  </div>;
}
