export default function SectionCard({ title, children, className = "" }) {
  return (
    <section className={`rounded-xl border bg-white p-4 shadow-sm ${className}`}>
      <h3 className="text-sm font-semibold text-gray-700 mb-2">{title}</h3>
      {children}
    </section>
  );
}
