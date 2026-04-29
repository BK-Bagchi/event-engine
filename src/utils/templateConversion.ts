/**
 * Converts an HTML string to plain text.
 * Uses DOMParser so no extra dependency is needed.
 */
export function htmlToText(html: string): string {
  if (!html.trim()) return "";
  const doc = new DOMParser().parseFromString(html, "text/html");
  // Replace <br> with newline placeholder before text extraction
  doc.querySelectorAll("br").forEach((br) => br.replaceWith("\n"));
  // Add trailing newline to block-level elements so paragraphs stay separated
  doc
    .querySelectorAll("p, div, li, tr, h1, h2, h3, h4, h5, h6, blockquote")
    .forEach((el) => el.append("\n"));
  const text = doc.body.textContent ?? "";
  // Collapse 3+ consecutive newlines down to 2 (one blank line between paragraphs)
  return text.replace(/\n{3,}/g, "\n\n").trim();
}

/**
 * Converts plain text to a minimal HTML representation.
 * Double newlines become paragraph breaks; single newlines become <br>.
 * Template variable placeholders ({{key}}) are preserved.
 */
export function textToHtml(text: string): string {
  if (!text.trim()) return "";
  // Escape HTML special characters (but NOT { } so {{key}} placeholders survive)
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
  // Split on two or more newlines → paragraphs; single newlines → <br>
  return escaped
    .split(/\n{2,}/)
    .map((para) => `<p>${para.replace(/\n/g, "<br>")}</p>`)
    .join("\n");
}
