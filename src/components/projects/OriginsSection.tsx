import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Globe, Plus, Trash2, Copy, Check } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProjectAPI } from "@/api";
import { getErrorMessage } from "@/utils/error";
import { toast } from "sonner";

interface OriginsSectionProps {
  projectId: string;
  initialOrigins: string[];
}

// ── Copy button ───────────────────────────────────────────────
const CopyButton = ({ value }: { value: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="p-1.5 rounded text-zinc-500 hover:text-zinc-300 transition-colors shrink-0"
      title="Copy"
    >
      {copied ? (
        <Check size={13} className="text-green-400" />
      ) : (
        <Copy size={13} />
      )}
    </button>
  );
};

/** Accepts only scheme + host + optional port — no path / query / fragment */
const isValidOrigin = (val: string) => {
  try {
    const u = new URL(val);
    return (
      (u.protocol === "http:" || u.protocol === "https:") &&
      (u.pathname === "/" || u.pathname === "") &&
      u.search === "" &&
      u.hash === ""
    );
  } catch {
    return false;
  }
};

const OriginsSection = ({ projectId, initialOrigins }: OriginsSectionProps) => {
  const [origins, setOrigins] = useState<string[]>(initialOrigins);
  const [newOrigin, setNewOrigin] = useState("https://");
  const [inputError, setInputError] = useState("");

  const addMutation = useMutation({
    mutationFn: (origin: string) =>
      ProjectAPI.addAllowedOrigin(projectId, { origin }),
    onSuccess: (res, origin) => {
      setOrigins((prev) => [...prev, origin]);
      setNewOrigin("https://");
      toast.success(res.data?.message ?? "Origin added", {
        position: "top-right",
      });
    },
    onError: (error) => {
      const msg = getErrorMessage(error) || "Failed to add origin.";
      toast.error(msg, { position: "top-right" });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (origin: string) =>
      ProjectAPI.removeAllowedOrigin(projectId, { origin }),
    onSuccess: (res, origin) => {
      setOrigins((prev) => prev.filter((o) => o !== origin));
      toast.success(res.data?.message ?? "Origin removed", {
        position: "top-right",
      });
    },
    onError: (error) => {
      const msg = getErrorMessage(error) || "Failed to remove origin.";
      toast.error(msg, { position: "top-right" });
    },
  });

  const handleAdd = () => {
    if (!isValidOrigin(newOrigin)) {
      setInputError(
        "Must be a valid origin like https://diptoverse.com (no path, query, or fragment)",
      );
      return;
    }
    if (origins.includes(newOrigin)) {
      setInputError("This origin is already in the list.");
      return;
    }
    setInputError("");
    addMutation.mutate(newOrigin);
  };

  const handleRemove = (origin: string) => {
    removeMutation.mutate(origin);
  };

  return (
    <section className="rounded-xl border border-[#2A3550] bg-[#1A2235] p-6">
      <div className="flex items-center gap-2 mb-5">
        <Globe size={15} className="text-zinc-400" />
        <h2 className="text-sm font-semibold text-zinc-200">Allowed Origins</h2>
      </div>

      {/* Existing origins */}
      <div className="flex flex-col gap-2 mb-4">
        {origins.length === 0 ? (
          <p className="text-xs text-zinc-500 italic">No origins configured.</p>
        ) : (
          origins.map((origin) => (
            <div
              key={origin}
              className="flex items-center justify-between bg-[#0B1120] border border-[#2A3550] rounded-md px-3 py-2"
            >
              <code className="flex-1 text-xs text-zinc-300 font-mono break-all">
                {origin}
              </code>
              <div className="flex items-center gap-1 shrink-0">
                <CopyButton value={origin} />
                <button
                  onClick={() => handleRemove(origin)}
                  disabled={
                    removeMutation.isPending &&
                    removeMutation.variables === origin
                  }
                  className="p-1.5 rounded text-zinc-500 hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Remove"
                >
                  {removeMutation.isPending &&
                  removeMutation.variables === origin ? (
                    <Spinner className="size-4 text-red-400" />
                  ) : (
                    <Trash2 size={13} />
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add new origin */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <Input
            value={newOrigin}
            onChange={(e) => {
              setNewOrigin(e.target.value);
              setInputError("");
            }}
            onKeyDown={(e) =>
              e.key === "Enter" && (e.preventDefault(), handleAdd())
            }
            placeholder="https://example.com"
            className="flex-1 bg-[#0B1120] border-[#2A3550] text-white placeholder:text-zinc-500 focus-visible:ring-brand-blue/40"
          />
          <Button
            type="button"
            size="sm"
            disabled={addMutation.isPending}
            onClick={handleAdd}
            className="bg-brand-blue hover:bg-brand-hover-blue text-white gap-1 shrink-0"
          >
            {addMutation.isPending && <Spinner className="size-4 text-white" />}
            <Plus size={14} />
            Add Origin
          </Button>
        </div>
        {inputError && <p className="text-xs text-red-400">{inputError}</p>}
      </div>
    </section>
  );
};

export default OriginsSection;
