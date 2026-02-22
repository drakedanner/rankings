# 2025 TV Show Rankings — Website Spec

## Overview

A polished, public-facing website that ranks and displays TV shows released in 2025. The site draws editorial inspiration from The Ringer — clean typography, confident layout, light theme, sharp visual hierarchy. Users can browse shows across multiple views, filter by attributes, and expand individual entries for more detail.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js (App Router) with TypeScript |
| Styling | Tailwind CSS |
| Database | PostgreSQL |
| ORM | Prisma |
| Hosting | Vercel (frontend) + Neon or Supabase (managed Postgres) |
| Image Source | TVMaze (api.tvmaze.com) or hand-sourced cover URLs |

---

## Data Model

### Shows Table (`shows`)

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` / `serial` | Primary key |
| `name` | `text` | Show title |
| `season` | `integer` | Season number (each season is its own row) |
| `network` | `text` | Network or streaming platform |
| `tags` | `text[]` | Array of tags from a fixed set |
| `score` | `decimal(3,1)` | 0.0–10.0 |
| `tier` | `text` | One of: S, A, B, C, D, F, Z |
| `description` | `text` | Written blurb (displayed on row expand) |
| `cover_url` | `text` | URL to poster/cover image |
| `created_at` | `timestamp` | Auto-set |
| `updated_at` | `timestamp` | Auto-set |

### Fixed Tag Set

Tags are drawn from a predefined list. Examples include:

- Feel Something
- May Cry
- Enjoyed
- LOL Writers
- IRL LOL
- Bravo Writers
- Don't Watch
- Expired
- Forgettable
- Zeitgeist

*(Full list to be provided via CSV import.)*

### Tier Definitions

Tiers are manually assigned. The tier order for sorting/display is:

```
S > A > B > C > D > F > Z
```

`Z` is a custom bottom tier below `F`.

---

## Seed / Import

- Provide a seed script (`prisma/seed.ts`) that reads a CSV file and populates the database.
- CSV columns: `name, season, network, tags, score, tier`
- Tags in CSV are pipe-delimited (e.g. `Feel Something|Zeitgeist`)
- `description` and `cover_url` can be nullable initially — they'll be populated later either manually via TablePlus or through a TVMaze fetch script / hand-sourced URLs.

---

## Pages & Views

### 1. Index View (Default — `/`)

The primary view. A sortable, filterable table/list of all shows.

**Layout:**
- Each show is a row displaying: rank number, show name, season, network, score, tier badge, tags (as pills)
- Default sort: by tier (S first → Z last), then by score descending within each tier
- Clicking a row expands it inline to reveal:
  - Cover image (if available)
  - Written description
  - Full tag list
  - *(Expand details can be refined later)*

**Filtering:**
- Filter by tier (multi-select)
- Filter by network (multi-select)
- Filter by tag (multi-select)
- Filters should be combinable (AND logic across categories, OR logic within a category)

**Design notes:**
- Light theme, editorial feel inspired by The Ringer
- Clean sans-serif typography (e.g. Inter, National, or similar)
- Tier badges should be color-coded (S = gold, A = purple, B = blue, C = green, D = orange, F = red, Z = gray — adjust to taste)
- Rows should have subtle hover states
- Expand/collapse should animate smoothly

### 2. Tier View (`/tiers`)

A classic tier list layout.

**Layout:**
- Horizontal rows, one per tier (S through Z)
- Each tier row is labeled on the left with the tier letter + color
- Shows are displayed as cover thumbnails within each row, sorted by score descending
- Hovering a cover shows a tooltip with: show name, season, score, network
- If no cover image exists, show a styled placeholder card with the show name

**Design notes:**
- This should look and feel like the iconic tier list meme format
- Rows should scroll horizontally if there are many shows in one tier
- Tier labels should use the same color coding as the index view

### 3. Cover View (`/covers`)

A visual grid focused on show artwork.

**Layout:**
- Grid of show poster/cover images
- Each card shows: cover image, show name overlaid or below, score badge, tier badge
- Default sort: same as index (tier → score)
- Same filtering controls as the index view

**Design notes:**
- Grid should be responsive (4-5 columns on desktop, 2-3 on tablet, 1-2 on mobile)
- Cards should have a subtle shadow/border and hover effect
- Score and tier badges positioned consistently (e.g. top-right corner of cover)

---

## Navigation

- Sticky top nav bar with:
  - Site title/logo on the left
  - View switcher tabs: **Rankings** (index) · **Tiers** · **Covers**
- Active view should be visually indicated
- Nav should be minimal and not compete with the content

---

## Design System

### Theme: Light, Editorial

- **Background:** White or very light warm gray (`#FAFAF9` or similar)
- **Text:** Near-black (`#1A1A1A`)
- **Accent:** One strong brand color for interactive elements (links, active states)
- **Typography:** Clean sans-serif. Use font weight and size for hierarchy, not color.
- **Cards/Rows:** White with subtle border or shadow, clean separation
- **Tier Colors:** Distinct, saturated but not garish. Should work on white backgrounds.

