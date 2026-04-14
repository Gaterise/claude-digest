export function Loading() {
  return (
    <div className="animate-pulse space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-lg border border-gray-200 p-6">
          <div className="h-6 w-3/4 rounded bg-gray-200" />
          <div className="mt-3 space-y-2">
            <div className="h-4 w-full rounded bg-gray-100" />
            <div className="h-4 w-5/6 rounded bg-gray-100" />
          </div>
          <div className="mt-4 flex gap-2">
            <div className="h-5 w-16 rounded-full bg-gray-100" />
            <div className="h-5 w-12 rounded-full bg-gray-100" />
          </div>
        </div>
      ))}
    </div>
  );
}
