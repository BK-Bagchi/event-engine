import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
//prettier-ignore
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="h-[90vh] flex items-center justify-center bg-[#0B1120] px-4">
      <Empty className="max-w-md border-0">
        <EmptyHeader>
          <EmptyMedia className="flex size-16 items-center justify-center rounded-lg bg-brand-blue/10">
            <AlertCircle
              size={32}
              className="text-brand-blue"
              strokeWidth={1.5}
            />
          </EmptyMedia>

          <EmptyTitle className="text-xl font-semibold text-white">
            Page Not Found
          </EmptyTitle>

          <EmptyDescription className="text-zinc-400">
            The page you are looking for might have been removed, had its name
            changed, or is temporarily unavailable.
          </EmptyDescription>
        </EmptyHeader>

        {/* Action buttons */}
        <div className="flex gap-3 w-full mt-4">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="flex-1 bg-[#1A2235] border-[#2A3550] text-zinc-200 hover:bg-[#111827]"
          >
            Go Back
          </Button>
          <Button
            onClick={() => navigate("/")}
            className="flex-1 bg-brand-blue text-white hover:bg-brand-hover-blue hover:text-white"
          >
            Go Home
          </Button>
        </div>
      </Empty>
    </div>
  );
}
