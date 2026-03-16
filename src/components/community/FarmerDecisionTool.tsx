import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TrendingUp, ArrowUpRight, ArrowDownRight, Clock, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const COMMODITIES = ["Onion", "Tomato", "Potato", "Rice", "Wheat", "Tur Dal"];

const PREDICTIONS: Record<string, { current: number; predicted: number; days: number; trend: "up" | "down"; recommendation: string; profitData: { day: string; sell: number; hold: number }[] }> = {
  Onion: {
    current: 22, predicted: 30, days: 10, trend: "up",
    recommendation: "HOLD crop for 7–10 days to maximize profit. Prices expected to surge due to supply shortage in southern markets.",
    profitData: [
      { day: "Today", sell: 22000, hold: 0 }, { day: "Day 3", sell: 21500, hold: 24000 },
      { day: "Day 5", sell: 23000, hold: 26000 }, { day: "Day 7", sell: 25000, hold: 28500 },
      { day: "Day 10", sell: 27000, hold: 30000 }, { day: "Day 14", sell: 24000, hold: 28000 },
    ],
  },
  Tomato: {
    current: 42, predicted: 35, days: 7, trend: "down",
    recommendation: "SELL NOW. Tomato prices expected to drop as new harvest arrives from Karnataka. Fresh supply will push prices down by ~17%.",
    profitData: [
      { day: "Today", sell: 42000, hold: 0 }, { day: "Day 3", sell: 40000, hold: 39000 },
      { day: "Day 5", sell: 38000, hold: 36000 }, { day: "Day 7", sell: 35000, hold: 33000 },
      { day: "Day 10", sell: 33000, hold: 30000 }, { day: "Day 14", sell: 30000, hold: 27000 },
    ],
  },
  Potato: {
    current: 20, predicted: 24, days: 14, trend: "up",
    recommendation: "HOLD for 10–14 days. Cold storage costs are low and demand expected to rise during festival season.",
    profitData: [
      { day: "Today", sell: 20000, hold: 0 }, { day: "Day 3", sell: 20500, hold: 21000 },
      { day: "Day 5", sell: 21000, hold: 22000 }, { day: "Day 7", sell: 21500, hold: 23000 },
      { day: "Day 10", sell: 22000, hold: 23500 }, { day: "Day 14", sell: 23000, hold: 24000 },
    ],
  },
  Rice: {
    current: 48, predicted: 52, days: 21, trend: "up",
    recommendation: "HOLD for 2–3 weeks. Government procurement price revision expected. Current MSP may increase.",
    profitData: [
      { day: "Today", sell: 48000, hold: 0 }, { day: "Day 5", sell: 48500, hold: 49000 },
      { day: "Day 10", sell: 49000, hold: 50000 }, { day: "Day 14", sell: 50000, hold: 51000 },
      { day: "Day 21", sell: 51000, hold: 52000 }, { day: "Day 28", sell: 50000, hold: 50500 },
    ],
  },
  Wheat: {
    current: 32, predicted: 31, days: 7, trend: "down",
    recommendation: "SELL NOW. Wheat prices stable but buffer stock release expected next week, which may push prices down.",
    profitData: [
      { day: "Today", sell: 32000, hold: 0 }, { day: "Day 3", sell: 31800, hold: 31500 },
      { day: "Day 5", sell: 31500, hold: 31000 }, { day: "Day 7", sell: 31000, hold: 30500 },
      { day: "Day 10", sell: 30500, hold: 30000 }, { day: "Day 14", sell: 30000, hold: 29500 },
    ],
  },
  "Tur Dal": {
    current: 135, predicted: 152, days: 30, trend: "up",
    recommendation: "HOLD for 3–4 weeks. Import delays and lower kharif production expected to push dal prices higher significantly.",
    profitData: [
      { day: "Today", sell: 135000, hold: 0 }, { day: "Day 7", sell: 138000, hold: 140000 },
      { day: "Day 14", sell: 142000, hold: 145000 }, { day: "Day 21", sell: 146000, hold: 149000 },
      { day: "Day 28", sell: 148000, hold: 152000 }, { day: "Day 35", sell: 145000, hold: 148000 },
    ],
  },
};

