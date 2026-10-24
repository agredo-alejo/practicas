import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, getProject, getCategory, relatedProjects, sourceUrl, stages } from "@/lib/projects";
import { DemoViewer } from "@/components/demo-viewer";
import { ProjectCard } from "@/components/project-card";
import { ProjectNotes } from "@/components/project-notes";
import { External, Github } from "@/components/icons";

export const dynamicParams = false;
export function generateStaticParams() { return projects.map(project => ({ slug: project.slug })); }
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> { const { slug } = await params; const project = getProject(slug); return { title: project?.folder.split("/").at(-1) ?? "Entry not found", description: project?.description }; }

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const stage = stages.find(item => item.id === project.stage)!;
  const related = relatedProjects(project);
  return <main id="main" className="shell"><section className="project-intro"><Link href="/#projects" className="eyebrow">← Back to the archive</Link><div className="mb-4 mt-8 flex flex-wrap items-center gap-3"><span className="eyebrow">{getCategory(project.category).title}</span><span className="text-line">/</span><Link className="eyebrow" href={`/journey/#stage-${project.stage}`}>{stage.eyebrow}</Link>{project.nested && <span className="tag">↳ neuralnet collection</span>}</div><h1>{project.folder.split("/").at(-1)}</h1><div className="mt-5 flex flex-wrap items-start justify-between gap-6"><p className="max-w-2xl text-sm leading-7 text-muted">{project.description}</p><a className="button button-outline" href={sourceUrl(project)} target="_blank" rel="noreferrer"><Github /> Source <External /></a></div><div className="mt-4 flex flex-wrap gap-2">{project.tags.map(tag => <span className="tag" key={tag}>{tag}</span>)}</div></section>
    {project.issues.length > 0 && <aside className="archive-note mb-6" aria-label="Archive notes"><h2 className="text-sm font-semibold">Missing from this folder</h2><p className="mb-3 mt-2 text-xs leading-6">A few references point to files I don’t have in the archive. This sketch might not run completely; the code is still here.</p><details><summary className="cursor-pointer text-xs underline underline-offset-4">Missing references ({project.issues.length})</summary><ul className="mt-3 list-inside list-disc break-all font-mono text-xs leading-6">{project.issues.map(issue => <li key={issue}>{issue}</li>)}</ul></details></aside>}
    <DemoViewer project={project} />
    <div className="project-context grid gap-12 py-10 lg:grid-cols-[1fr_1.35fr]"><section><p className="eyebrow mb-3">A connection</p><h2>{stage.title}</h2><p className="mb-4 mt-4 text-sm leading-7 text-muted">{stage.description}</p><Link href={`/journey/#stage-${stage.id}`} className="text-link">See the other connections ↗</Link><dl className="project-facts mt-6"><div><dt>Folder</dt><dd className="break-all font-mono">{project.folder}</dd></div><div><dt>Entry</dt><dd>{project.status === "source" ? "Source / console" : project.status === "incomplete" ? "Some files missing" : project.status === "linked" ? "Linked project" : "Original experiment"}</dd></div></dl></section><section><div className="mb-3 flex items-center justify-between gap-4"><h2 className="eyebrow">Files</h2><span className="font-mono text-xs text-muted">{project.files.length}</span></div><details className="source-files" open><summary className="cursor-pointer p-4 text-xs">Browse source files on GitHub</summary><ul className="file-list">{project.files.map(file => <li key={file}><a href={sourceUrl(project, file)} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-4 px-4 py-3"><span className="min-w-0 break-all font-mono text-xs">{file}</span><External className="shrink-0" /></a></li>)}</ul></details></section></div>
    <ProjectNotes slug={project.slug} title={project.title} />
    {related.length > 0 && <section className="mb-12 border-t border-line pt-8"><div className="section-heading"><h2>Nearby ideas</h2></div><div className="grid gap-4 md:grid-cols-3">{related.map(item => <ProjectCard project={item} key={item.slug} />)}</div></section>}
  </main>;
}
