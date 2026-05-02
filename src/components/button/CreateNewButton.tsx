import { Plus, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CreateNewButtonProps {
  onClick: () => void;
  title: string;
  Icon?: LucideIcon;
  className?: string;
}

export const CreateNewButton = ({
  onClick,
  title,
  Icon = Plus,
  className,
}: CreateNewButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className={cn(
        "bg-brand-blue hover:bg-brand-hover-blue text-white font-semibold flex items-center gap-2",
        className,
      )}
    >
      <Icon size={16} />
      {title}
    </Button>
  );
};
