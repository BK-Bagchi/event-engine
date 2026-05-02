import { Skeleton } from "@/components/ui/skeleton";

const WorkflowSkeleton = () => (
  <div className="rounded-lg border border-[#2A3550] bg-[#1A2235] p-5 flex flex-col gap-5">
    <div className="flex items-center gap-3">
      <Skeleton className="h-4 w-14 bg-[#2A3550] rounded" />
      <Skeleton className="h-8 w-36 bg-[#2A3550] rounded-lg" />
    </div>
    <div className="flex flex-col gap-3">
      <Skeleton className="h-4 w-16 bg-[#2A3550] rounded" />
      <Skeleton className="h-10 w-full bg-[#2A3550] rounded-md" />
      <Skeleton className="h-10 w-full bg-[#2A3550] rounded-md" />
      <Skeleton className="h-7 w-24 bg-[#2A3550] rounded-md" />
    </div>
  </div>
);

export default WorkflowSkeleton;
