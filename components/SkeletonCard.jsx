import { Skeleton } from "./ui/skeleton";

export default function SkeletonCard() {
  return (
    <div className="rounded-2xl border p-4 bg-white dark:bg-neutral-900">
      <Skeleton className="h-5 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}