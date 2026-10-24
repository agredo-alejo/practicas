import catalog from "@/content/projects.json";

export const categories = [
  { id: "machine-learning", title: "Machine learning", short: "ML", description: "From fitting lines to building networks." },
  { id: "simulations", title: "Simulations", short: "SIM", description: "Small rules. Unexpected behavior." },
  { id: "graphics", title: "Graphics & drawing", short: "GFX", description: "Making abstract ideas visible." },
  { id: "math", title: "Math", short: "MATH", description: "Equations you can play with." },
  { id: "games", title: "Games", short: "PLAY", description: "Putting the pieces into motion." },
  { id: "web-practice", title: "Web foundations", short: "WEB", description: "The first pages, forms, and interactions." },
  { id: "experiments", title: "Scratchpads", short: "WIP", description: "Loose ends are part of learning, too." },
  { id: "shared", title: "Shared libraries", short: "LIB", description: "Ideas that became reusable tools." },
] as const;

export type CategoryId = typeof categories[number]["id"];
export type Project = {
  slug: string;
  folder: string;
  category: CategoryId;
  title: string;
  description: string;
  stage: number;
  tags: string[];
  path: string;
  demo: string | null;
  status: "source" | "incomplete" | "archived" | "linked";
  url?: string;
  source?: string;
  issues: string[];
  files: string[];
  nested: boolean;
};

export const projects = catalog as Project[];
export const sourceRoot = "https://github.com/agredo-alejo/practicas/tree/main/public/legacy";
export const stages = [
  { id: 1, title: "Make a page", eyebrow: "The foundations", description: "HTML, CSS, loops, forms, and the first moment a page responds to an input.", question: "How do I make something happen?", skill: "DOM · CSS · events", picks: ["web-practice-cajero", "graphics-dibujo", "web-practice-css-grid"] },
  { id: 2, title: "Make an idea visible", eyebrow: "Visual mathematics", description: "Coordinates become drawings. Vectors become movement. Matrices open a window into more dimensions.", question: "What does the math look like?", skill: "Canvas · vectors · geometry", picks: ["math-coordenadas", "graphics-cube", "graphics-tesseract", "graphics-raycasting"] },
  { id: 3, title: "Build a little world", eyebrow: "Rules & emergence", description: "Individual objects start interacting. A few simple rules produce flocks, orbits, collisions, and games.", question: "What happens when the rules interact?", skill: "Objects · physics · simulation", picks: ["simulations-gravity", "simulations-boids", "simulations-gameoflife", "games-asteroids"] },
  { id: 4, title: "Learn from data", eyebrow: "Models & optimization", description: "Instead of specifying every answer, explore how a model can fit data or a population can search for a solution.", question: "Can the program find its own answer?", skill: "Regression · probability · evolution", picks: ["machine-learning-linearregression", "machine-learning-polynomialregression", "machine-learning-genetic", "machine-learning-genetic2"] },
  { id: 5, title: "Build the network", eyebrow: "Under the hood", description: "Weighted inputs, matrix operations, and backpropagation become the building blocks of a classifier.", question: "How does a network actually learn?", skill: "Perceptrons · gradients · MNIST", picks: ["machine-learning-perceptron", "machine-learning-xor", "machine-learning-backprop", "machine-learning-mnistuser"] },
  { id: 6, title: "Go a layer deeper", eyebrow: "Systems & iteration", description: "Return to earlier problems with convolution, tensor libraries, trained agents, and another version of the experiment.", question: "What changes when I build it again?", skill: "CNNs · tensors · neuroevolution", picks: ["machine-learning-convolucion", "machine-learning-newmnistuser", "machine-learning-juego", "machine-learning-neuralnet"] },
] as const;

export function getProject(slug: string) { return projects.find(project => project.slug === slug); }
export function getCategory(id: CategoryId) { return categories.find(category => category.id === id)!; }
export function sourceUrl(project: Project, file?: string) {
  if (project.source && !file) return project.source;
  const base = file ? sourceRoot.replace("/tree/", "/blob/") : sourceRoot;
  return `${base}/${project.path.split("/").map(encodeURIComponent).join("/")}${file ? `/${file.split("/").map(encodeURIComponent).join("/")}` : ""}`;
}

export function relatedProjects(project: Project) {
  return projects.filter(candidate => candidate.slug !== project.slug && candidate.category === project.category)
    .sort((a, b) => Math.abs(a.stage - project.stage) - Math.abs(b.stage - project.stage)).slice(0, 3);
}
