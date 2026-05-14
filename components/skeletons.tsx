// Flutter parallel:
// This is like a Shimmer widget — a placeholder shown while data loads.
// In Flutter you'd use shimmer or a skeleton package.
// Here we build a simple pulsing placeholder with Tailwind's animate-pulse.

interface SkeletonProps {
  className?: string;
}

function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`} />
  );
}

export function PatientCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="space-y-1.5">
            <Skeleton className="w-28 h-3" />
            <Skeleton className="w-20 h-2.5" />
          </div>
        </div>
        <Skeleton className="w-20 h-5 rounded-full" />
      </div>
      <Skeleton className="w-full h-8" />
      <div className="flex items-center justify-between">
        <Skeleton className="w-20 h-5" />
        <div className="space-y-1">
          <Skeleton className="w-16 h-2.5" />
          <Skeleton className="w-12 h-2.5" />
        </div>
      </div>
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-5 gap-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="bg-slate-100 rounded-2xl p-4 text-center space-y-2">
          <Skeleton className="w-8 h-7 mx-auto" />
          <Skeleton className="w-14 h-2.5 mx-auto" />
        </div>
      ))}
    </div>
  );
}

export function DashboardStatSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-3">
      <Skeleton className="w-24 h-3" />
      <Skeleton className="w-12 h-8" />
      <Skeleton className="w-32 h-2.5" />
    </div>
  );
}