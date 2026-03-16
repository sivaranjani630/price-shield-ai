import { useMemo } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceDot, Line, ComposedChart,
} from "recharts";
import type { CommodityData } from "@/data/commodities";
import { COMMODITIES } from "@/data/commodities";
import { TrendingUp } from "lucide-react";

interface Props {
  data: CommodityData;
}

const PriceChart = ({ data }: Props) => {
  const commodity = COMMODITIES.find(c => c.id === data.id)!;

  const chartData = useMemo(() => {
    const combined = [
      ...data.priceHistory.map((p) => ({
        date: p.date,
        actual: p.price,
        anomaly: p.anomaly ? p.price : undefined,
        forecast: undefined as number | undefined,
        confLow: undefined as number | undefined,
        confHigh: undefined as number | undefined,
      })),
      ...data.forecast.map((p) => ({
        date: p.date,
        actual: undefined as number | undefined,
        anomaly: undefined as number | undefined,
        forecast: p.price,
        confLow: p.confidenceLow,
        confHigh: p.confidenceHigh,
      })),
    ];
    const lastActual = data.priceHistory[data.priceHistory.length - 1];
    const forecastStart = combined.find(d => d.forecast !== undefined);
    if (forecastStart && lastActual) {
      const bridgeIdx = combined.findIndex(d => d.date === lastActual.date);
      if (bridgeIdx >= 0) {
        combined[bridgeIdx].forecast = lastActual.price;
        combined[bridgeIdx].confLow = lastActual.price;
        combined[bridgeIdx].confHigh = lastActual.price;
      }
    }
    return combined;
  }, [data]);

  const anomalyPoints = chartData.filter((d) => d.anomaly !== undefined);

  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-2 mb-1">
        <TrendingUp className="w-4 h-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold text-foreground">
          {commodity.icon} {commodity.name} Price Forecast
        </h3>
      </div>
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-4">
        90-Day Historical + 30-Day AI Prediction • Anomalies in Red
      </p>
      <ResponsiveContainer width="100%" height={350}>
        <ComposedChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0.2} />
              <stop offset="95%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 20%, 18%)" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10, fill: "hsl(215, 15%, 55%)" }}
            tickFormatter={(v: string) => {
              const d = new Date(v);
              return `${d.getDate()}/${d.getMonth() + 1}`;
            }}
            interval={14}
            stroke="hsl(215, 20%, 18%)"
          />
          <YAxis
            tick={{ fontSize: 10, fill: "hsl(215, 15%, 55%)" }}
            stroke="hsl(215, 20%, 18%)"
            tickFormatter={(v: number) => `₹${v}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(222, 41%, 9%)",
              border: "1px solid hsl(215, 20%, 18%)",
              borderRadius: "8px",
              fontSize: "12px",
              color: "hsl(210, 40%, 92%)",
            }}
            labelFormatter={(label: string) => label}
            formatter={(value: number, name: string) => {
              const label = name === "actual" ? "Actual" : name === "forecast" ? "AI Forecast" : name;
              return [`₹${value.toFixed(2)}/kg`, label];
            }}
          />
          <Area dataKey="confHigh" stroke="none" fill="hsl(199, 89%, 48%)" fillOpacity={0.08} />
          <Area dataKey="confLow" stroke="none" fill="hsl(222, 47%, 6%)" fillOpacity={1} />
          <Area dataKey="actual" stroke="hsl(38, 92%, 50%)" strokeWidth={2} fill="url(#actualGrad)" />
          <Line dataKey="forecast" stroke="hsl(199, 89%, 48%)" strokeWidth={2} strokeDasharray="6 3" dot={false} />
          {anomalyPoints.map((p, i) => (
            <ReferenceDot
              key={i}
              x={p.date}
              y={p.anomaly!}
              r={5}
              fill="hsl(0, 72%, 51%)"
              stroke="hsl(0, 72%, 51%)"
              strokeWidth={2}
              fillOpacity={0.6}
            />
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceChart;
