import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tools",
  description:
    "Free tools for AI model selection: cost calculator, model comparison, and token counter.",
  openGraph: {
    title: "Tools | AI Models Navi",
    description:
      "Free tools for AI model selection: cost calculator, model comparison, and token counter.",
  },
};

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
