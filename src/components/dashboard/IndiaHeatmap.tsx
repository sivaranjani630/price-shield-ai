import type { StateRisk, RiskLevel } from "@/data/commodities";
import { STATE_CODE_TO_SLUG } from "@/data/stateData";
import { cn } from "@/lib/utils";
import { MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Props {
  stateRisks: StateRisk[];
}

const riskColorClass = (risk: RiskLevel) => {
  switch (risk) {
    case "low": return "bg-risk-low/20 text-risk-low border-risk-low/30";
    case "medium": return "bg-risk-medium/20 text-risk-medium border-risk-medium/30";
    case "high": return "bg-risk-high/20 text-risk-high border-risk-high/30";
    case "critical": return "bg-risk-critical/20 text-risk-critical border-risk-critical/30";
  }
};

// Approximate map layout for Indian states
const stateLayout: Record<string, [number, number]> = {
  JK: [3, 0], PB: [1, 1], HR: [2, 1], DL: [3, 1],
  RJ: [1, 2], UP: [3, 2], BR: [4, 2], AS: [6, 2],
  GJ: [0, 3], MP: [2, 3], JH: [4, 3], WB: [5, 3],
  MH: [1, 4], CG: [3, 4], OD: [4, 4],
  GA: [1, 5], TG: [2, 5], AP: [3, 5],
  KA: [1, 6], KL: [1, 7], TN: [2, 7],
};

const IndiaHeatmap = ({ stateRisks }: Props) => {
  const navigate = useNavigate();
  return (
    <div className="glass-card p-4">
      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4 uppercase tracking-wider">
        <MapPin className="w-4 h-4 text-primary" />
        State-Wise Surge Risk
      </h3>

      <div className="relative" style={{ minHeight: 320 }}>
        <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(7, 1fr)", gridTemplateRows: "repeat(8, 1fr)" }}>
          {stateRisks.map((s) => {
            const pos = stateLayout[s.stateCode];
            if (!pos) return null;
            return (
              <div
                key={s.stateCode}
                onClick={() => {
                  const slug = STATE_CODE_TO_SLUG[s.stateCode];
                  if (slug) navigate(`/state/${slug}`);
                }}
                className={cn(
                  "border rounded-md p-1.5 text-center transition-all hover:scale-110 cursor-pointer",
                  riskColorClass(s.risk)
                )}
                style={{ gridColumn: pos[0] + 1, gridRow: pos[1] + 1 }}
              >
                <div className="text-xs font-bold">{s.stateCode}</div>
                <div className="text-[10px] font-mono">{s.surgeProb}%</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 text-[10px]">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-risk-low" />Low</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-risk-medium" />Medium</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-risk-high" />High</span>
      </div>
    </div>
  );
};

export default IndiaHeatmap;
