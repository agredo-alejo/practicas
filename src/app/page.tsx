import Link from "next/link";
import { projects, stages } from "@/lib/projects";
import { ProjectExplorer } from "@/components/project-explorer";
import { Playground } from "@/components/playground";

export default function Home() {
  return <main id="main" className="shell">
    <section className="notebook-intro">
      <div>
        <p className="eyebrow mb-5">Personal archive / Alejandro Agredo</p>
        <h1>A notebook for<br /><span className="text-accent">figuring things out.</span></h1>
        <p className="intro-note">Things I’ve made, things I’m trying, and ideas I want to come back to. A place to play, leave a note, and see what connects.</p>
        <div className="intro-links"><a href="#projects">Open the archive ↓</a><Link href="/journey/">Connections between ideas ↗</Link></div>
      </div>
      <Playground />
    </section>
    <section id="projects" className="archive-section scroll-mt-8" aria-labelledby="projects-heading">
      <div className="archive-heading"><div><p className="eyebrow mb-2">The notebook</p><h2 id="projects-heading">Projects & experiments<span className="count-label">{projects.length}</span></h2></div><Link href="/add/" className="text-link add-link">+ Add a project</Link></div>
      <ProjectExplorer projects={projects} />
    </section>
    <section className="connections-summary" aria-labelledby="connections-heading"><div><p className="eyebrow mb-3">A way to find my way back</p><h2 id="connections-heading">Ideas keep crossing paths.</h2><p className="mt-4 max-w-xl text-sm leading-7 text-muted">Coordinates turn into drawings. Vectors turn into movement. Matrices show up again in a network. I’ve grouped the archive by these connections, rather than trying to give everything a date.</p><Link href="/journey/" className="text-link mt-5">Open the connections map ↗</Link></div><ol className="connections-index">{stages.map(stage => <li key={stage.id}><Link href={`/journey/#stage-${stage.id}`}><span className="font-mono text-xs text-muted">0{stage.id}</span><span>{stage.eyebrow}</span><span className="text-muted">↗</span></Link></li>)}</ol></section>
    <section className="next-entry" id="add-project"><div><h2>Room for the next thing.</h2><p className="mt-3 text-sm text-muted">A quick sketch counts. An unfinished idea counts, too.</p></div><div><code>npm run add-project -- my-experiment</code><Link href="/add/" className="text-link mt-3">How to add an entry ↗</Link></div></section>
  </main>;
}
