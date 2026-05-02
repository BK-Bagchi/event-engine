import { Skeleton } from "@/components/ui/skeleton";

const InformationSkeleton = () => (
  <div className="max-w-6xl mx-auto flex flex-col gap-6">
    <Skeleton className="h-5 w-36 bg-[#2A3550]/60" />
    {/* Section 1 skeleton */}
    <section className="rounded-xl border border-[#2A3550] bg-[#1A2235] p-6">
      <Skeleton className="h-6 w-48 mb-3 bg-[#2A3550]/60" />
      <Skeleton className="h-4 w-full bg-[#2A3550]/60" />
      <Skeleton className="h-4 w-2/3 mt-2 bg-[#2A3550]/60" />
    </section>
    {/* Section 2 skeleton */}
    <section className="rounded-xl border border-[#2A3550] bg-[#1A2235] p-6">
      <Skeleton className="h-4 w-20 mb-3 bg-[#2A3550]/60" />
      <Skeleton className="h-8 w-44 bg-[#2A3550]/60" />
    </section>
    {/* Section 3 skeleton */}
    <section className="rounded-xl border border-[#2A3550] bg-[#1A2235] p-6">
      <Skeleton className="h-4 w-16 mb-3 bg-[#2A3550]/60" />
      <Skeleton className="h-8 w-44 bg-[#2A3550]/60" />
    </section>
  </div>
);

export default InformationSkeleton;
