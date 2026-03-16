import { useState, useMemo } from "react";
import type { StateCommodityData } from "@/data/stateData";
import { COMMODITIES } from "@/data/commodities";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { ComposedChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Settings, TrendingDown } from "lucide-react";

interface Props {
  data: StateCommodityData;
  stateName: string;
  population: number;
}

const StateInterventionSim = ({ data, stateName, population }: Props) => {
  const [bufferRelease, setBufferRelease] = useState(0);
  const [importQty, setImportQty] = useState(0);
  const [supplyOpt, setSupplyOpt] = useState(0);

  const commodity = COMMODITIES.find(c => c.id === data.commodityId);
  const priceImpact = -(bufferRelease * 0.14 + importQty * 0.09 + supplyOpt * 0.18);
  const adjustedPrice = Math.max(data.stateAvgPrice * (1 + priceImpact / 100), data.stateAvgPrice * 0.6);
  const pctReduction = Math.abs(Math.round(priceImpact * 10) / 10);
  const monthlySavings = Math.round(population * 1e7 * 2 * Math.abs(data.stateAvgPrice - adjustedPrice)); // rough per-capita estimate
  const inflationReduction = Math.round(pctReduction * 0.12 * 100) / 100;

  const chartData = useMemo(() => {
    return data.forecast.map((p) => {
      const base = p.price;
      const adjusted = Math.max(base * (1 + priceImpact / 100), base * 0.6);
      return {
        date: p.date,
        withoutIntervention: Math.round(base * 100) / 100,
        withIntervention: Math.round(adjusted * 100) / 100,
      };
    });
  }, [data.forecast, priceImpact]);

  return (
    <div className="glass-card p-4 space-y-4">
      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 uppercase tracking-wider">
        <Settings className="w-4 h-4 text-primary" />
        {stateName} Intervention Simulator — {commodity?.name}
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="space-y-5">
          <SliderControl
            label={`Buffer Stock Release (${stateName})`}
            value={bufferRelease}
            onChange={(v) => setBufferRelease(v[0])}
            max={100}
            unit="K tonnes"
          />
          <SliderControl
            label="Import Volume"
            value={importQty}
            onChange={(v) => setImportQty(v[0])}
            max={100}
            unit="K tonnes"
          />
          <SliderControl
            label="Inter-District Supply Optimization"
            value={supplyOpt}
            onChange={(v) => setSupplyOpt(v[0])}
            max={100}
            unit="%"
          />

          {/* Impact Metrics */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <div className="bg-muted/30 rounded-lg p-3 border border-border/30">
              <div className="text-[10px] text-muted-foreground uppercase">Price Reduction</div>
              <div className={cn("text-xl font-black font-mono", pctReduction > 0 ? "text-risk-low" : "text-muted-foreground")}>
                {pctReduction > 0 ? "-" : ""}{pctReduction}%
              </div>
            </div>
            <div className="bg-muted/30 rounded-lg p-3 border border-border/30">
              <div className="text-[10px] text-muted-foreground uppercase">New {stateName} Price</div>
              <div className="text-xl font-black font-mono text-primary">₹{Math.round(adjustedPrice * 100) / 100}</div>
            </div>
            <div className="bg-muted/30 rounded-lg p-3 border border-border/30">
              <div className="text-[10px] text-muted-foreground uppercase">Consumer Savings ({stateName})</div>
              <div className="text-lg font-bold font-mono text-risk-low">
                ₹{monthlySavings > 1e7 ? `${(monthlySavings / 1e7).toFixed(1)} Cr` : `${(monthlySavings / 1e5).toFixed(1)} L`}
              </div>
              <div className="text-[10px] text-muted-foreground">monthly estimate</div>
            </div>
            <div className="bg-muted/30 rounded-lg p-3 border border-border/30">
              <div className="text-[10px] text-muted-foreground uppercase">State Inflation Impact</div>
              <div className="text-lg font-bold font-mono text-chart-forecast">-{inflationReduction}%</div>
              <div className="text-[10px] text-muted-foreground">CPI contribution</div>
            </div>
          </div>
        </div>

        {/* Chart: With vs Without */}
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <TrendingDown className="w-3 h-3" />
            Side-by-Side: Without vs With Intervention ({stateName})
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <XAxis dataKey="date" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} tickFormatter={v => v.slice(5)} interval={5} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }} />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Line type="monotone" dataKey="withoutIntervention" stroke="hsl(var(--risk-high))" strokeWidth={2} dot={false} name="Without Intervention" />
              <Line type="monotone" dataKey="withIntervention" stroke="hsl(var(--risk-low))" strokeWidth={2} dot={false} name="With Intervention" strokeDasharray={pctReduction > 0 ? "0" : "4 2"} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const SliderControl = ({ label, value, onChange, max, unit }: { label: string; value: number; onChange: (v: number[]) => void; max: number; unit: string }) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <label className="text-xs text-muted-foreground">{label}</label>
      <span className="text-xs font-mono font-bold text-primary">{value} {unit}</span>
    </div>
    <Slider value={[value]} onValueChange={onChange} max={max} step={5} className="w-full" />
  </div>
);

export default StateInterventionSim;
