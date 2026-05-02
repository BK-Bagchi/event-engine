import { Skeleton } from "@/components/ui/skeleton";

const ConfigSkeleton = () => (
  <div className="max-w-6xl mx-auto flex flex-col gap-6">
    <Skeleton className="h-5 w-36 bg-[#2A3550]/60" />
    {/* Delivery Config skeleton */}
    <section className="rounded-xl border border-[#2A3550] bg-[#1A2235] p-6">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-5 w-32 bg-[#2A3550]/60" />
        <Skeleton className="h-8 w-16 bg-[#2A3550]/60" />
      </div>
      <div className="flex flex-col gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex gap-2 items-center">
            <Skeleton className="h-4 w-24 bg-[#2A3550]/60 shrink-0" />
            <Skeleton
              className={`h-4 bg-[#2A3550]/60 ${i === 0 ? "w-2/3" : i === 1 ? "w-1/2" : i === 2 ? "w-40" : "w-32"}`}
            />
          </div>
        ))}
      </div>
    </section>

    {/* Settings skeleton */}
    <section className="rounded-xl border border-[#2A3550] bg-[#1A2235] p-6 flex flex-col gap-5">
      <Skeleton className="h-5 w-20 bg-[#2A3550]/60" />
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex flex-col gap-1.5">
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-4 rounded bg-[#2A3550]/60" />
            <Skeleton className="h-4 w-40 bg-[#2A3550]/60" />
          </div>
          {i === 0 && <Skeleton className="h-3 w-72 ml-7 bg-[#2A3550]/60" />}
        </div>
      ))}
    </section>
  </div>
);

export default ConfigSkeleton;
