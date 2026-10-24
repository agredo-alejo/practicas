import Link from "next/link";
import { getCategory, type Project } from "@/lib/projects";
import { Arrow } from "./icons";
import { Sketch } from "./sketch";

export function ProjectCard({ project, illustrated = false }: { project: Project; illustrated?: boolean }) {
  return <Link href={`/projects/${project.slug}/`} className={`project-card group ${illustrated ? "illustrated" : ""}`}>
    {illustrated && <div className={`project-art art-${project.category}`}><Sketch kind={project.folder} className="h-full w-full" /><span className="art-caption">CONCEPT SKETCH / {getCategory(project.category).short}</span></div>}
    <div className="card-body">
      <div className="mb-5 flex items-center justify-between gap-3"><span className="eyebrow">{getCategory(project.category).title}</span><span className="stage-label">0{project.stage}</span></div>
      <h3 className="card-title">{project.title}<Arrow className="card-arrow shrink-0" /></h3>
      <p className="mt-3 text-sm leading-relaxed text-muted">{project.description}</p>
      <div className="mt-6 flex flex-wrap items-center gap-2">{project.tags.map(tag => <span key={tag} className="tag">{tag}</span>)}{project.status !== "archived" && <span className={`status-label ${project.status === "incomplete" ? "status-incomplete" : ""}`}>{project.status === "incomplete" ? "Archive notes" : "Source study"}</span>}</div>
    </div>
  </Link>;
}
