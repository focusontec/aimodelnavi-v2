import { BarChart3, Coins, RefreshCw } from "lucide-react";

interface ValuePropsProps {
  t: {
    value1Title: string;
    value1Desc: string;
    value2Title: string;
    value2Desc: string;
    value3Title: string;
    value3Desc: string;
  };
}

const icons = [BarChart3, Coins, RefreshCw];

export function ValueProps({ t }: ValuePropsProps) {
  const props = [
    { title: t.value1Title, desc: t.value1Desc },
    { title: t.value2Title, desc: t.value2Desc },
    { title: t.value3Title, desc: t.value3Desc },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
      <div className="grid md:grid-cols-3 gap-8">
        {props.map((prop, i) => {
          const Icon = icons[i];
          return (
            <div key={prop.title} className="text-center">
              <div className="inline-flex p-4 bg-primary-50 rounded-2xl mb-4">
                <Icon className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{prop.title}</h3>
              <p className="text-sm text-gray-500">{prop.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
