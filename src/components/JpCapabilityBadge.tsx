import type { JpCapabilityLevel } from "@/data/jp-capability";

const levelColors: Record<JpCapabilityLevel, string> = {
  native: "bg-blue-100 text-blue-800 border-blue-200",
  high: "bg-green-100 text-green-800 border-green-200",
  moderate: "bg-yellow-100 text-yellow-800 border-yellow-200",
  low: "bg-gray-100 text-gray-600 border-gray-200",
  untested: "bg-gray-50 text-gray-400 border-gray-200",
};

const levelEmoji: Record<JpCapabilityLevel, string> = {
  native: "\u{1F1EF}\u{1F1F5}",
  high: "\u{2705}",
  moderate: "\u{1F310}",
  low: "\u{26A0}\u{FE0F}",
  untested: "\u{2753}",
};

export default function JpCapabilityBadge({
  level,
  badge,
  showEmoji = true,
}: {
  level: JpCapabilityLevel;
  badge: string;
  showEmoji?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${levelColors[level]}`}
    >
      {showEmoji && <span>{levelEmoji[level]}</span>}
      {badge}
    </span>
  );
}
