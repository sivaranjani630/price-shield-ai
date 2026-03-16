import type { StateCommodityData } from "@/data/stateData";
import { COMMODITIES } from "@/data/commodities";
import { ComposedChart, Line, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceDot } from "recharts";
import { TrendingUp } from "lucide-react";

interface Props {
  data: StateCommodityData;
  stateName: string;
}

const StateForecastChart = ({ data, stateName }: Props) => {
  const commodity = COMMODITIES.find(c => c.id === data.commodityId);
  const combined = [
    ...data.priceHistory.slice(-60).map(p => ({
      date: p.date,
      actual: p.price,
      forecast: undefined as number | undefined,
      confLow: undefined as number | undefined,
      confHigh: undefined as number | undefined,
      anomaly: p.anomaly,
    })),
    ...data.forecast.map(p => ({
      date: p.date,
      actual: undefined as number | undefined,
      forecast: p.price,
      confLow: p.confidenceLow,
      confHigh: p.confidenceHigh,
      anomaly: false,
    })),
  ];

  const peakPoint = data.forecast.reduce((a, b) => (b.price > a.price ? b : a), data.forecast[0]);

  return (
    <div className="glass-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 uppercase tracking-wider">
          <TrendingUp className="w-4 h-4 text-primary" />
          {commodity?.name} Forecast — {stateName} Only
        </h3>
        <div className="flex items-center gap-3 text-[10px]">
          <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-chart-actual inline-block" /> Actual</span>
          <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-chart-forecast inline-block border-dashed" /> Forecast</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 bg-chart-confidence/30 inline-block rounded-sm" /> Confidence</span>
        </div>
      </div>

      <div className="text-xs text-muted-foreground flex items-center gap-4">
        <span>Predicted Peak: <span className="text-risk-high font-bold">{data.peakDate}</span></span>
        <span>Surge Prob: <span className="text-primary font-bold">{data.surgeProb}%</span></span>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <ComposedChart data={combined} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="confGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--chart-confidence))" stopOpacity={0.2} />
              <stop offset="100%" stopColor="hsl(var(--chart-confidence))" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} tickFormatter={v => v.slice(5)} interval={10} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} domain={["auto", "auto"]} />
          <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }} labelStyle={{ color: "hsl(var(--muted-foreground))" }} />
          <Area dataKey="confHigh" stroke="none" fill="url(#confGrad)" />
          <Area dataKey="confLow" stroke="none" fill="hsl(var(--background))" />
          <Line type="monotone" dataKey="actual" stroke="hsl(var(--chart-actual))" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="forecast" stroke="hsl(var(--chart-forecast))" strokeWidth={2} strokeDasharray="6 3" dot={false} />
          {peakPoint && (
            <ReferenceDot x={peakPoint.date} y={peakPoint.price} r={5} fill="hsl(var(--risk-high))" stroke="hsl(var(--risk-high))" />
          )}
          {combined.filter(p => p.anomaly).map((p, i) => (
            <ReferenceDot key={i} x={p.date} y={p.actual!} r={4} fill="hsl(var(--chart-anomaly))" stroke="hsl(var(--chart-anomaly))" />
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StateForecastChart;
