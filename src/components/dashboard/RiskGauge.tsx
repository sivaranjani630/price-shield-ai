import { useState } from "react";
import type { CommodityData } from "@/data/commodities";
import { cn } from "@/lib/utils";
import { Zap, ChevronDown, ChevronUp } from "lucide-react";

interface Props {
  data: CommodityData;
}

const RiskGauge = ({ data }: Props) => {
  const { surgeProb, riskLevel, volatility, arrivalDrop, weatherScore } = data;
  const [showExplanation, setShowExplanation] = useState(false);

  const gaugeAngle = (surgeProb / 100) * 180;
  const riskColor = riskLevel === "low" ? "var(--risk-low)" : riskLevel === "medium" ? "var(--risk-medium)" : "var(--risk-high)";

  // Additional mock factors for the reference design
  const transportDisruption = Math.round(15 + Math.random() * 25);
  const storageDeficit = Math.round(20 + Math.random() * 30);

  const factors = [
    { label: "Price Volatility", weight: "30%w", value: volatility, color: volatility > 40 ? "bg-risk-high" : volatility > 25 ? "bg-risk-medium" : "bg-primary" },
    { label: "Weather Anomaly", weight: "25%w", value: weatherScore, color: weatherScore > 60 ? "bg-risk-high" : weatherScore > 35 ? "bg-risk-medium" : "bg-risk-low" },
    { label: "Arrival Volume Drop", weight: "20%w", value: arrivalDrop, color: arrivalDrop > 25 ? "bg-risk-medium" : "bg-primary" },
    { label: "Transport Disruption", weight: "15%w", value: transportDisruption, color: "bg-chart-forecast" },
    { label: "Storage Deficit", weight: "10%w", value: storageDeficit, color: "bg-primary" },
  ];

  return (
    <div className="glass-card p-4">
      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3 uppercase tracking-wider">
        <Zap className="w-4 h-4 text-primary" />
        Surge Risk Assessment
      </h3>

      {/* Gauge */}
      <div className="flex justify-center mb-2">
        <div className="relative w-48 h-24 overflow-hidden">
          <svg viewBox="0 0 200 100" className="w-full h-full">
            <path d="M 10 95 A 90 90 0 0 1 190 95" fill="none" stroke="hsl(var(--muted))" strokeWidth="12" strokeLinecap="round" />
            <path d="M 10 95 A 90 90 0 0 1 190 95" fill="none" stroke={`hsl(${riskColor})`} strokeWidth="12" strokeLinecap="round" strokeDasharray={`${(gaugeAngle / 180) * 283} 283`} className="transition-all duration-1000" />
            <line x1="100" y1="95" x2={100 + 70 * Math.cos((Math.PI * (180 - gaugeAngle)) / 180)} y2={95 - 70 * Math.sin((Math.PI * (180 - gaugeAngle)) / 180)} stroke="hsl(var(--foreground))" strokeWidth="2" strokeLinecap="round" className="transition-all duration-1000" />
            <circle cx="100" cy="95" r="4" fill="hsl(var(--foreground))" />
          </svg>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
            <span className="text-2xl font-mono font-bold text-foreground">{surgeProb}</span>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Risk Score</div>
          </div>
        </div>
      </div>

      {/* Risk badge + surge prob side by side */}
      <div className="flex items-center justify-between mb-4">
        <div className={cn(
          "text-xs font-bold py-1.5 px-4 rounded-md",
          `risk-badge-${riskLevel === "critical" ? "high" : riskLevel}`
        )}>
          {riskLevel.toUpperCase()} RISK
        </div>
        <div className="text-right">
          <span className="text-xl font-mono font-bold text-risk-high">{surgeProb}%</span>
          <div className="text-[10px] text-muted-foreground uppercase">Surge Prob.</div>
        </div>
      </div>

      {/* Risk Factor Breakdown */}
      <h4 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">Risk Factor Breakdown</h4>
      <div className="space-y-3">
        {factors.map((factor) => (
          <div key={factor.label}>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-muted-foreground">{factor.label} <span className="text-muted-foreground/60">({factor.weight})</span></span>
              <span className={cn("font-mono font-semibold", factor.value > 50 ? "text-risk-high" : "text-foreground")}>{factor.value}%</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div className={cn("h-full rounded-full transition-all duration-700", factor.color)} style={{ width: `${Math.min(factor.value, 100)}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Collapsible explanation */}
      <button
        onClick={() => setShowExplanation(!showExplanation)}
        className="flex items-center gap-1 mt-4 text-xs font-semibold text-primary hover:text-primary/80 transition-colors uppercase tracking-wider"
      >
        {showExplanation ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        Why is this risk level assigned?
      </button>
      {showExplanation && (
        <div className="mt-2 p-3 rounded-lg bg-surface-elevated text-xs text-muted-foreground leading-relaxed animate-slide-up">
          The {riskLevel.toUpperCase()} risk assessment is driven primarily by elevated weather anomaly scores ({weatherScore}/100) and price volatility ({volatility}%). Combined with arrival volume drops of {arrivalDrop}%, the ensemble model projects a {surgeProb}% probability of a significant price surge within the next 14–21 days. Transport disruption and storage deficit factors contribute additional upward pressure on the risk score.
        </div>
      )}
    </div>
  );
};

export default RiskGauge;
