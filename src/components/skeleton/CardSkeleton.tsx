//prettier-ignore
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const CardSkeleton = () => (
  <Card className="bg-[#1A2235] border-[#2A3550] ring-0 border flex flex-col">
    <CardHeader className="border-b border-[#2A3550] pb-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-2 flex-1">
          <Skeleton className="h-4 w-2/3 bg-[#2A3550]" />
          <Skeleton className="h-5 w-24 rounded-full bg-[#2A3550]" />
        </div>
        <Skeleton className="h-5 w-16 rounded-full bg-[#2A3550]" />
      </div>
    </CardHeader>
    <CardContent className="pt-3 flex flex-col gap-2 flex-1">
      <div className="flex items-center gap-2">
        <Skeleton className="h-3 w-16 bg-[#2A3550]" />
        <Skeleton className="h-3 w-32 bg-[#2A3550]" />
      </div>
      <Skeleton className="h-5 w-14 rounded-full bg-[#2A3550]" />
    </CardContent>
    <CardFooter className="border-t border-[#2A3550] flex items-center justify-between pt-3">
      <Skeleton className="h-3 w-28 bg-[#2A3550]" />
      <Skeleton className="h-7 w-16 rounded-md bg-[#2A3550]" />
    </CardFooter>
  </Card>
);

export default CardSkeleton;
