export default function Loading() {
  return (
    <div className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full">
      <div className="animate-pulse">
        <div className="h-8 bg-cinema-dark-elevated rounded w-1/3 mb-6" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-cinema-dark-card p-6 mb-6 rounded-2xl">
            <div className="flex gap-6">
              <div className="w-[200px] h-[300px] bg-cinema-dark-elevated rounded-xl" />
              <div className="flex-1 space-y-4">
                <div className="h-6 bg-cinema-dark-elevated rounded w-2/3" />
                <div className="h-4 bg-cinema-dark-elevated rounded w-1/4" />
                <div className="h-4 bg-cinema-dark-elevated rounded w-1/3" />
                <div className="h-20 bg-cinema-dark-elevated rounded w-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
