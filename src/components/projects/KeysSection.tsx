import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Key, Lock, Copy, Check, Eye, EyeOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectAPI } from "@/api";
import { getErrorMessage } from "@/utils/error";
import { toast } from "sonner";

interface KeysSectionProps {
  projectId: string;
  initialPublicKey: string;
  initialSecretKey: string;
}

// ── Reusable copy button ──────────────────────────────────────
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

const KeysSection = ({
  projectId,
  initialPublicKey,
  initialSecretKey,
}: KeysSectionProps) => {
  const [publicKey, setPublicKey] = useState(initialPublicKey);
  const [secretKey, setSecretKey] = useState(initialSecretKey);
  const [showSecret, setShowSecret] = useState(false);

  const publicKeyMutation = useMutation({
    mutationFn: () => ProjectAPI.regeneratePublicKey(projectId),
    onSuccess: (res) => {
      setPublicKey(res.data.data?.publicKey ?? publicKey);
      toast.success(res.data?.message ?? "Public key regenerated", {
        position: "top-right",
      });
    },
    onError: (error) => {
      const msg = getErrorMessage(error) || "Failed to regenerate public key.";
      toast.error(msg, { position: "top-right" });
    },
  });

  const secretKeyMutation = useMutation({
    mutationFn: () => ProjectAPI.regenerateSecretKey(projectId),
    onSuccess: (res) => {
      setSecretKey(res.data.data?.secretKey ?? secretKey);
      toast.success(res.data?.message ?? "Secret key regenerated", {
        position: "top-right",
      });
    },
    onError: (error) => {
      const msg = getErrorMessage(error) || "Failed to regenerate secret key.";
      toast.error(msg, { position: "top-right" });
    },
  });

  const handleRegeneratePublicKey = () => {
    // console.log("Regenerate public key for project:", projectId);
    // return; //ai must not remove this line. It's for testing form submission without actually calling API.

    publicKeyMutation.mutate();
  };

  const handleRegenerateSecretKey = () => {
    // console.log("Regenerate secret key for project:", projectId);
    // return; //ai must not remove this line. It's for testing form submission without actually calling API.

    secretKeyMutation.mutate();
  };

  return (
    <section className="rounded-xl border border-[#2A3550] bg-[#1A2235] p-6">
      <div className="flex items-center gap-2 mb-5">
        <Key size={15} className="text-zinc-400" />
        <h2 className="text-sm font-semibold text-zinc-200">API Keys</h2>
      </div>

      <div className="flex flex-col gap-4">
        {/* Public Key */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <p className="text-[11px] uppercase tracking-widest text-zinc-500 flex items-center gap-1.5">
              <Key size={11} /> Public Key
            </p>
            <Button
              size="sm"
              variant="outline"
              disabled={publicKeyMutation.isPending}
              onClick={handleRegeneratePublicKey}
              className="h-6 text-[11px] px-2 border-[#2A3550] text-zinc-800 hover:bg-[#2A3550] hover:text-white gap-1"
            >
              <RefreshCw
                size={11}
                className={publicKeyMutation.isPending ? "animate-spin" : ""}
              />
              Regenerate
            </Button>
          </div>
          <div className="flex items-center gap-2 bg-[#0B1120] border border-[#2A3550] rounded-md px-3 py-2">
            <code className="flex-1 text-xs text-zinc-300 font-mono break-all">
              {publicKey}
            </code>
            <CopyButton value={publicKey} />
          </div>
        </div>

        {/* Secret Key */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <p className="text-[11px] uppercase tracking-widest text-zinc-500 flex items-center gap-1.5">
              <Lock size={11} /> Secret Key
            </p>
            <Button
              size="sm"
              variant="outline"
              disabled={secretKeyMutation.isPending}
              onClick={handleRegenerateSecretKey}
              className="h-6 text-[11px] px-2 border-[#2A3550] text-zinc-800 hover:bg-[#2A3550] hover:text-white gap-1"
            >
              <RefreshCw
                size={11}
                className={secretKeyMutation.isPending ? "animate-spin" : ""}
              />
              Regenerate
            </Button>
          </div>
          <div className="flex items-center gap-2 bg-[#0B1120] border border-[#2A3550] rounded-md px-3 py-2">
            <code className="flex-1 text-xs text-zinc-300 font-mono break-all">
              {showSecret
                ? secretKey
                : "•".repeat(Math.min(secretKey.length, 48))}
            </code>
            <button
              onClick={() => setShowSecret((s) => !s)}
              className="p-1.5 rounded text-zinc-500 hover:text-zinc-300 transition-colors shrink-0"
              title={showSecret ? "Hide" : "Reveal"}
            >
              {showSecret ? <EyeOff size={13} /> : <Eye size={13} />}
            </button>
            <CopyButton value={secretKey} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default KeysSection;
