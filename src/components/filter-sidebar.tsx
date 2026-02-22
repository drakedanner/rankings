"use client";

export type Depth = "index" | "expanded";

type FilterSidebarProps = {
  depth: Depth;
  onDepthChange: (depth: Depth) => void;
  selectedTiers: string[];
  selectedNetworks: string[];
  selectedTags: string[];
  tierOptions: readonly string[];
  networkOptions: string[];
  tagOptions: string[];
  onTierToggle: (tier: string) => void;
  onNetworkToggle: (network: string) => void;
  onTagToggle: (tag: string) => void;
  onClear: () => void;
  drawerOpen?: boolean;
  onDrawerClose?: () => void;
};

const DEPTH_LABELS: { value: Depth; label: string }[] = [
  { value: "index", label: "Index" },
  { value: "expanded", label: "Expanded" },
];

function FilterChip({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
        selected
          ? "bg-accent text-white"
          : "bg-card text-stat-label hover:bg-[var(--secondary)]/20 hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function FilterContent({
  depth,
  onDepthChange,
  selectedTiers,
  selectedNetworks,
  selectedTags,
  tierOptions,
  networkOptions,
  tagOptions,
  onTierToggle,
  onNetworkToggle,
  onTagToggle,
  onClear,
}: Omit<FilterSidebarProps, "drawerOpen" | "onDrawerClose">) {
  const hasFilters =
    selectedTiers.length > 0 || selectedNetworks.length > 0 || selectedTags.length > 0;

  return (
    <div className="flex flex-wrap gap-3 p-3 lg:flex-col lg:gap-4">
        <div>
          <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-stat-label">
            View
          </span>
          <div className="flex flex-wrap gap-1 lg:flex-col">
            {DEPTH_LABELS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => onDepthChange(value)}
                className={`rounded px-2.5 py-1.5 text-xs font-medium transition-colors ${
                  depth === value
                    ? "bg-accent text-white"
                    : "bg-background text-secondary hover:bg-background hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-stat-label">
            Tier
          </span>
          <div className="flex flex-wrap gap-1.5">
            {tierOptions.map((tier) => (
              <FilterChip
                key={tier}
                selected={selectedTiers.includes(tier)}
                onClick={() => onTierToggle(tier)}
              >
                {tier}
              </FilterChip>
            ))}
          </div>
        </div>

        {networkOptions.length > 0 && (
          <div>
            <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-stat-label">
              Network
            </span>
            <div className="flex flex-wrap gap-1.5">
              {networkOptions.slice(0, 15).map((network) => (
                <FilterChip
                  key={network}
                  selected={selectedNetworks.includes(network)}
                  onClick={() => onNetworkToggle(network)}
                >
                  {network || "(none)"}
                </FilterChip>
              ))}
            </div>
          </div>
        )}

        {tagOptions.length > 0 && (
          <div>
            <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-stat-label">
              Tag
            </span>
            <div className="flex flex-wrap gap-1.5">
              {tagOptions.slice(0, 20).map((tag) => (
                <FilterChip
                  key={tag}
                  selected={selectedTags.includes(tag)}
                  onClick={() => onTagToggle(tag)}
                >
                  {tag}
                </FilterChip>
              ))}
            </div>
          </div>
        )}

        {hasFilters && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs font-medium text-secondary underline hover:text-foreground"
          >
            Clear filters
          </button>
        )}
    </div>
  );
}

export function FilterSidebar({
  depth,
  onDepthChange,
  selectedTiers,
  selectedNetworks,
  selectedTags,
  tierOptions,
  networkOptions,
  tagOptions,
  onTierToggle,
  onNetworkToggle,
  onTagToggle,
  onClear,
  drawerOpen = false,
  onDrawerClose,
}: FilterSidebarProps) {
  const content = (
    <FilterContent
      depth={depth}
      onDepthChange={onDepthChange}
      selectedTiers={selectedTiers}
      selectedNetworks={selectedNetworks}
      selectedTags={selectedTags}
      tierOptions={tierOptions}
      networkOptions={networkOptions}
      tagOptions={tagOptions}
      onTierToggle={onTierToggle}
      onNetworkToggle={onNetworkToggle}
      onTagToggle={onTagToggle}
      onClear={onClear}
    />
  );

  return (
    <>
      {/* Desktop: sticky sidebar (hidden below lg) */}
      <aside className="hidden shrink-0 bg-background lg:block lg:sticky lg:top-14 lg:z-10 lg:max-h-[calc(100vh-3.5rem)] lg:overflow-y-auto lg:w-56">
        {content}
      </aside>

      {/* Mobile/tablet: overlay drawer */}
      {onDrawerClose && (
        <div
          className={`fixed inset-0 z-20 lg:hidden ${drawerOpen ? "visible" : "invisible"}`}
          aria-hidden={!drawerOpen}
        >
          <button
            type="button"
            onClick={onDrawerClose}
            className="absolute inset-0 bg-foreground/20 backdrop-blur-sm transition-opacity"
            aria-label="Close filters"
          />
          <div
            className={`absolute left-0 top-0 h-full w-72 max-w-[85vw] bg-background transition-transform ${
              drawerOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="flex items-center justify-between p-3">
              <span className="text-sm font-medium text-foreground">Filters</span>
              <button
                type="button"
                onClick={onDrawerClose}
                className="rounded p-1 text-secondary hover:bg-[var(--secondary)]/20 hover:text-foreground"
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className="max-h-[calc(100vh-4rem)] overflow-y-auto">{content}</div>
          </div>
        </div>
      )}
    </>
  );
}
