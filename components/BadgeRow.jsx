export default function BadgeRow({ badges = [], tags = [], useCases = [], techStack = [] }) {
  const chip = (txt, key, cls) => (
    <span key={key} className={`px-2 py-0.5 text-xs rounded-full border ${cls}`}>{txt}</span>
  );
  return (
    <div className="flex flex-wrap gap-1">
      {badges.map((b, i) => chip(b, `b-${i}`, "bg-gray-50"))}
      {tags.map((t, i) => chip(`#${t}`, `t-${i}`, "bg-blue-50 border-blue-200"))}
      {useCases.map((u, i) => chip(u, `u-${i}`, "bg-violet-50 border-violet-200"))}
      {techStack.map((s, i) => chip(s, `s-${i}`, "bg-emerald-50 border-emerald-200"))}
    </div>
  );
}
