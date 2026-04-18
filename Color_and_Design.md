# Color & Design System — Event Engine

> Brand color palette and design guidelines derived from the Event Engine logo.

---

## Core Brand Identity

The logo communicates three ideas through color:

| Color  | Meaning                        |
| ------ | ------------------------------ |
| Blue   | Speed, technology, trust       |
| Orange | Action, energy, triggers       |
| Dark   | Depth, premium SaaS aesthetics |

---

## Color Palette

### Primary Colors

| Token          | Hex       | Usage                                  |
| -------------- | --------- | -------------------------------------- |
| `brand-blue`   | `#1E90FF` | Primary actions, links, highlights     |
| `brand-orange` | `#FF6A00` | CTA buttons, alerts, important actions |

### Hover States

| Token          | Hex       |
| -------------- | --------- |
| `hover-blue`   | `#3AA0FF` |
| `hover-orange` | `#FF8C2A` |

### Background System (Dark Theme — Recommended Default)

| Token          | Hex       | Usage                       |
| -------------- | --------- | --------------------------- |
| `bg-main`      | `#0B0F19` | Main page background        |
| `bg-secondary` | `#111827` | Section / panel backgrounds |
| `bg-card`      | `#1A2235` | Card and component surfaces |
| `bg-border`    | `#2A3550` | Borders and dividers        |

### Text Colors

| Token            | Hex       | Usage                   |
| ---------------- | --------- | ----------------------- |
| `text-primary`   | `#FFFFFF` | Headings                |
| `text-secondary` | `#A1A1AA` | Descriptions, body text |
| `text-muted`     | `#6B7280` | Labels, placeholders    |

### Status Colors

| Token     | Hex       | Usage          |
| --------- | --------- | -------------- |
| `success` | `#22C55E` | Success states |
| `error`   | `#EF4444` | Error states   |
| `warning` | `#F59E0B` | Warning states |
| `info`    | `#3B82F6` | Info/notice    |

### Accent Colors

| Token           | Hex       | Usage                         |
| --------------- | --------- | ----------------------------- |
| `accent-purple` | `#7C3AED` | Charts, analytics, highlights |
| `accent-cyan`   | `#06B6D4` | Charts, analytics, highlights |

---

## Gradient

The brand gradient is central to the visual identity and should be used consistently.

```
linear-gradient(90deg, #1E90FF, #FF6A00)
```

**Tailwind class:** `bg-gradient-main`

**Use for:**

- Hero section backgrounds
- Primary button backgrounds
- Page/section headings
- Progress indicators
- Logo accents

---

## Component Guidelines

### Buttons

**Primary Button**

```css
background: linear-gradient(90deg, #1e90ff, #ff6a00);
color: white;
```

Tailwind: `bg-gradient-main text-white`

**Secondary Button**

```css
background: #1a2235;
color: #ffffff;
border: 1px solid #2a3550;
```

Tailwind: `bg-bg-card text-white border border-bg-border`

---

## Pro Design Techniques

### 1. Glow Effect

```css
box-shadow: 0 0 20px rgba(30, 144, 255, 0.3);
```

### 2. Gradient Text

```css
background: linear-gradient(90deg, #1e90ff, #ff6a00);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

### 3. Dark UI + Neon Accents

The logo is already neon-style. Lean into that aesthetic — dark backgrounds with glowing blue/orange accents deliver a premium SaaS look.

---

## UI Usage Strategy

| Color    | Use For                                           |
| -------- | ------------------------------------------------- |
| Blue     | Navigation, links, active states, icons           |
| Orange   | CTA buttons (Send, Submit), highlights, alerts    |
| Gradient | Hero section, headings, primary buttons, progress |

---

## Tailwind Classes Reference

After registering in `App.css`, use these classes directly:

| Class                 | Result                    |
| --------------------- | ------------------------- |
| `bg-brand-blue`       | Blue background           |
| `bg-brand-orange`     | Orange background         |
| `text-brand-blue`     | Blue text                 |
| `text-brand-orange`   | Orange text               |
| `bg-bg-main`          | Main dark background      |
| `bg-bg-secondary`     | Secondary dark background |
| `bg-bg-card`          | Card surface background   |
| `border-bg-border`    | Border color              |
| `bg-gradient-main`    | Blue → Orange gradient    |
| `text-status-success` | Success green text        |
| `text-status-error`   | Error red text            |
| `text-status-warning` | Warning amber text        |
| `text-status-info`    | Info blue text            |
| `bg-accent-purple`    | Purple accent             |
| `bg-accent-cyan`      | Cyan accent               |

---

## Summary Palette

| Role            | Value         |
| --------------- | ------------- |
| Primary Blue    | `#1E90FF`     |
| Primary Orange  | `#FF6A00`     |
| Dark Background | `#0B0F19`     |
| Card Background | `#1A2235`     |
| Text White      | `#FFFFFF`     |
| Text Gray       | `#A1A1AA`     |
| Gradient        | Blue → Orange |