const FarmerDecisionTool = () => {
  const [commodity, setCommodity] = useState("Onion");
  const [quantity, setQuantity] = useState("1000");
  const [analyzed, setAnalyzed] = useState(false);

  const data = PREDICTIONS[commodity];
  const qty = parseInt(quantity) || 1000;
  const profitDiff = ((data.predicted - data.current) * qty).toLocaleString("en-IN");

  return (
    <div className="space-y-4">
      <Card className="glass-card">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="w-5 h-5 text-primary" />
            Farmer Sell / Hold Decision Assistant
          </CardTitle>
          <CardDescription>AI-powered advisory to help farmers maximize crop revenue</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Commodity</label>
              <div className="flex flex-wrap gap-2">
                {COMMODITIES.map((c) => (
                  <button key={c} onClick={() => { setCommodity(c); setAnalyzed(false); }}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all border ${
                      commodity === c ? "bg-primary/10 text-primary border-primary/30" : "bg-secondary/50 text-muted-foreground border-border/50 hover:text-foreground"
                    }`}>{c}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Harvest Quantity (kg)</label>
              <Input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="font-mono" />
            </div>
            <div className="flex items-end">
              <Button onClick={() => setAnalyzed(true)} className="w-full">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analyze
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {analyzed && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Price cards */}
          <Card className="glass-card">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border/50">
                <div>
                  <p className="text-xs text-muted-foreground">Current Market Price</p>
                  <p className="text-2xl font-bold font-mono text-foreground">₹{data.current}<span className="text-sm text-muted-foreground">/kg</span></p>
                </div>
              </div>
              <div className={`flex items-center justify-between p-3 rounded-lg border ${
                data.trend === "up" ? "bg-[hsl(var(--risk-low)/.08)] border-[hsl(var(--risk-low)/.3)]" : "bg-[hsl(var(--risk-high)/.08)] border-[hsl(var(--risk-high)/.3)]"
              }`}>
                <div>
                  <p className="text-xs text-muted-foreground">Predicted ({data.days} days)</p>
                  <p className="text-2xl font-bold font-mono text-foreground">₹{data.predicted}<span className="text-sm text-muted-foreground">/kg</span></p>
                </div>
                {data.trend === "up"
                  ? <ArrowUpRight className="w-6 h-6 text-[hsl(var(--risk-low))]" />
                  : <ArrowDownRight className="w-6 h-6 text-[hsl(var(--risk-high))]" />}
              </div>
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-xs font-semibold text-primary uppercase">AI Recommendation</span>
                </div>
                <p className="text-sm text-foreground leading-relaxed">{data.recommendation}</p>
              </div>
              <div className="text-center p-2 rounded bg-secondary/30">
                <p className="text-xs text-muted-foreground">Estimated profit difference for {qty.toLocaleString("en-IN")} kg</p>
                <p className={`text-lg font-bold font-mono ${data.trend === "up" ? "text-[hsl(var(--risk-low))]" : "text-[hsl(var(--risk-high))]"}`}>
                  {data.trend === "up" ? "+" : "-"}₹{profitDiff}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Profit comparison chart */}
          <Card className="glass-card lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Revenue Comparison: Sell Now vs Hold</CardTitle>
              <CardDescription className="text-xs">Projected revenue for {qty.toLocaleString("en-IN")} kg of {commodity}</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.profitData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                    formatter={(v: number) => [`₹${v.toLocaleString("en-IN")}`, ""]}
                  />
                  <Bar dataKey="sell" name="Sell Revenue" radius={[4, 4, 0, 0]}>
                    {data.profitData.map((_, i) => (
                      <Cell key={i} fill="hsl(var(--chart-forecast))" fillOpacity={0.7} />
                    ))}
                  </Bar>
                  <Bar dataKey="hold" name="Hold Revenue" radius={[4, 4, 0, 0]}>
                    {data.profitData.map((_, i) => (
                      <Cell key={i} fill="hsl(var(--primary))" fillOpacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default FarmerDecisionTool;
