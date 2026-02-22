export function TagPill({ tag }: { tag: string }) {
  return (
    <span className="inline-flex items-center rounded bg-[var(--secondary)]/10 px-2.5 py-0.5 text-xs uppercase tracking-wider text-stat-label">
      {tag}
    </span>
  );
}
