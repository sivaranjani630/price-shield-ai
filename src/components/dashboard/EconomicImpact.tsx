import { TrendingDown, Users, Home, Clock, FileText, Lightbulb } from "lucide-react";

const stats = [
  { icon: <TrendingDown className="w-5 h-5 text-risk-low" />, value: "0.8-1.2%", label: "Inflation Reduction" },
  { icon: <Users className="w-5 h-5 text-primary" />, value: "₹2,400-3,600 Cr/year", label: "Consumer Savings" },
  { icon: <Home className="w-5 h-5 text-risk-medium" />, value: "18.5 Cr", label: "Households Covered" },
  { icon: <Clock className="w-5 h-5 text-chart-forecast" />, value: "14-28 days", label: "Early Warning" },
];

const policyRecommendations = [
  "Immediate release of 50,000 MT onion buffer stock from NAFED reserves",
  "Activate price stabilization fund for tomato procurement in Karnataka",
  "Expedite import clearance for tur dal shipments at Kandla port",
  "Coordinate with Indian Railways for priority freight allocation",
];

const farmerInsights = [
  "Stagger onion harvesting in Nashik belt to maintain supply continuity",
  "Utilize cold storage facilities for potato in UP before price correction",
  "Early procurement advisory for rabi wheat in Punjab and Haryana",
];

const EconomicImpact = () => {
  return (
    <div className="glass-card p-4">
      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4 uppercase tracking-wider">
        <FileText className="w-4 h-4 text-primary" />
        Economic Impact Analysis
      </h3>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-surface-elevated rounded-lg p-4 text-center border border-border/50">
            <div className="flex justify-center mb-2">{s.icon}</div>
            <div className="text-lg font-mono font-bold text-foreground">{s.value}</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Policy Recommendations */}
      <h4 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3 uppercase tracking-wider">
        <FileText className="w-4 h-4 text-primary" />
        Policy Recommendations
      </h4>
      <div className="space-y-0 mb-6">
        {policyRecommendations.map((rec, i) => (
          <div key={i} className="flex items-center gap-3 py-3 border-b border-border/50 last:border-0">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-bold shrink-0">{i + 1}</span>
            <span className="text-sm text-foreground">{rec}</span>
          </div>
        ))}
      </div>

      {/* Farmer Planning Insights */}
      <h4 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3 uppercase tracking-wider">
        <Lightbulb className="w-4 h-4 text-risk-low" />
        Farmer Planning Insights
      </h4>
      <div className="space-y-0">
        {farmerInsights.map((insight, i) => (
          <div key={i} className="flex items-center gap-3 py-3 border-b border-border/50 last:border-0">
            <Lightbulb className="w-4 h-4 text-risk-low shrink-0" />
            <span className="text-sm text-foreground">{insight}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EconomicImpact;
