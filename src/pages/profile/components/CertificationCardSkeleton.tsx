export default function CertificationCardSkeleton() {
  const skeletonItems = Array(2).fill(null);

  return (
    <div className="space-y-4">
      {skeletonItems.map((_, index) => (
        <div
          key={index}
          className="bg-input/60 rounded-lg p-3 flex justify-between items-center"
        >
          <div className="flex items-start">
            {/* Skeleton for status icon */}
            <div className="w-5 h-5 rounded-full bg-card mr-2 mt-1 animate-pulse"></div>

            <div>
              {/* Skeleton for certification name */}
              <div className="h-5 w-48 bg-card rounded-md mb-2 animate-pulse"></div>

              {/* Skeleton for expiration date */}
              <div className="h-4 w-32 bg-card rounded-md animate-pulse"></div>
            </div>
          </div>

          {/* Skeleton for status badge/button */}
          <div className="h-6 w-20 bg-card rounded-full animate-pulse"></div>
        </div>
      ))}
    </div>
  );
}
