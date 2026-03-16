import { COMMODITIES, COMMODITY_DATA, type CommodityId } from "@/data/commodities";
import { cn } from "@/lib/utils";

interface Props {
  selected: CommodityId;
  onSelect: (id: CommodityId) => void;
}

const riskDotColor = (risk: string) => {
  switch (risk) {
    case "critical": return "bg-risk-high";
    case "high": return "bg-risk-high";
    case "medium": return "bg-risk-medium";
    default: return "bg-risk-low";
  }
};

const CommoditySelector = ({ selected, onSelect }: Props) => {
  return (
    <div className="flex flex-wrap gap-2">
      {COMMODITIES.map((c) => {
        const data = COMMODITY_DATA[c.id];
        const isSelected = selected === c.id;

        return (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200 text-sm font-medium",
              isSelected
                ? "border-primary/60 bg-primary/10 text-foreground glow-primary"
                : "border-border/50 bg-card/50 text-muted-foreground hover:border-primary/30 hover:text-foreground"
            )}
          >
            <span className="text-base">{c.icon}</span>
            <span>{c.name}</span>
            <span className={cn("w-2 h-2 rounded-full", riskDotColor(data.riskLevel))} />
          </button>
        );
      })}
    </div>
  );
};

export default CommoditySelector;
