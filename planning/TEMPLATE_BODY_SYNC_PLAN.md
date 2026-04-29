# Template Body Sync — Planning Document

## Goal

When the user edits either `htmlTemplate` or `textTemplate`, the other field should be **automatically derived** from the input so both fields always carry equivalent content. The user only writes in one field; the other is a read-only computed output.

---

## UX Model

| User edits     | Auto-derived                                    |
| -------------- | ----------------------------------------------- |
| `htmlTemplate` | `textTemplate` (strip tags, preserve structure) |
| `textTemplate` | `htmlTemplate` (wrap lines/paragraphs in HTML)  |

### Field States

- **Active / Source** — the field the user is currently typing in (editable, full border highlight).
- **Derived / Output** — the other field (read-only, dimmed label, badge "auto-generated").

Switching which field to edit: a toggle button or simply clicking/focusing the field.

---

## Conversion Logic

### 1. HTML → Plain Text

Use the browser-native `DOMParser` (no extra dependency):

```ts
// src/utils/templateConversion.ts
export function htmlToText(html: string): string {
  if (!html.trim()) return "";
  const doc = new DOMParser().parseFromString(html, "text/html");
  // Replace <br> and block-level closing tags with newlines before extraction
  doc.querySelectorAll("br").forEach((br) => br.replaceWith("\n"));
  doc
    .querySelectorAll("p, div, li, tr, h1, h2, h3, h4, h5, h6")
    .forEach((el) => {
      el.append("\n");
    });
  return (doc.body.textContent ?? "").replace(/\n{3,}/g, "\n\n").trim();
}
```

Key transformations:

- `<br>` → `\n`
- Block elements (`<p>`, `<div>`, `<h1>`…) get a trailing `\n`
- Collapse 3+ consecutive newlines to 2
- Decode HTML entities automatically via `textContent`

### 2. Plain Text → HTML

Simple rule-based conversion (no dependency):

```ts
export function textToHtml(text: string): string {
  if (!text.trim()) return "";
  // Escape HTML special chars first
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
  // Double newline = paragraph break, single newline = <br>
  return escaped
    .split(/\n{2,}/)
    .map((para) => `<p>${para.replace(/\n/g, "<br>")}</p>`)
    .join("\n");
}
```

Output example:

```
Input text:
  Hello {{name}},
  Welcome!

  Your code is {{code}}.

Output HTML:
  <p>Hello {{name}},<br>Welcome!</p>
  <p>Your code is {{code}}.</p>
```

---

## State Design (Body.tsx)

```ts
type ActiveMode = "html" | "text";

const [activeMode, setActiveMode] = useState<ActiveMode>("html");
const [htmlValue, setHtmlValue] = useState(template.htmlTemplate ?? "");
const [textValue, setTextValue] = useState(template.textTemplate ?? "");
```

### On HTML change

```ts
function handleHtmlChange(val: string) {
  setHtmlValue(val);
  setTextValue(htmlToText(val)); // derive text
}
```

### On Text change

```ts
function handleTextChange(val: string) {
  setTextValue(val);
  setHtmlValue(textToHtml(val)); // derive html
}
```

### Focus-based mode switching

```tsx
<Textarea
  value={htmlValue}
  onFocus={() => setActiveMode("html")}
  onChange={(e) => handleHtmlChange(e.target.value)}
  readOnly={activeMode !== "html"}
/>
<Textarea
  value={textValue}
  onFocus={() => setActiveMode("text")}
  onChange={(e) => handleTextChange(e.target.value)}
  readOnly={activeMode !== "text"}
/>
```

---

## Performance — Debounce

Conversion runs on every keystroke. For large templates add a debounce:

```ts
// src/hooks/useDebounce.ts  (likely already exists or trivial to add)
import { useEffect, useState } from "react";
export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}
```

Then derive in a `useEffect` instead of inline:

```ts
const debouncedHtml = useDebounce(htmlValue, 250);
useEffect(() => {
  if (activeMode === "html") setTextValue(htmlToText(debouncedHtml));
}, [debouncedHtml]);
```

---

## UI Changes in Body.tsx

### Section header upgrade

Add a mode toggle (pill tabs or two buttons) above the textareas:

```
[ Edit as HTML ]  [ Edit as Text ]
```

Or rely on focus — whichever the user clicks becomes source.

### Field labels

- Active field: normal label + editable style.
- Derived field: label + small badge `auto-generated` (zinc-500, italic).
- Derived textarea: `readOnly`, slightly dimmed background (`bg-[#0B1120]/60`), cursor `default`.

### Visual indicator concept

```tsx
<Label className="text-zinc-300 text-sm flex items-center gap-2">
  HTML Template
  {activeMode !== "html" && (
    <span className="text-[10px] text-zinc-500 italic font-normal">
      auto-generated
    </span>
  )}
</Label>
```

---

## Save Flow

When the user submits the edit form (or hits Save), send **both** `htmlTemplate` and `textTemplate` values — one from the user's input, one from the auto-derived state. This means the API always receives a consistent pair.

---

## Dependencies

| Need        | Library             | Install | Notes                  |
| ----------- | ------------------- | ------- | ---------------------- |
| HTML → Text | Browser `DOMParser` | none    | Native, no bundle cost |
| Text → HTML | Custom function     | none    | Simple, no lib needed  |
| Debounce    | Custom hook         | none    | ~10 lines              |

**No new npm packages required.**

---

## Files to Create / Modify

| File                                 | Action                  | What changes                                                                                                           |
| ------------------------------------ | ----------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `src/utils/templateConversion.ts`    | **Create**              | `htmlToText()` and `textToHtml()` functions                                                                            |
| `src/hooks/useDebounce.ts`           | **Create** (if missing) | Generic debounce hook                                                                                                  |
| `src/features/templates/Body.tsx`    | **Modify**              | Add `activeMode`, `htmlValue`, `textValue` state; wire onChange/onFocus; add "auto-generated" badges; keep Save wiring |
| `src/forms/EditTemplateBodyForm.tsx` | **Create** (optional)   | Extracted form if edit is moved to a dialog/sheet                                                                      |

---

## Implementation Steps (Ordered)

1. **Create `src/utils/templateConversion.ts`** — `htmlToText` + `textToHtml`.
2. **Create `src/hooks/useDebounce.ts`** (if not present).
3. **Modify `Body.tsx`**:
   a. Add `activeMode`, `htmlValue`, `textValue` state initialised from `template`.
   b. Replace the two read-only `Textarea`s with controlled, focus-aware ones.
   c. Wire `handleHtmlChange` / `handleTextChange` with debounced derive.
   d. Add `auto-generated` badge to the derived label.
4. **Wire Save** — ensure the form/mutation receives both values.
5. **Test edge cases**:
   - Empty input clears the derived field.
   - Template variables `{{key}}` survive both conversions intact.
   - Switching modes resets derived field from current source.

---

## Edge Cases & Constraints

| Case                                | Handling                                                                                                          |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `{{key}}` placeholders              | Survive because `textContent` preserves text nodes; `textToHtml` only escapes `<`, `>`, `&`, `"` — not `{` or `}` |
| Pasting raw HTML into text mode     | Shown as escaped literal text (by design — user chose text mode)                                                  |
| Very large templates                | Debounce (250ms) prevents excessive re-renders                                                                    |
| Initial load (both fields from API) | Initialise `htmlValue` and `textValue` from template; `activeMode` defaults to `"html"`                           |
| Clearing one field                  | Derived field also clears                                                                                         |
