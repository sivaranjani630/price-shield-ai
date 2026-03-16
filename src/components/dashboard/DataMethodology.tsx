import { Info, AlertTriangle, Clock, Database, Brain, Calculator } from "lucide-react";

const dataSources = [
  { name: "Agmarknet (eNAM)", desc: "Daily mandi-level wholesale price data across 585 regulated markets", lastSync: "15 min ago" },
  { name: "India Meteorological Department", desc: "Temperature, rainfall, and weather anomaly indices by district", lastSync: "1 hour ago" },
  { name: "Ministry of Agriculture", desc: "Crop production estimates, arrival volumes, sowing data", lastSync: "24 hours ago" },
  { name: "NAFED / FCI", desc: "Buffer stock levels, procurement data, storage utilization rates", lastSync: "6 hours ago" },
  { name: "Transport Intelligence", desc: "NH congestion index, diesel prices, freight rate indicators", lastSync: "3 hours ago" },
];

const assumptions = [
  "Normal trade policy environment (no sudden export bans)",
  "No force majeure events (floods, lockdowns)",
  "MSP and procurement policies remain consistent",
  "Mandi reporting accuracy within ±5%",
  "Weather forecasts based on IMD 7-day outlook",
];

const limitations = [
  "Forecasts are probabilistic estimates, not guarantees",
  "Model performance may degrade during unprecedented events",
  "State-level aggregation may mask mandi-level variation",
  "Intervention simulations use simplified economic models",
  "Real-time data availability varies by source",
];

const DataMethodology = () => {
  return (
    <div className="space-y-4">
      {/* Data Sources */}
      <div className="glass-card p-4">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4 uppercase tracking-wider">
          <Database className="w-4 h-4 text-primary" />
          Data Sources
        </h3>
        <div className="space-y-0">
          {dataSources.map((src) => (
            <div key={src.name} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
              <div>
                <div className="text-sm font-semibold text-foreground">{src.name}</div>
                <div className="text-xs text-muted-foreground">{src.desc}</div>
              </div>
              <div className="flex items-center gap-1 text-xs text-risk-low whitespace-nowrap">
                <Clock className="w-3 h-3" />
                {src.lastSync}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Model Architecture + Risk Score Formula */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card p-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4 uppercase tracking-wider">
            <Brain className="w-4 h-4 text-primary" />
            Model Architecture
          </h3>
          <div className="bg-surface-elevated rounded-lg p-4 mb-4">
            <div className="text-sm font-semibold text-foreground mb-1">Ensemble Forecasting Engine</div>
            <p className="text-xs text-muted-foreground">
              LSTM Neural Network + Prophet time-series decomposition with automated hyperparameter tuning.
            </p>
          </div>
          <div className="space-y-0">
            {[
              { label: "Training Window", value: "5 years historical" },
              { label: "Forecast Horizon", value: "30 days" },
              { label: "Confidence Level", value: "90% interval" },
              { label: "Retraining Frequency", value: "Weekly" },
              { label: "Model Accuracy (MAPE)", value: "4.2%", highlight: true },
            ].map((row) => (
              <div key={row.label} className="flex justify-between py-2.5 border-b border-border/50 last:border-0 text-sm">
                <span className="text-muted-foreground">{row.label}</span>
                <span className={`font-mono font-semibold ${row.highlight ? "text-risk-low" : "text-foreground"}`}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4 uppercase tracking-wider">
            <Calculator className="w-4 h-4 text-primary" />
            Risk Score Formula
          </h3>
          <div className="bg-surface-elevated rounded-lg p-4 mb-4 font-mono text-sm space-y-1">
            <div className="text-risk-high font-bold">RiskScore = Σ(wᵢ × Fᵢ)</div>
            <div className="text-muted-foreground text-xs mt-2 space-y-0.5">
              <div>w₁ = 0.30 × PriceVolatilityIndex</div>
              <div>w₂ = 0.25 × WeatherAnomalyScore</div>
              <div>w₃ = 0.20 × ArrivalVolumeDropRate</div>
              <div>w₄ = 0.15 × TransportDisruptionFactor</div>
              <div>w₅ = 0.10 × StorageDeficitRatio</div>
            </div>
          </div>
          <div className="space-y-2">
            {[
              { range: "0–35", label: "Low Risk", color: "bg-risk-low" },
              { range: "36–65", label: "Medium Risk", color: "bg-risk-medium" },
              { range: "66–100", label: "High / Critical", color: "bg-risk-high" },
            ].map((r) => (
              <div key={r.range} className="flex items-center gap-3">
                <span className={`${r.color} text-foreground text-xs font-bold px-2 py-1 rounded`}>{r.range}</span>
                <span className="text-sm text-muted-foreground">{r.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Assumptions + Limitations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="glass-card p-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4 uppercase tracking-wider">
            <Info className="w-4 h-4 text-primary" />
            Key Assumptions
          </h3>
          <div className="space-y-0">
            {assumptions.map((a) => (
              <div key={a} className="flex items-start gap-2 py-2.5 border-b border-border/50 last:border-0">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                <span className="text-sm text-foreground">{a}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-4">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4 uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-risk-medium" />
            Limitations & Disclaimer
          </h3>
          <div className="space-y-0">
            {limitations.map((l) => (
              <div key={l} className="flex items-start gap-2 py-2.5 border-b border-border/50 last:border-0">
                <span className="w-1.5 h-1.5 rounded-full bg-risk-medium mt-1.5 shrink-0" />
                <span className="text-sm text-foreground">{l}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-lg bg-risk-medium/10 border border-risk-medium/20">
            <p className="text-xs text-risk-medium leading-relaxed">
              This system is a decision-support tool. All policy actions should be validated through established institutional mechanisms before implementation. The Ministry of Consumer Affairs assumes no liability for decisions made solely based on algorithmic outputs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataMethodology;
