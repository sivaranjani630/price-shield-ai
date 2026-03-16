import { useState } from "react";
import type { StateCommodityData, DistrictPrice } from "@/data/stateData";
import { cn } from "@/lib/utils";
import { MapPin } from "lucide-react";

interface Props {
  data: StateCommodityData;
  stateName: string;
}

const StateDistrictHeatmap = ({ data, stateName }: Props) => {
  const [selected, setSelected] = useState<DistrictPrice | null>(null);

  const riskBg = (risk: string) => {
    switch (risk) {
      case "critical": return "bg-risk-critical/25 border-risk-critical/40 text-risk-critical";
      case "high": return "bg-risk-high/25 border-risk-high/40 text-risk-high";
      case "medium": return "bg-risk-medium/25 border-risk-medium/40 text-risk-medium";
      default: return "bg-risk-low/25 border-risk-low/40 text-risk-low";
    }
  };

  return (
    <div className="glass-card p-4 space-y-3">
      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 uppercase tracking-wider">
        <MapPin className="w-4 h-4 text-primary" />
        {stateName} District Heatmap
      </h3>

      <div className="grid grid-cols-2 gap-1.5">
        {data.districts.map((d) => (
          <button
            key={d.district}
            onClick={() => setSelected(selected?.district === d.district ? null : d)}
            className={cn(
              "border rounded-md p-2 text-left transition-all hover:scale-[1.02]",
              riskBg(d.risk),
              selected?.district === d.district && "ring-1 ring-primary"
            )}
          >
            <div className="text-xs font-bold truncate">{d.district}</div>
            <div className="text-[10px] font-mono">₹{d.price} · {d.surgeProb}%</div>
          </button>
        ))}
      </div>

      {/* Selected District Detail */}
      {selected && (
        <div className="border-t border-border/50 pt-3 space-y-2 animate-slide-up">
          <h4 className="text-xs font-bold text-primary">{selected.district} — Detail</h4>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="bg-muted/30 rounded p-2">
              <span className="text-muted-foreground">Mandi Price</span>
              <div className="font-bold font-mono text-foreground">₹{selected.price}/kg</div>
            </div>
            <div className="bg-muted/30 rounded p-2">
              <span className="text-muted-foreground">Week Change</span>
              <div className={cn("font-bold font-mono", selected.weekChange > 0 ? "text-risk-high" : "text-risk-low")}>
                {selected.weekChange > 0 ? "+" : ""}{selected.weekChange}%
              </div>
            </div>
            <div className="bg-muted/30 rounded p-2">
              <span className="text-muted-foreground">vs National</span>
              <div className={cn("font-bold font-mono", selected.nationalDiff > 0 ? "text-risk-high" : "text-risk-low")}>
                {selected.nationalDiff > 0 ? "+" : ""}{selected.nationalDiff}%
              </div>
            </div>
            <div className="bg-muted/30 rounded p-2">
              <span className="text-muted-foreground">Surge Prob</span>
              <div className="font-bold font-mono text-primary">{selected.surgeProb}%</div>
            </div>
          </div>
          <div className="bg-muted/30 rounded p-2">
            <span className="text-[10px] text-muted-foreground">7-Day Trend</span>
            <div className="flex items-end gap-1 h-8 mt-1">
              {selected.trend7d.map((v, i) => {
                const min = Math.min(...selected.trend7d);
                const max = Math.max(...selected.trend7d);
                const h = ((v - min) / (max - min || 1)) * 100;
                return (
                  <div
                    key={i}
                    className={cn("flex-1 rounded-t", v > selected.trend7d[0] ? "bg-risk-high/60" : "bg-risk-low/60")}
                    style={{ height: `${Math.max(10, h)}%` }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-risk-low" />Low</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-risk-medium" />Medium</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-risk-high" />High</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-risk-critical" />Critical</span>
      </div>
    </div>
  );
};

export default StateDistrictHeatmap;
