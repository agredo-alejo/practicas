import Link from "next/link";
import { projects, stages, getProject } from "@/lib/projects";
import { Arrow } from "@/components/icons";
import { Sketch } from "@/components/sketch";
import { ProjectCard } from "@/components/project-card";
import { ProjectExplorer } from "@/components/project-explorer";

const featured = ["simulations-boids", "graphics-tesseract", "machine-learning-perceptron"].map(slug => getProject(slug)!);

export default function Home() {
  return <main id="main">
    <section className="shell hero grid items-center gap-12 lg:grid-cols-[1.15fr_1fr]">
      <div className="hero-copy">
        <p className="eyebrow mb-7 flex items-center gap-2"><span className="live-dot" /> A programming learning archive</p>
        <h1>One question.<br />One experiment.<br /><span className="serif-word">A little further.</span></h1>
        <p className="hero-description mt-7 max-w-lg text-muted">I learn by building things I don’t quite understand yet. These are the pages, simulations, and neural networks I made along the way.</p>
        <div className="mt-9 flex flex-wrap items-center gap-5"><Link href="#projects" className="button button-dark">Explore the projects <Arrow /></Link><Link href="/journey/" className="text-link">Follow the journey <span aria-hidden="true">↗</span></Link></div>
        <p className="hero-signature mt-10 font-mono text-xs text-muted">ALEJANDRO AGREDO <span className="mx-3 opacity-40">/</span> CURIOUS BY DEFAULT</p>
      </div>
      <div className="hero-lab">
        <div className="lab-top flex items-center justify-between"><span className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-accent" /> FIELD NOTES</span><span>EXPERIMENT_005</span></div>
        <div className="lab-diagram"><Sketch kind="neural-network" className="w-full" /><span className="lab-annotation annotation-a">a few inputs</span><span className="lab-annotation annotation-b">a new way to think</span></div>
        <div className="lab-bottom"><p className="font-mono text-xs text-white/45">THE QUESTION THAT KEPT COMING BACK</p><p className="mt-4 text-2xl leading-snug">“What if I built<br />it from scratch?”</p><div className="mt-6 flex items-center justify-between border-t border-white/15 pt-4 text-xs text-white/50"><span>inputs → layers → understanding</span><span className="lab-asterisk" aria-hidden="true">✳</span></div></div>
      </div>
    </section>

    <div className="shell"><div className="archive-stats grid grid-cols-2 gap-6 border-y border-line py-7 sm:grid-cols-4"><div><span className="stat-number">67</span><span className="stat-label">original project folders</span></div><div><span className="stat-number">08</span><span className="stat-label">areas of exploration</span></div><div><span className="stat-number">06</span><span className="stat-label">learning chapters</span></div><div><span className="stat-number">∞</span><span className="stat-label">reasons to keep learning</span></div></div></div>

    <section className="shell section-space" aria-labelledby="featured-heading"><div className="section-heading flex flex-wrap items-end justify-between gap-5"><div><p className="eyebrow mb-3">01 / A few places to start</p><h2 id="featured-heading">Small experiments. <span className="serif-word">Bigger ideas.</span></h2></div><p className="max-w-xs text-sm leading-relaxed text-muted">From a flock of triangles to a machine that learns. Open an experiment and look under the hood.</p></div><div className="grid gap-5 md:grid-cols-3">{featured.map(project => <ProjectCard key={project.slug} project={project} illustrated />)}</div></section>

    <section className="journey-band" aria-labelledby="journey-heading"><div className="shell py-16 sm:py-20"><div className="section-heading flex flex-wrap items-end justify-between gap-6"><div><p className="eyebrow mb-3">02 / Connecting the dots</p><h2 id="journey-heading">There’s a thread <span className="serif-word">through it all.</span></h2></div><Link href="/journey/" className="text-link">Read the learning journey <Arrow /></Link></div><div className="chapter-strip grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-3 xl:grid-cols-6">{stages.map(stage => <Link key={stage.id} href={`/journey/#stage-${stage.id}`} className="chapter-item"><span className="chapter-number">0{stage.id}</span><h3 className="mb-2 mt-5 font-semibold">{stage.title}</h3><p className="text-xs leading-relaxed text-muted">{stage.skill}</p></Link>)}</div><p className="mt-9 max-w-xl text-xs leading-relaxed text-muted">Organized by concepts, rather than dates. The original archive doesn’t record a reliable timeline; these chapters make the connections between projects easier to follow.</p></div></section>

    <section id="projects" className="shell section-space scroll-mt-7" aria-labelledby="projects-heading"><div className="section-heading flex flex-wrap items-end justify-between gap-5"><div><p className="eyebrow mb-3">03 / The whole notebook</p><h2 id="projects-heading">Every attempt <span className="serif-word">belongs here.</span></h2></div><p className="max-w-xs text-sm leading-relaxed text-muted">{projects.length} entries, including nested demos and shared tools. Finished ideas, second versions, and a few loose ends.</p></div><ProjectExplorer projects={projects} /></section>

    <section className="shell mb-20"><div className="closing-note grid gap-8 p-8 md:grid-cols-[1fr_2fr] md:p-12"><p className="eyebrow">A note on the archive</p><div><h2 className="mb-5 text-2xl font-semibold tracking-tight">The original work stays part of the story.</h2><p className="max-w-2xl text-sm leading-7 text-muted">This portfolio is built with Next.js, TypeScript, and Tailwind. The early projects still run in their original form, with their original source, naming, and experiments intact. Some sketches have missing assets or unfinished code; their project pages include notes where the catalog finds missing local files.</p><a href="/legacy/index.html" className="text-link mt-6" target="_blank" rel="noreferrer">Visit the original gallery <Arrow /></a></div></div></section>
  </main>;
}
