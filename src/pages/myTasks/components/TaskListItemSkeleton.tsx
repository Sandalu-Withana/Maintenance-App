export default function TaskListItemSkeleton() {
  return (
    <div className="bg-card rounded-lg p-4 mb-4 space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {/* Title skeleton */}
          <div className="h-7 bg-input rounded w-[100px] mr-2"></div>

          {/* Status badge skeleton */}
          <div className="h-6 w-6 bg-input rounded-full"></div>
        </div>

        <div className={`px-3 py-1 h-7 w-20 rounded-full flex bg-input`}></div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="h-5 bg-input rounded w-1/3"> </div>
          <div className="h-5 bg-input rounded w-1/3"></div>
        </div>
        <div className="flex items-center justify-between">
          <div className="h-5 bg-input rounded w-1/3"></div>
          <div className="h-5 bg-input rounded w-1/3"></div>
        </div>
        <div className="flex items-center justify-between">
          <div className="h-5 bg-input rounded w-1/3"></div>
          <div className="h-5 bg-input rounded w-1/3"></div>
        </div>
        <div className="flex items-center justify-between">
          <div className="h-5 bg-input rounded w-1/3"></div>
          <div className="h-5 bg-input rounded w-1/3"></div>
        </div>
        <div className="flex items-center justify-between">
          <div className="h-5 bg-input rounded w-1/3"></div>
          <div className="h-5 bg-input rounded w-1/3"></div>
        </div>
      </div>

      <div className="h-10 w-full bg-input py-2 rounded-full transition-colors"></div>
    </div>
  );
}
