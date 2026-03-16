import type { CommodityData } from "@/data/commodities";
import { COMMODITIES } from "@/data/commodities";
import { BarChart3, TrendingUp, AlertTriangle, Zap } from "lucide-react";

interface Props {
  data: CommodityData;
}

const StatsBar = ({ data }: Props) => {
  const commodity = COMMODITIES.find(c => c.id === data.id)!;
  const forecastPeak = Math.max(...data.forecast.map(f => f.price));
  const highRiskStates = data.stateRisks.filter(s => s.risk === "high" || s.risk === "critical").length;

  const stats = [
    {
      icon: <BarChart3 className="w-4 h-4" />,
      label: "Current Price",
      value: `₹${data.currentPrice.toFixed(1)}`,
      sub: `↑ ${Math.abs(data.weekChange)}% vs 7d ago`,
      subColor: data.weekChange > 0 ? "text-risk-high" : "text-risk-low",
    },
    {
      icon: <TrendingUp className="w-4 h-4" />,
      label: "30D Forecast Peak",
      value: `₹${forecastPeak.toFixed(1)}`,
      sub: `${commodity.unit}`,
      subColor: "text-muted-foreground",
      valueColor: "text-risk-high",
    },
    {
      icon: <AlertTriangle className="w-4 h-4" />,
      label: "High Risk States",
      value: `${highRiskStates}`,
      sub: `of ${data.stateRisks.length} monitored`,
      subColor: "text-muted-foreground",
    },
    {
      icon: <Zap className="w-4 h-4" />,
      label: "AI Confidence",
      value: "92%",
      sub: "LSTM + Prophet ensemble",
      subColor: "text-muted-foreground",
      valueColor: "text-risk-low",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((s) => (
        <div key={s.label} className="glass-card p-4">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-muted-foreground">{s.icon}</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.label}</span>
          </div>
          <div className={`text-2xl font-mono font-bold ${s.valueColor || "text-foreground"}`}>
            {s.value}
          </div>
          <span className={`text-xs ${s.subColor} font-mono`}>{s.sub}</span>
        </div>
      ))}
    </div>
  );
};

export default StatsBar;
