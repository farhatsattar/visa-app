import { SkeletonCard } from "@/components/common/skeleton-card";

export default function Loading() {
  return (
    <div className="container-shell py-14">
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 6 }).map((_, idx) => (
          <SkeletonCard key={idx} />
        ))}
      </div>
    </div>
  );
}
