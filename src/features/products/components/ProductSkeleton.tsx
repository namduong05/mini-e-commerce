export const ProductSkeleton = () => {
  return (
    <div className="animate-pulse rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="aspect-square w-full rounded-lg bg-gray-200" />
      <div className="mt-4 space-y-2">
        <div className="h-3 w-1/3 rounded bg-gray-200" />
        <div className="h-4 w-5/6 rounded bg-gray-200" />
        <div className="h-4 w-1/2 rounded bg-gray-200" />
        <div className="mt-4 h-9 w-full rounded-lg bg-gray-200" />
      </div>
    </div>
  );
};
