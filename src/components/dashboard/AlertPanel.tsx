import { ALERTS, COMMODITIES, COMMODITY_DATA, type Alert, type RiskLevel } from "@/data/commodities";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const severityClass = (s: RiskLevel) => {
  switch (s) {
    case "critical": return "border-l-risk-critical bg-risk-critical/5";
    case "high": return "border-l-risk-high bg-risk-high/5";
    case "medium": return "border-l-risk-medium bg-risk-medium/5";
    case "low": return "border-l-risk-low bg-risk-low/5";
  }
};

const AlertPanel = () => {
  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 uppercase tracking-wider">
          <AlertTriangle className="w-4 h-4 text-risk-high" />
          Active Alerts ({ALERTS.length})
        </h3>
      </div>
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
        {ALERTS.map((alert) => {
          const commodity = COMMODITIES.find(c => c.id === alert.commodity);
          const commodityData = COMMODITY_DATA[alert.commodity];
          // Find state info from alert message
          const stateMatch = alert.message.match(/(Maharashtra|Karnataka|Punjab|Rajasthan|Madhya Pradesh|UP|Nashik)/);
          const stateName = stateMatch ? stateMatch[1] : "";

          return (
            <div
              key={alert.id}
              className={cn(
                "border-l-2 rounded-r-md p-3 transition-colors",
                severityClass(alert.severity)
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-risk-high" />
                  <span className="text-sm font-bold text-foreground">{commodity?.name}</span>
                  {stateName && <span className="text-xs text-muted-foreground">• {stateName}</span>}
                </div>
                <span className={cn(
                  "text-[10px] font-bold px-2 py-0.5 rounded-full",
                  `risk-badge-${alert.severity === "critical" ? "high" : alert.severity}`
                )}>
                  {commodityData.surgeProb}%
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mb-1">{alert.message}</p>
              <span className="text-[10px] text-muted-foreground">{alert.timestamp}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AlertPanel;
