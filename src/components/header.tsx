import Link from "next/link";
import { Github } from "./icons";

export function Header() {
  return <header className="site-header shell">
    <Link href="/" className="identity" aria-label="Alejandro Agredo — Practicas home"><span className="identity-mark" aria-hidden="true" /><span><span className="identity-name">alejandro <span>agredo</span></span><span className="identity-caption">prácticas / personal notebook</span></span></Link>
    <nav aria-label="Main navigation"><Link href="/#projects" className="nav-link">Archive</Link><Link href="/journey/" className="nav-link">Connections</Link><a href="https://github.com/agredo-alejo/practicas" target="_blank" rel="noreferrer" className="github-link" aria-label="Practicas on GitHub (opens a new tab)"><Github /></a></nav>
  </header>;
}
export function Footer() {
  return <footer className="shell footer"><div><span className="footer-name">alejandro agredo / prácticas</span><p className="mt-2 text-muted">For the fun of making things and understanding a little more.</p></div><div className="footer-links"><a href="/legacy/index.html" target="_blank" rel="noreferrer">Old gallery ↗</a><Link href="/add/">Add an entry</Link><a href="https://github.com/agredo-alejo/practicas" target="_blank" rel="noreferrer">Code ↗</a></div></footer>;
}
