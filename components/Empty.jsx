export default function Empty({ title = "No items", description = "새 아이디어를 기다리고 있어요" }) {
  return (
    <div className="text-center py-16 border rounded-2xl bg-white dark:bg-neutral-900">
      <div className="text-lg font-semibold">{title}</div>
      <div className="text-sm text-zinc-500 mt-1">{description}</div>
    </div>
  );
}