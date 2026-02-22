"use client";

type FilterBarProps = {
  selectedTiers: string[];
  selectedNetworks: string[];
  selectedTags: string[];
  tierOptions: string[];
  networkOptions: string[];
  tagOptions: string[];
  onTierToggle: (tier: string) => void;
  onNetworkToggle: (network: string) => void;
  onTagToggle: (tag: string) => void;
  onClear: () => void;
};

export function FilterBar({
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
}: FilterBarProps) {
  const hasFilters =
    selectedTiers.length > 0 || selectedNetworks.length > 0 || selectedTags.length > 0;

  return (
    <div className="flex flex-wrap items-center gap-4 border-b border-card bg-card px-4 py-3 sm:px-6">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs font-medium uppercase tracking-wider text-stat-label">Tier</span>
        {tierOptions.map((tier) => (
          <button
            key={tier}
            type="button"
            onClick={() => onTierToggle(tier)}
            className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
              selectedTiers.includes(tier)
                ? "bg-accent text-white"
                : "bg-background text-secondary hover:bg-foreground hover:text-background"
            }`}
          >
            {tier}
          </button>
        ))}
      </div>
      {networkOptions.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wider text-stat-label">
            Network
          </span>
          {networkOptions.slice(0, 15).map((network) => (
            <button
              key={network}
              type="button"
              onClick={() => onNetworkToggle(network)}
              className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                selectedNetworks.includes(network)
                  ? "bg-accent text-white"
                  : "bg-background text-secondary hover:bg-foreground hover:text-background"
              }`}
            >
              {network || "(none)"}
            </button>
          ))}
        </div>
      )}
      {tagOptions.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wider text-stat-label">Tag</span>
          {tagOptions.slice(0, 20).map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => onTagToggle(tag)}
              className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                selectedTags.includes(tag)
                  ? "bg-accent text-white"
                  : "bg-background text-secondary hover:bg-foreground hover:text-background"
              }`}
            >
              {tag}
            </button>
          ))}
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
