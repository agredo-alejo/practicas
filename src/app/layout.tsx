import type { Metadata } from "next";
import { Header, Footer } from "@/components/header";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Prácticas — Alejandro’s personal notebook", template: "%s · Prácticas" },
  description: "A personal notebook of projects, experiments, unfinished ideas, and connections. Alejandro Agredo’s place to play and keep learning.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      {/* Grammarly can add attributes to body before React hydrates. Keep this escape hatch scoped to body. */}
      <body suppressHydrationWarning>
        <a href="#main" className="skip-link">Skip to content</a>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
