function Bone({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-100 dark:bg-slate-700 rounded-lg ${className}`} />;
}

export function PatientCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl ring-1 ring-slate-100 dark:ring-slate-700 border-l-4 border-l-slate-100 dark:border-l-slate-700 p-5 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Bone className="w-10 h-10 rounded-full" />
          <div className="space-y-1.5">
            <Bone className="w-32 h-3.5" />
            <Bone className="w-24 h-2.5" />
          </div>
        </div>
        <Bone className="w-20 h-5 rounded-full" />
      </div>
      <Bone className="w-full h-9 rounded-lg" />
      <div className="flex items-center justify-between">
        <Bone className="w-16 h-5 rounded-md" />
        <div className="space-y-1 text-right">
          <Bone className="w-20 h-2.5" />
          <Bone className="w-14 h-2.5" />
        </div>
      </div>
    </div>
  );
}

export function DashboardStatSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl ring-1 ring-slate-100 dark:ring-slate-700 p-4 space-y-3">
      <Bone className="w-8 h-8 rounded-lg" />
      <Bone className="w-12 h-7 rounded" />
      <Bone className="w-20 h-2.5" />
    </div>
  );
}

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-5 gap-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl ring-1 ring-slate-100 dark:ring-slate-700 p-4 text-center space-y-2">
          <Bone className="w-10 h-7 mx-auto rounded" />
          <Bone className="w-16 h-2.5 mx-auto" />
        </div>
      ))}
    </div>
  );
}
