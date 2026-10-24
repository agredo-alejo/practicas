import type { Metadata } from "next";
import { Header, Footer } from "@/components/header";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Prácticas — Learning, one experiment at a time", template: "%s · Prácticas" },
  description: "Alejandro Agredo's programming learning archive: from first web pages to visual mathematics, simulations, and neural networks built from scratch.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><a href="#main" className="skip-link">Skip to content</a><Header />{children}<Footer /></body></html>;
}
