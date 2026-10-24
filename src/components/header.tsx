import Link from "next/link";
import { Github } from "./icons";

export function Header() {
  return <header className="site-header shell flex items-center justify-between gap-4 py-6">
    <Link href="/" className="wordmark" aria-label="Practicas home">prácticas<span className="text-accent-ink">*</span></Link>
    <nav aria-label="Main navigation" className="flex items-center gap-5 text-sm sm:gap-9">
      <Link href="/#projects" className="nav-link">Projects</Link>
      <Link href="/journey/" className="nav-link">The journey</Link>
      <a href="https://github.com/agredo-alejo/practicas" target="_blank" rel="noreferrer" className="github-link" aria-label="Practicas on GitHub (opens a new tab)"><Github /><span className="hidden sm:inline">Source</span></a>
    </nav>
  </header>;
}

export function Footer() {
  return <footer className="shell footer flex flex-col justify-between gap-6 py-9 text-sm sm:flex-row">
    <div><Link href="/" className="font-semibold">prácticas*</Link><p className="mt-2 text-muted">A learning archive by Alejandro Agredo.</p></div>
    <div className="flex flex-wrap items-start gap-x-7 gap-y-3 text-muted"><Link href="/journey/">The learning journey</Link><a href="/legacy/index.html" target="_blank" rel="noreferrer">Original gallery ↗</a><a href="https://github.com/agredo-alejo/practicas" target="_blank" rel="noreferrer">GitHub ↗</a></div>
  </footer>;
}
