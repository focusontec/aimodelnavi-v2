import Link from "next/link";
import { ArrowRight, FileText, Calculator, ArrowLeftRight, Sparkles, LayoutGrid } from "lucide-react";

interface Tool {
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}

interface ToolsProps {
  locale: string;
  t: {
    toolsTitle: string;
    toolsSub: string;
    tryNow: string;
    tool1Title: string;
    tool1Desc: string;
    tool2Title: string;
    tool2Desc: string;
    tool3Title: string;
    tool3Desc: string;
    tool4Title: string;
    tool4Desc: string;
    tool5Title: string;
    tool5Desc: string;
  };
}

export function Tools({ locale, t }: ToolsProps) {
  const prefix = locale === "ja" ? "" : `/${locale}`;

  const tools: Tool[] = [
    { title: t.tool1Title, desc: t.tool1Desc, icon: FileText, href: `${prefix}/tools/token-counter` },
    { title: t.tool2Title, desc: t.tool2Desc, icon: Calculator, href: `${prefix}/tools/cost-calculator` },
    { title: t.tool3Title, desc: t.tool3Desc, icon: ArrowLeftRight, href: `${prefix}/compare` },
    { title: t.tool4Title, desc: t.tool4Desc, icon: Sparkles, href: `${prefix}/tools/model-recommender` },
    { title: t.tool5Title, desc: t.tool5Desc, icon: LayoutGrid, href: `${prefix}/tools/context-visualizer` },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
      <div className="text-center mb-12">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">{t.toolsTitle}</h2>
        <p className="mt-3 text-gray-500 max-w-xl mx-auto">{t.toolsSub}</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.title}
              href={tool.href}
              className="shimmer-hover group p-6 bg-white border border-gray-200 rounded-xl hover:border-primary-300 hover:shadow-md transition-all"
            >
              <div className="p-3 bg-primary-50 rounded-lg w-fit mb-4 group-hover:bg-primary-100 transition-colors">
                <Icon className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">{tool.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">{tool.desc}</p>
              <span className="text-sm font-medium text-primary-600 flex items-center gap-1">
                {t.tryNow} <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