### Responsive Behavior

- Desktop-first design, fully responsive down to mobile
- Index view: table layout on desktop, card-style stacking on mobile
- Tier view: horizontal scroll within tier rows on all sizes
- Cover view: responsive grid

---

## Cover Image Strategy

Show covers/posters are hand-sourced or fetched from [TVMaze API](https://www.tvmaze.com/api) (api.tvmaze.com). Implementation approach:

1. **Hand-sourced:** `cover_url` is nullable in the DB. Covers can be added manually via TablePlus or CSV.
2. **Optional script:** `npm run covers:fetch` uses TVMaze search by show name and writes the image URL to the DB (no API key required).
3. **Fallback:** When no cover exists, render a styled placeholder card with the show name and tier color.

---

## API Routes

| Route | Method | Purpose |
|---|---|---|
| `/api/shows` | GET | Fetch all shows (supports query params for filtering/sorting) |
| `/api/shows/[id]` | GET | Fetch single show detail |

Query params for `/api/shows`:
- `tier` — comma-separated tier filter
- `network` — comma-separated network filter
- `tag` — comma-separated tag filter
- `sort` — field to sort by (default: `tier,score`)
- `order` — `asc` or `desc`

---

## File Structure (Suggested)

```
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── data/
│       └── shows.csv
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Index view
│   │   ├── tiers/
│   │   │   └── page.tsx          # Tier list view
│   │   ├── covers/
│   │   │   └── page.tsx          # Cover grid view
│   │   └── api/
│   │       └── shows/
│   │           ├── route.ts
│   │           └── [id]/
│   │               └── route.ts
│   ├── components/
│   │   ├── nav.tsx
│   │   ├── show-row.tsx          # Index view row + expand
│   │   ├── show-card.tsx         # Cover view card
│   │   ├── tier-row.tsx          # Tier view row
│   │   ├── tier-badge.tsx
│   │   ├── tag-pill.tsx
│   │   ├── filter-bar.tsx
│   │   └── placeholder-cover.tsx
│   ├── lib/
│   │   ├── db.ts                 # Prisma client
│   │   ├── types.ts
│   │   └── constants.ts          # Tier order, colors, tag list
│   └── styles/
│       └── globals.css
├── public/
├── tailwind.config.ts
├── next.config.ts
├── tsconfig.json
└── package.json
```

---

## Out of Scope (Future)

- Search functionality
- User accounts / auth
- Admin panel for managing shows
- TVMaze auto-import
- Dark mode toggle
- Social sharing / OG images
- Comments or user ratings

---

## Getting Started (for Cursor)

1. Scaffold Next.js project with TypeScript + Tailwind
2. Set up Prisma with PostgreSQL connection
3. Create schema and run migration
4. Build seed script to import CSV
5. Build the index view first (most complex — table, expand, filters)
6. Add tier view and cover view
7. Polish responsive behavior and design details