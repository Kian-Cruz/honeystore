export default function Loading() {
  return (
    <main className="min-h-[70vh] bg-white text-black">
      {/* Header skeleton */}
      <section className="border-b border-black/10 bg-[#f7f7f7]">
        <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-8">
          <div className="h-3 w-24 animate-pulse bg-black/10" />

          <div className="mt-4 h-12 w-64 max-w-full animate-pulse bg-black/10" />

          <div className="mt-5 h-4 w-[500px] max-w-full animate-pulse bg-black/10" />
        </div>
      </section>

      {/* Product skeletons */}
      <section className="mx-auto max-w-[1440px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="h-7 w-40 animate-pulse bg-black/10" />

          <div className="h-4 w-20 animate-pulse bg-black/10" />
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
          {Array.from({ length: 8 }).map(
            (_, index) => (
              <article key={index}>
                <div className="aspect-[4/5] animate-pulse bg-black/[0.07]" />

                <div className="pt-4">
                  <div className="h-3 w-20 animate-pulse bg-black/10" />

                  <div className="mt-3 h-4 w-4/5 animate-pulse bg-black/10" />

                  <div className="mt-3 h-4 w-24 animate-pulse bg-black/10" />

                  <div className="mt-3 h-3 w-16 animate-pulse bg-black/10" />
                </div>
              </article>
            )
          )}
        </div>
      </section>
    </main>
  );
}