import { useState } from "react";
//prettier-ignore
import { Key, Lock, Globe, Eye, EyeOff, X, Check, Copy } from "lucide-react";
//prettier-ignore
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerClose } from "@/components/ui/drawer";
import type { Project as ProjectTypes } from "@/types/project";

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
      className="p-1 rounded text-zinc-500 hover:text-zinc-300 transition-colors shrink-0"
      title="Copy"
    >
      {copied ? (
        <Check size={14} className="text-green-400" />
      ) : (
        <Copy size={14} />
      )}
    </button>
  );
};

const ProjectPreview = ({
  project,
  open,
  onClose,
}: {
  project: ProjectTypes | null;
  open: boolean;
  onClose: () => void;
}) => {
  const [showSecret, setShowSecret] = useState(false);

  if (!project) return null;

  return (
    <Drawer
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          setShowSecret(false);
          onClose();
        }
      }}
      direction="right"
    >
      <DrawerContent className="bg-[#1A2235] border-l border-[#2A3550] text-white flex flex-col gap-0 p-0">
        {/* Header */}
        <DrawerHeader className="flex-row items-center justify-between border-b border-[#2A3550] px-6 py-4">
          <div>
            <DrawerTitle className="text-zinc-100 text-base font-semibold">
              {project.name}
            </DrawerTitle>
            <DrawerDescription className="text-zinc-500 text-xs mt-0.5 font-mono">
              /{project.slug}
            </DrawerDescription>
          </div>
          <DrawerClose asChild>
            <button className="p-1.5 rounded text-zinc-400 hover:text-white hover:bg-[#2A3550] transition-colors">
              <X size={16} />
            </button>
          </DrawerClose>
        </DrawerHeader>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-6">
          {/* Description */}
          {project.description && (
            <section>
              <p className="text-[11px] uppercase tracking-widest text-zinc-500 mb-2">
                Description
              </p>
              <p className="text-sm text-zinc-300 leading-relaxed">
                {project.description}
              </p>
            </section>
          )}

          {/* Public Key */}
          <section>
            <p className="text-[11px] uppercase tracking-widest text-zinc-500 mb-2 flex items-center gap-1.5">
              <Key size={11} /> Public Key
            </p>
            <div className="flex items-center gap-2 bg-[#0B1120] border border-[#2A3550] rounded-md px-3 py-2">
              <code className="flex-1 text-xs text-zinc-300 font-mono break-all">
                {project.publicKey}
              </code>
              <CopyButton value={project.publicKey} />
            </div>
          </section>

          {/* Secret Key */}
          <section>
            <p className="text-[11px] uppercase tracking-widest text-zinc-500 mb-2 flex items-center gap-1.5">
              <Lock size={11} /> Secret Key
            </p>
            <div className="flex items-center gap-2 bg-[#0B1120] border border-[#2A3550] rounded-md px-3 py-2">
              <code className="flex-1 text-xs text-zinc-300 font-mono break-all">
                {showSecret
                  ? project.secretKey
                  : "•".repeat(Math.min(project.secretKey.length, 40))}
              </code>
              <button
                onClick={() => setShowSecret((s) => !s)}
                className="p-1 rounded text-zinc-500 hover:text-zinc-300 transition-colors shrink-0"
                title={showSecret ? "Hide" : "Reveal"}
              >
                {showSecret ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
              <CopyButton value={project.secretKey} />
            </div>
          </section>

          {/* Allowed Origins */}
          <section>
            <p className="text-[11px] uppercase tracking-widest text-zinc-500 mb-2 flex items-center gap-1.5">
              <Globe size={11} /> Allowed Origins
            </p>
            {project.allowedOrigins.length === 0 ? (
              <p className="text-xs text-zinc-500 italic">
                No origins configured
              </p>
            ) : (
              <ul className="flex flex-col gap-1.5">
                {project.allowedOrigins.map((origin) => (
                  <li
                    key={origin}
                    className="flex items-center justify-between bg-[#0B1120] border border-[#2A3550] rounded-md px-3 py-1.5"
                  >
                    <code className="text-xs text-zinc-300 font-mono">
                      {origin}
                    </code>
                    <CopyButton value={origin} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ProjectPreview;
