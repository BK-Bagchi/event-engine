import { Skeleton } from "@/components/ui/skeleton";

const BodySkeleton = () => (
  <div className="max-w-6xl mx-auto flex flex-col gap-6">
    <Skeleton className="h-5 w-36 bg-[#2A3550]/60" />
    {/* Variables skeleton */}
    <section className="rounded-xl border border-[#2A3550] bg-[#1A2235] p-6">
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-5 w-20 bg-[#2A3550]/60" />
        <Skeleton className="h-3 w-44 bg-[#2A3550]/60" />
      </div>
      <div className="flex flex-col gap-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <Skeleton
              className={`h-4 bg-[#2A3550]/60 ${i === 0 ? "w-24" : i === 1 ? "w-32" : "w-20"}`}
            />
            <Skeleton className="h-7 w-14 bg-[#2A3550]/60" />
          </div>
        ))}
      </div>
    </section>
    <section className="rounded-xl border border-[#2A3550] bg-[#1A2235] p-6 flex flex-col gap-6">
      {/* Subject skeleton */}
      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-4 w-36 bg-[#2A3550]/60" />
        <Skeleton className="h-3 w-52 bg-[#2A3550]/60" />
        <Skeleton className="h-8 w-full bg-[#2A3550]/60" />
      </div>
      {/* HTML Template skeleton */}
      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-4 w-32 bg-[#2A3550]/60" />
        <Skeleton className="h-3 w-60 bg-[#2A3550]/60" />
        <Skeleton className="h-32 w-full bg-[#2A3550]/60" />
      </div>
      {/* Text Template skeleton */}
      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-4 w-28 bg-[#2A3550]/60" />
        <Skeleton className="h-3 w-56 bg-[#2A3550]/60" />
        <Skeleton className="h-32 w-full bg-[#2A3550]/60" />
      </div>
    </section>
  </div>
);

export default BodySkeleton;
