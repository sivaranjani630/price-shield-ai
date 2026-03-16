import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { STATE_DATA_MAP, STATE_SLUG_TO_NAME, type StateCommodityData } from "@/data/stateData";
import { COMMODITIES, type CommodityId } from "@/data/commodities";
import { ArrowLeft, Shield, MapPin, TrendingUp, AlertTriangle, Activity, Droplets, Thermometer, Truck, Warehouse } from "lucide-react";
import { cn } from "@/lib/utils";
import StatePriceTable from "@/components/state/StatePriceTable";
import StateForecastChart from "@/components/state/StateForecastChart";
import StateRiskPanel from "@/components/state/StateRiskPanel";
import StateDistrictHeatmap from "@/components/state/StateDistrictHeatmap";
import StateInterventionSim from "@/components/state/StateInterventionSim";

const StateDetail = () => {
  const { stateSlug } = useParams<{ stateSlug: string }>();
  const navigate = useNavigate();
  const [selectedCommodity, setSelectedCommodity] = useState<CommodityId>("onion");

  const stateName = stateSlug ? STATE_SLUG_TO_NAME[stateSlug] : undefined;
  const stateData = stateSlug ? STATE_DATA_MAP[stateSlug] : undefined;

  if (!stateName || !stateData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="glass-card p-8 text-center space-y-4 max-w-md">
          <AlertTriangle className="w-12 h-12 text-primary mx-auto" />
          <h2 className="text-xl font-bold text-foreground">State Intelligence Coming Soon</h2>
          <p className="text-muted-foreground text-sm">
            Detailed intelligence for <span className="text-primary font-semibold">{stateName || "this state"}</span> is being compiled. Tamil Nadu is currently available as a pilot.
          </p>
          <button onClick={() => navigate("/")} className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:bg-primary/90 transition-colors">
            ← Back to National Dashboard
          </button>
        </div>
      </div>
    );
  }

  const commodityData = stateData.commodities[selectedCommodity];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-50">
        <div className="container px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/")} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm">
              <ArrowLeft className="w-4 h-4" />
              National Dashboard
            </button>
            <div className="h-6 w-px bg-border" />
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <h1 className="text-lg font-bold text-foreground">
                <span className="text-primary">{stateData.stateName}</span> Economic Intelligence
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground font-mono">POP: {stateData.population} Cr</span>
            <span className={cn("text-xs px-2 py-0.5 rounded-full font-semibold", commodityData.riskLevel === "critical" ? "risk-badge-high" : commodityData.riskLevel === "high" ? "risk-badge-high" : commodityData.riskLevel === "medium" ? "risk-badge-medium" : "risk-badge-low")}>
              {commodityData.riskLevel.toUpperCase()} ALERT
            </span>
          </div>
        </div>
      </header>

      <main className="container px-4 py-4 space-y-4">
        {/* Commodity Selector */}
        <div className="flex items-center gap-2 flex-wrap">
          {COMMODITIES.map((c) => {
            const cd = stateData.commodities[c.id];
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCommodity(c.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border",
                  selectedCommodity === c.id
                    ? "bg-primary/15 border-primary/50 text-primary"
                    : "bg-card border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
                )}
              >
                <span>{c.icon}</span>
                <span>{c.name}</span>
                <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-bold", cd.riskLevel === "critical" || cd.riskLevel === "high" ? "bg-risk-high/20 text-risk-high" : cd.riskLevel === "medium" ? "bg-risk-medium/20 text-risk-medium" : "bg-risk-low/20 text-risk-low")}>
                  {cd.surgeProb}%
                </span>
              </button>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <QuickStat label={`${stateData.stateName} Avg`} value={`₹${commodityData.stateAvgPrice}`} sub={`${commodityData.weekChange > 0 ? "+" : ""}${commodityData.weekChange}% wk`} color={commodityData.weekChange > 5 ? "high" : commodityData.weekChange > 0 ? "medium" : "low"} icon={<TrendingUp className="w-4 h-4" />} />
          <QuickStat label="National Avg" value={`₹${commodityData.nationalAvgPrice}`} sub={`${Math.round(((commodityData.stateAvgPrice - commodityData.nationalAvgPrice) / commodityData.nationalAvgPrice) * 100)}% diff`} color="medium" icon={<Activity className="w-4 h-4" />} />
          <QuickStat label="Surge Prob" value={`${commodityData.surgeProb}%`} sub={`Peak: ${commodityData.peakDate.split("-").slice(1).join("/")}`} color={commodityData.surgeProb > 70 ? "high" : commodityData.surgeProb > 40 ? "medium" : "low"} icon={<AlertTriangle className="w-4 h-4" />} />
          <QuickStat label="Rainfall" value={`${commodityData.rainfallAnomaly}%`} sub="anomaly" color={commodityData.rainfallAnomaly > 30 ? "high" : "low"} icon={<Droplets className="w-4 h-4" />} />
          <QuickStat label="Temp Dev" value={`+${commodityData.tempDeviation}°C`} sub="deviation" color={commodityData.tempDeviation > 2 ? "high" : "low"} icon={<Thermometer className="w-4 h-4" />} />
          <QuickStat label="Transport" value={`${commodityData.transportDisruption}%`} sub="disruption" color={commodityData.transportDisruption > 20 ? "high" : "low"} icon={<Truck className="w-4 h-4" />} />
        </div>

        {/* Row 1: Forecast + Risk Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <StateForecastChart data={commodityData} stateName={stateData.stateName} />
          </div>
          <StateRiskPanel data={commodityData} stateName={stateData.stateName} />
        </div>

        {/* Row 2: District Heatmap + Price Table */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <StateDistrictHeatmap data={commodityData} stateName={stateData.stateName} />
          <div className="lg:col-span-2">
            <StatePriceTable data={commodityData} stateName={stateData.stateName} allCommodities={stateData.commodities} />
          </div>
        </div>

        {/* Row 3: Intervention Simulator */}
        <StateInterventionSim data={commodityData} stateName={stateData.stateName} population={stateData.population} />

        {/* Footer */}
        <footer className="text-center py-6 border-t border-border">
          <p className="text-xs text-muted-foreground uppercase tracking-widest">
            PriceShield AI • {stateData.stateName} Command Center • Government of India
          </p>
        </footer>
      </main>
    </div>
  );
};

const QuickStat = ({ label, value, sub, color, icon }: { label: string; value: string; sub: string; color: "low" | "medium" | "high"; icon: React.ReactNode }) => (
  <div className="glass-card p-3 space-y-1">
    <div className="flex items-center gap-1.5 text-muted-foreground">
      {icon}
      <span className="text-[10px] uppercase tracking-wider font-medium">{label}</span>
    </div>
    <div className={cn("text-lg font-bold font-mono", color === "high" ? "text-risk-high" : color === "medium" ? "text-primary" : "text-risk-low")}>
      {value}
    </div>
    <div className="text-[10px] text-muted-foreground">{sub}</div>
  </div>
);

export default StateDetail;
