"use client";

import { useRef, useState } from "react";
import type { Project } from "@/lib/projects";
import { Sketch } from "./sketch";
import { External } from "./icons";

export function DemoViewer({ project }: { project: Project }) {
  const [running, setRunning] = useState(false);
  const [session, setSession] = useState(0);
  const container = useRef<HTMLDivElement>(null);
  const [fullscreenError, setFullscreenError] = useState(false);
  if (!project.demo) return <div className="source-preview"><Sketch kind={project.folder} className="mx-auto max-w-lg" /><div className="p-8 pt-0 text-center"><p className="eyebrow mb-3">Source study</p><h2 className="text-2xl">Some ideas live in the code.</h2><p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-muted">This entry is a library, asset collection, or console experiment. Explore its original files below.</p></div></div>;

  return <div ref={container} className="demo-container">
    <div className="demo-toolbar flex flex-wrap items-center justify-between gap-3"><span className="flex items-center gap-2 font-mono text-xs"><span className={`demo-dot ${running ? "running" : ""}`} />{running ? "ORIGINAL DEMO" : "READY TO EXPLORE"}</span><div className="flex flex-wrap items-center gap-4 text-xs">{running && <><button type="button" onClick={() => setSession(session + 1)}>Restart ↻</button><button type="button" onClick={() => setRunning(false)}>Stop ■</button><button type="button" onClick={async () => { try { await container.current?.requestFullscreen(); setFullscreenError(false); } catch { setFullscreenError(true); } }}>Fullscreen ⛶</button></>}<a href={project.demo} target="_blank" rel="noreferrer" className="flex items-center gap-2">Open original <External /></a></div></div>
    {running ? <iframe key={session} title={`${project.title} — original interactive demo`} src={project.demo} sandbox="allow-scripts allow-same-origin allow-forms allow-pointer-lock allow-popups" className="demo-frame" /> : <div className="demo-placeholder"><Sketch kind={project.folder} className="demo-sketch" /><div className="demo-launch"><span className="eyebrow mb-4 block">THE ORIGINAL EXPERIMENT</span><h2 className="mb-6 text-2xl font-semibold">{project.title}</h2><button type="button" className="button button-dark" onClick={() => setRunning(true)}><span aria-hidden="true">▷</span> {project.status === "incomplete" ? "Try the archived demo" : "Run the experiment"}</button><p className="mt-5 text-xs text-muted">Loads on demand. Stop or restart at any time.</p></div></div>}
    <div className="demo-footnote">{fullscreenError ? "Fullscreen isn’t available here. Use “Open original” for a larger view." : "Original controls vary by experiment. Click or tap inside the demo to interact; open the source for details."}</div>
  </div>;
}
