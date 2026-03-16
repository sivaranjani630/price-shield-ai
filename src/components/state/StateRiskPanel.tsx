import type { StateCommodityData } from "@/data/stateData";
import { cn } from "@/lib/utils";
import { ShieldAlert, Droplets, Thermometer, Truck, Warehouse } from "lucide-react";

interface Props {
  data: StateCommodityData;
  stateName: string;
}

const factors = [
  { key: "rainfallAnomaly" as const, label: "Rainfall Anomaly", icon: Droplets, weight: 25, unit: "%" },
  { key: "tempDeviation" as const, label: "Temp Deviation", icon: Thermometer, weight: 20, unit: "°C" },
  { key: "arrivalDrop" as const, label: "Arrival Volume Drop", icon: Warehouse, weight: 30, unit: "%" },
  { key: "transportDisruption" as const, label: "Transport Disruption", icon: Truck, weight: 25, unit: "%" },
];

const StateRiskPanel = ({ data, stateName }: Props) => {
  const riskColor = data.riskLevel === "critical" ? "text-risk-critical" : data.riskLevel === "high" ? "text-risk-high" : data.riskLevel === "medium" ? "text-risk-medium" : "text-risk-low";

  // Calculate composite score
  const composite = Math.round(
    (data.rainfallAnomaly * 0.25 + Math.min(data.tempDeviation * 15, 100) * 0.20 + data.arrivalDrop * 0.30 + data.transportDisruption * 0.25)
  );

  return (
    <div className="glass-card p-4 space-y-4">
      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 uppercase tracking-wider">
        <ShieldAlert className="w-4 h-4 text-primary" />
        {stateName} Risk Score
      </h3>

      {/* Score Display */}
      <div className="text-center py-4">
        <div className={cn("text-5xl font-black font-mono", riskColor)}>{data.surgeProb}%</div>
        <div className={cn("text-sm font-bold uppercase mt-1", riskColor)}>{data.riskLevel} Risk</div>
        <div className="text-[10px] text-muted-foreground mt-1">Composite Score: {composite}/100</div>
      </div>

      {/* Factor Breakdown */}
      <div className="space-y-3">
        {factors.map((f) => {
          const val = f.key === "tempDeviation" ? data[f.key] : data[f.key];
          const normalizedVal = f.key === "tempDeviation" ? Math.min(data[f.key] * 20, 100) : Math.min(data[f.key], 100);
          const barColor = normalizedVal > 60 ? "bg-risk-high" : normalizedVal > 30 ? "bg-risk-medium" : "bg-risk-low";

          return (
            <div key={f.key} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <f.icon className="w-3 h-3" />
                  {f.label} ({f.weight}%)
                </span>
                <span className="font-mono font-bold text-foreground">
                  {f.key === "tempDeviation" ? "+" : ""}{val}{f.unit}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div className={cn("h-full rounded-full transition-all", barColor)} style={{ width: `${normalizedVal}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Explanation */}
      <div className="border-t border-border/50 pt-3">
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          <span className="text-primary font-semibold">Why this risk level:</span>{" "}
          {data.riskLevel === "critical" || data.riskLevel === "high"
            ? `${stateName} is experiencing ${data.rainfallAnomaly > 25 ? "significant rainfall deviation" : "supply chain stress"} combined with ${data.arrivalDrop > 15 ? `a ${data.arrivalDrop}% drop in mandi arrivals` : "transport bottlenecks"}. Temperature anomaly of +${data.tempDeviation}°C is ${data.tempDeviation > 2 ? "accelerating spoilage rates" : "within tolerance"}.`
            : `${stateName} indicators are within normal ranges. Continue monitoring for seasonal variations.`
          }
        </p>
      </div>
    </div>
  );
};

export default StateRiskPanel;
