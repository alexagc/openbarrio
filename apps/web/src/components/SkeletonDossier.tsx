
export function SkeletonDossier() {
  return (
    <div className="space-y-4 max-w-4xl mx-auto animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200">
        <div className="h-4 bg-slate-200 rounded w-48 mb-3"></div>
        <div className="h-7 bg-slate-200 rounded w-3/4 mb-3"></div>
        <div className="flex space-x-3">
          <div className="h-5 bg-slate-200 rounded w-40"></div>
          <div className="h-5 bg-slate-200 rounded w-32"></div>
        </div>
      </div>

      {/* Score Gauge Skeleton */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-24 h-24 rounded-full bg-slate-200"></div>
          <div className="space-y-2">
            <div className="h-6 bg-slate-200 rounded w-36"></div>
            <div className="h-4 bg-slate-200 rounded w-64"></div>
          </div>
        </div>
        <div className="w-full sm:w-56 space-y-2">
          <div className="h-3 bg-slate-200 rounded w-full"></div>
          <div className="h-3 bg-slate-200 rounded w-full"></div>
          <div className="h-3 bg-slate-200 rounded w-full"></div>
          <div className="h-3 bg-slate-200 rounded w-full"></div>
        </div>
      </div>

      {/* 4 Pillars Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200 space-y-3">
            <div className="flex justify-between">
              <div className="h-5 bg-slate-200 rounded w-32"></div>
              <div className="h-4 bg-slate-200 rounded w-16"></div>
            </div>
            <div className="h-4 bg-slate-200 rounded w-full"></div>
            <div className="h-4 bg-slate-200 rounded w-5/6"></div>
            <div className="h-4 bg-slate-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>

      {/* Rental Skeleton */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-3">
        <div className="h-5 bg-slate-200 rounded w-48"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="h-20 bg-slate-200 rounded-xl"></div>
          <div className="h-20 bg-slate-200 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
}
