export function Loading() {
  return (
    <div className="animate-pulse space-y-10" aria-label="読み込み中" role="status">
      {[1, 2].map((i) => (
        <div key={i} className="grid border-t-2 border-ink/40 sm:grid-cols-[7.5rem_minmax(0,1fr)]">
          <div className="py-4">
            <div className="h-12 w-14 bg-paper-deep" />
            <div className="mt-2 h-3 w-16 bg-paper-deep" />
          </div>
          <div className="space-y-6 py-5 sm:border-l sm:border-rule/60 sm:pl-6">
            {[1, 2].map((j) => (
              <div key={j} className="space-y-2">
                <div className="h-3 w-24 bg-paper-deep" />
                <div className="h-5 w-4/5 bg-paper-deep" />
                <div className="h-3 w-3/5 bg-paper-deep/70" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
