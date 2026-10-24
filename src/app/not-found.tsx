import Link from "next/link";

export default function NotFound() {
  return <main id="main" className="shell py-28"><p className="eyebrow mb-5">404 / A blank page</p><h1>This experiment<br /><span className="serif-word">isn’t in the notebook.</span></h1><p className="my-7 text-muted">Browse the archive to pick up another thread.</p><Link href="/#projects" className="button button-dark">Back to the projects →</Link></main>;
}
