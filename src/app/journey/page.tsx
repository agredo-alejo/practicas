import type { Metadata } from "next";
import Link from "next/link";
import { getProject, projects, stages } from "@/lib/projects";
import { Arrow } from "@/components/icons";

export const metadata: Metadata = { title: "The learning journey", description: "Six conceptual chapters connecting web basics, visual mathematics, simulations, models, and neural networks." };

export default function JourneyPage() {
  return <main id="main" className="shell">
    <section className="page-intro max-w-4xl"><Link href="/" className="eyebrow text-muted">← Back to the notebook</Link><p className="eyebrow mb-5 mt-12">The learning journey / 6 chapters</p><h1>Learning isn’t a straight line.<br /><span className="serif-word">But ideas connect.</span></h1><p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted">A drawing needs coordinates. A simulation needs vectors. A neural network needs matrices. Look through the archive and the same ideas keep showing up in new places.</p><p className="mt-5 max-w-xl text-sm leading-relaxed text-muted">This is a guide through concepts, not a dated biography. The original files don’t establish an exact chronology, so these chapters describe a learning path through the work.</p></section>
    <nav aria-label="Learning chapters" className="journey-navigation mb-16 flex flex-wrap gap-2">{stages.map(stage => <a key={stage.id} href={`#stage-${stage.id}`} className="tag px-4 py-3">0{stage.id} · {stage.eyebrow}</a>)}</nav>
    <div className="journey-timeline">{stages.map(stage => <section id={`stage-${stage.id}`} key={stage.id} className="journey-stage grid scroll-mt-8 gap-8 pb-16 md:grid-cols-[80px_1fr] md:gap-12"><div className="timeline-marker">0{stage.id}</div><div><p className="eyebrow text-muted">{stage.eyebrow} <span className="mx-2">/</span> {projects.filter(project => project.stage === stage.id).length} entries</p><h2 className="mb-4 mt-4">{stage.title}</h2><p className="max-w-2xl text-lg leading-relaxed text-muted">{stage.description}</p><blockquote className="journey-question my-7">“{stage.question}”</blockquote><div className="grid gap-3 sm:grid-cols-2">{stage.picks.map(slug => { const project = getProject(slug)!; return <Link href={`/projects/${slug}/`} key={slug} className="journey-project flex items-center justify-between gap-5 p-5"><div><h3 className="text-sm font-semibold">{project.title}</h3><p className="mt-2 font-mono text-xs text-muted">{project.tags.join(" / ")}</p></div><Arrow /></Link>; })}</div><p className="mt-5 font-mono text-xs text-muted">TOOLS FOR THE NEXT QUESTION → {stage.skill}</p></div></section>)}</div>
    <div className="closing-note mb-20 flex flex-wrap items-center justify-between gap-7 p-8"><div><h2 className="text-2xl">The next chapter is still open.</h2><p className="mt-3 text-sm text-muted">Explore the code, compare versions, and follow an idea.</p></div><Link href="/#projects" className="button button-dark">Browse every experiment <Arrow /></Link></div>
  </main>;
}
