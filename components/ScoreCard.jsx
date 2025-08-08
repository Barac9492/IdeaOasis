export function ScorePill({ label, value }) {
  const v = typeof value === "number" ? value : "-";
  return (
    <div className="flex items-center justify-between rounded-lg border p-2">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="text-base font-semibold">{v}/10</span>
    </div>
  );
}

export default function ScoreCard({ scores }) {
  const entries = [
    ["Opportunity", scores?.opportunity],
    ["Problem", scores?.problem],
    ["Feasibility", scores?.feasibility],
    ["Why Now", scores?.whyNow],
  ];
  return (
    <div className="grid grid-cols-2 gap-2">
      {entries.map(([k, v]) => (
        <ScorePill key={k} label={k} value={v} />
      ))}
    </div>
  );
}
