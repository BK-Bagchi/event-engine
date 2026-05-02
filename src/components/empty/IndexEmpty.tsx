import { AlertCircle, type LucideIcon } from "lucide-react";
//prettier-ignore
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";

interface IndexEmptyProps {
  Icon?: LucideIcon;
  emptyTitle: string;
  emptyDescription: string;
}

const IndexEmpty = ({
  Icon = AlertCircle,
  emptyTitle,
  emptyDescription,
}: IndexEmptyProps) => {
  return (
    <Empty className="col-span-3 border-[#2A3550] bg-[#1A2235]/50">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon className="text-zinc-600" />
        </EmptyMedia>
        <EmptyTitle className="text-zinc-400">{emptyTitle}</EmptyTitle>
        <EmptyDescription className="text-zinc-600">
          {emptyDescription}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
};

export default IndexEmpty;
