import { ArrowLeft, type LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface BackButtonProps {
  to?: string | number;
  text?: string;
  icon?: LucideIcon;
  className?: string;
}

const BackButton = ({
  to = -1,
  text = "Back",
  icon: Icon = ArrowLeft,
  className,
}: BackButtonProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (typeof to === "number") navigate(to);
    else navigate(to as string);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-200 transition-colors w-fit",
        className,
      )}
    >
      <Icon size={14} />
      {text}
    </button>
  );
};

export default BackButton;

/*
 * ── USAGE EXAMPLES ──────────────────────────────────────────
 *
 * 1. Default usage (Back button, navigate(-1)):
 *    <BackButton />
 *
 * 2. Custom text and path:
 *    <BackButton to="/dashboard/projects" text="Back to Projects" />
 *
 * 3. Custom icon:
 *    import { ChevronLeft } from "lucide-react";
 *    <BackButton icon={ChevronLeft} text="Go Back" />
 *
 * 4. With custom className:
 *    <BackButton text="Back" className="text-white hover:text-zinc-100" />
 *
 * 5. All props combined:
 *    import { ChevronLeft } from "lucide-react";
 *    <BackButton
 *      to="/dashboard"
 *      text="Return Home"
 *      icon={ChevronLeft}
 *      className="font-semibold"
 *    />
 *
 * 6. Relative navigation (go back 2 pages):
 *    <BackButton to={-2} text="Go Back 2" />
 */
