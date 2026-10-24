import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, getProject, getCategory, relatedProjects, sourceUrl, stages } from "@/lib/projects";
import { DemoViewer } from "@/components/demo-viewer";
import { ProjectCard } from "@/components/project-card";
import { External, Github } from "@/components/icons";

export const dynamicParams = false;
export function generateStaticParams() { return projects.map(project => ({ slug: project.slug })); }
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  return { title: project?.title ?? "Project not found", description: project?.description };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const stage = stages.find(item => item.id === project.stage)!;
  const related = relatedProjects(project);
  return <main id="main" className="shell">
    <section className="project-intro"><Link href="/#projects" className="eyebrow text-muted">← All experiments</Link><div className="mb-5 mt-10 flex flex-wrap items-center gap-3"><span className="eyebrow">{getCategory(project.category).title}</span><span className="text-line">/</span><Link className="eyebrow text-muted" href={`/journey/#stage-${project.stage}`}>Chapter 0{project.stage}</Link>{project.nested && <span className="tag">From the neural network collection</span>}</div><h1>{project.title}</h1><div className="mt-6 flex flex-wrap items-start justify-between gap-6"><p className="max-w-2xl text-lg leading-relaxed text-muted">{project.description}</p><a className="button button-outline" href={sourceUrl(project)} target="_blank" rel="noreferrer"><Github /> Explore the source <External /></a></div><div className="mt-5 flex flex-wrap gap-2">{project.tags.map(tag => <span className="tag" key={tag}>{tag}</span>)}</div></section>
    {project.issues.length > 0 && <aside className="archive-note mb-6" aria-label="Archive notes"><h2 className="text-sm font-semibold">An unfinished page in the notebook</h2><p className="mb-3 mt-2 text-sm leading-relaxed">The original entry references {project.issues.length === 1 ? "a local file that is" : "local files that are"} missing from the archive. The demo may be incomplete. Its source is preserved so you can still explore the experiment.</p><details><summary className="cursor-pointer text-xs underline underline-offset-4">Show missing references ({project.issues.length})</summary><ul className="mt-3 list-inside list-disc break-all font-mono text-xs leading-6">{project.issues.map(issue => <li key={issue}>{issue}</li>)}</ul></details></aside>}
    <DemoViewer project={project} />
    <div className="project-context grid gap-12 py-14 lg:grid-cols-[1fr_1.35fr]"><section><p className="eyebrow mb-4">Where this fits</p><h2 className="text-3xl">0{stage.id} / {stage.title}</h2><p className="mb-5 mt-5 text-sm leading-7 text-muted">{stage.description}</p><Link href={`/journey/#stage-${stage.id}`} className="text-link">Follow this chapter <span aria-hidden="true">↗</span></Link><dl className="project-facts mt-8"><div><dt>Original folder</dt><dd className="break-all font-mono">{project.folder}</dd></div><div><dt>Archive status</dt><dd>{project.status === "source" ? "Source study" : project.status === "incomplete" ? "Missing local assets" : "Original experiment"}</dd></div><div><dt>Presentation</dt><dd>Preserved source · Next.js project page</dd></div></dl></section><section><div className="mb-4 flex items-center justify-between gap-4"><h2 className="eyebrow">Inside the experiment</h2><span className="font-mono text-xs text-muted">{project.files.length} files</span></div><p className="mb-5 text-sm leading-relaxed text-muted">Read the original implementation, compare versions, or start with the entry point. File links open the repository on GitHub.</p><details className="source-files" open><summary className="cursor-pointer p-4 text-sm font-semibold">Browse original files</summary><ul className="file-list">{project.files.map(file => <li key={file}><a href={sourceUrl(project, file)} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-4 px-4 py-3"><span className="min-w-0 break-all font-mono text-xs">{file}</span><External className="shrink-0" /></a></li>)}</ul></details></section></div>
    {related.length > 0 && <section className="mb-20 border-t border-line pt-12"><div className="section-heading"><p className="eyebrow mb-3">Keep following the idea</p><h2>Another page <span className="serif-word">in the notebook.</span></h2></div><div className="grid gap-4 md:grid-cols-3">{related.map(item => <ProjectCard project={item} key={item.slug} />)}</div></section>}
  </main>;
}
