import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface TemplateBodyEditorProps {
  htmlValue: string;
  textValue: string;
  activeMode: "html" | "text";
  onHtmlChange: (value: string) => void;
  onTextChange: (value: string) => void;
  onModeChange: (mode: "html" | "text") => void;
}

export function TemplateBodyEditor({
  htmlValue,
  textValue,
  activeMode,
  onHtmlChange,
  onTextChange,
  onModeChange,
}: TemplateBodyEditorProps) {
  return (
    <>
      {/* HTML Template */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-zinc-300 text-sm flex items-center gap-2">
          HTML Template
          {activeMode !== "html" && (
            <span className="text-[10px] text-zinc-500 italic font-normal">
              auto-generated
            </span>
          )}
        </Label>
        <p className="text-[11px] text-zinc-600">
          The HTML-formatted body of the email.
        </p>
        <div
          className="relative group"
          onMouseEnter={activeMode !== "html" ? undefined : undefined}
        >
          <Textarea
            value={htmlValue}
            readOnly={activeMode !== "html"}
            onFocus={() => onModeChange("html")}
            onChange={(e) => onHtmlChange(e.target.value)}
            placeholder="<p>Hello {{name}},</p>"
            className={cn(
              "border-[#2A3550] text-zinc-300 placeholder:text-zinc-600 min-h-32 transition-colors",
              activeMode === "html"
                ? "bg-[#0B1120]"
                : "bg-[#0B1120]/50 cursor-default text-zinc-500",
            )}
            style={{ resize: "both" }}
          />
          {/* Hover overlay hint for read-only state */}
          {activeMode !== "html" && (
            <div className="absolute inset-0 flex items-center justify-center rounded-md bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              <span className="text-xs font-medium text-white bg-black/70 px-3 py-1.5 rounded whitespace-nowrap">
                Switch to html mode to edit
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Text Template / Rendered Preview */}
      <div className="flex flex-col gap-1.5">
        <Label className="text-zinc-300 text-sm flex items-center gap-2">
          {activeMode === "html" ? "Rendered Preview" : "Text Template"}
          {activeMode !== "text" && (
            <span className="text-[10px] text-zinc-500 italic font-normal">
              auto-generated
            </span>
          )}
        </Label>
        <p className="text-[11px] text-zinc-600">
          {activeMode === "html"
            ? "Live preview of how your HTML template will render."
            : "The plain-text fallback body of the email."}
        </p>
        {activeMode === "html" ? (
          <div
            className="relative w-full rounded-md border border-[#2A3550] cursor-pointer group"
            onClick={() => onModeChange("text")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onModeChange("text");
              }
            }}
          >
            <iframe
              title="HTML preview"
              srcDoc={`<!DOCTYPE html><html><head><style>
                  * { box-sizing: border-box; margin: 0; padding: 0; }
                  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; padding: 12px 16px; background: #0b1120; color: #e4e4e7; font-size: 14px; line-height: 1.6; }
                  h1 { font-size: 2em; font-weight: 700; margin: 0.5em 0; }
                  h2 { font-size: 1.5em; font-weight: 600; margin: 0.5em 0; }
                  h3 { font-size: 1.17em; font-weight: 600; margin: 0.5em 0; }
                  h4 { font-size: 1em; font-weight: 600; margin: 0.5em 0; }
                  p { margin: 0.6em 0; }
                  i, em { font-style: italic; }
                  b, strong { font-weight: 700; }
                  u { text-decoration: underline; }
                  s, del { text-decoration: line-through; }
                  ul { list-style: disc; padding-left: 1.5em; margin: 0.4em 0; }
                  ol { list-style: decimal; padding-left: 1.5em; margin: 0.4em 0; }
                  li { margin: 0.2em 0; }
                  a { color: #60a5fa; }
                  code { font-family: monospace; background: #1e293b; padding: 0.1em 0.3em; border-radius: 3px; font-size: 0.9em; }
                  pre { background: #1e293b; padding: 0.75em 1em; border-radius: 6px; overflow-x: auto; margin: 0.5em 0; }
                  blockquote { border-left: 3px solid #3f4f6e; padding-left: 0.75em; color: #a1a1aa; margin: 0.5em 0; }
                </style></head><body>${
                  htmlValue ||
                  '<span style="color:#52525b;font-style:italic;">Preview will appear as you type HTML above…</span>'
                }</body></html>`}
              sandbox="allow-same-origin"
              className="w-full rounded-md pointer-events-none"
              style={{
                resize: "both",
                minHeight: "8rem",
                height: "8rem",
                display: "block",
              }}
            />
            {/* Hover overlay hint */}
            <div className="absolute inset-0 flex items-center justify-center rounded-md bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              <span className="text-xs font-medium text-white bg-black/70 px-3 py-1.5 rounded whitespace-nowrap">
                Switch to text mode to edit
              </span>
            </div>
          </div>
        ) : (
          <Textarea
            value={textValue}
            onFocus={() => onModeChange("text")}
            onChange={(e) => onTextChange(e.target.value)}
            placeholder="Hello {{name}}, ..."
            className="border-[#2A3550] bg-[#0B1120] text-zinc-300 placeholder:text-zinc-600 min-h-32 transition-colors"
            style={{ resize: "both" }}
          />
        )}
      </div>
    </>
  );
}
