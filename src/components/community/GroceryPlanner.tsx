import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Lightbulb, TrendingDown, AlertTriangle } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const COMMODITY_PRICES: Record<string, { price: number; unit: string; trend: "up" | "down" | "stable"; substitute?: string; subPrice?: number }> = {
  Onion: { price: 38, unit: "kg", trend: "up", substitute: "Cabbage", subPrice: 18 },
  Tomato: { price: 42, unit: "kg", trend: "up", substitute: "Carrot", subPrice: 25 },
  Potato: { price: 22, unit: "kg", trend: "stable" },
  Rice: { price: 48, unit: "kg", trend: "stable" },
  Wheat: { price: 32, unit: "kg", trend: "stable" },
  "Tur Dal": { price: 135, unit: "kg", trend: "up", substitute: "Moong Dal", subPrice: 95 },
  "Cooking Oil": { price: 160, unit: "L", trend: "stable" },
  Milk: { price: 56, unit: "L", trend: "stable" },
  Sugar: { price: 44, unit: "kg", trend: "down" },
  Salt: { price: 22, unit: "kg", trend: "stable" },
};

type PlanItem = { item: string; qty: string; cost: number; tip?: string; saving?: number };

const generatePlan = (familySize: number, budget: number): { items: PlanItem[]; totalCost: number; totalSaving: number; tips: string[] } => {
  const monthlyKg = familySize * 0.8;
  const items: PlanItem[] = [
    { item: "Rice", qty: `${(familySize * 5).toFixed(0)} kg`, cost: familySize * 5 * 48 },
    { item: "Wheat/Atta", qty: `${(familySize * 3).toFixed(0)} kg`, cost: familySize * 3 * 32 },
    { item: "Tur Dal", qty: `${(familySize * 1).toFixed(0)} kg`, cost: familySize * 1 * 135 },
    { item: "Cooking Oil", qty: `${(familySize * 0.5).toFixed(1)} L`, cost: familySize * 0.5 * 160 },
    { item: "Onion", qty: `${(monthlyKg * 2).toFixed(0)} kg`, cost: monthlyKg * 2 * 38 },
    { item: "Tomato", qty: `${(monthlyKg * 1.5).toFixed(0)} kg`, cost: monthlyKg * 1.5 * 42 },
    { item: "Potato", qty: `${(monthlyKg * 2).toFixed(0)} kg`, cost: monthlyKg * 2 * 22 },
    { item: "Milk", qty: `${(familySize * 8).toFixed(0)} L`, cost: familySize * 8 * 56 },
    { item: "Sugar", qty: `${(familySize * 0.8).toFixed(0)} kg`, cost: familySize * 0.8 * 44 },
    { item: "Salt", qty: `1 kg`, cost: 22 },
  ];

  const totalCost = items.reduce((s, i) => s + i.cost, 0);
  const tips: string[] = [];
  let totalSaving = 0;

  // Optimize if over budget
  if (totalCost > budget) {
    // Replace expensive surging items
    const onionItem = items.find(i => i.item === "Onion");
    if (onionItem) {
      const saving = onionItem.cost - (monthlyKg * 2 * 18);
      onionItem.tip = "Replace 50% with Cabbage (₹18/kg) — save ₹" + Math.round(saving / 2);
      onionItem.saving = Math.round(saving / 2);
      totalSaving += Math.round(saving / 2);
      tips.push("Buy onions this week before predicted 15% price surge");
    }
    const tomatoItem = items.find(i => i.item === "Tomato");
    if (tomatoItem) {
      const saving = tomatoItem.cost - (monthlyKg * 1.5 * 25);
      tomatoItem.tip = "Replace with Carrot next week when tomato peaks";
      tomatoItem.saving = Math.round(saving * 0.4);
      totalSaving += Math.round(saving * 0.4);
      tips.push("Replace tomato with carrot next week (prices peaking)");
    }
    const dalItem = items.find(i => i.item === "Tur Dal");
    if (dalItem) {
      dalItem.tip = "Buy Moong Dal (₹95/kg) as partial substitute";
      dalItem.saving = Math.round(familySize * 0.5 * 40);
      totalSaving += dalItem.saving;
      tips.push("Use Moong Dal for 50% of dal requirement — significant savings");
    }
    tips.push("Buy rice from PDS/ration shop if eligible (₹3/kg)");
  }

  return { items, totalCost, totalSaving, tips };
};

const CHART_COLORS = [
  "hsl(38, 92%, 50%)", "hsl(199, 89%, 48%)", "hsl(142, 71%, 45%)",
  "hsl(0, 72%, 51%)", "hsl(280, 60%, 50%)", "hsl(45, 93%, 65%)",
  "hsl(180, 50%, 45%)", "hsl(320, 60%, 50%)", "hsl(60, 70%, 50%)", "hsl(215, 20%, 50%)",
];

const GroceryPlanner = () => {
  const [familySize, setFamilySize] = useState("4");
  const [budget, setBudget] = useState("3000");
  const [planned, setPlanned] = useState(false);

  const plan = generatePlan(parseInt(familySize) || 4, parseInt(budget) || 3000);
  const pieData = plan.items.map((i) => ({ name: i.item, value: Math.round(i.cost) }));

  return (
    <div className="space-y-4">
      <Card className="glass-card">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <ShoppingCart className="w-5 h-5 text-primary" />
            Smart Family Grocery Planner
          </CardTitle>
          <CardDescription>AI-optimized monthly grocery plan based on your budget and current market prices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Family Size</label>
              <Input type="number" min="1" max="12" value={familySize} onChange={(e) => setFamilySize(e.target.value)} className="font-mono" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Monthly Budget (₹)</label>
              <Input type="number" min="500" value={budget} onChange={(e) => setBudget(e.target.value)} className="font-mono" />
            </div>
            <div className="flex items-end">
              <Button onClick={() => setPlanned(true)} className="w-full">
                <Lightbulb className="w-4 h-4 mr-2" />
                Generate Plan
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {planned && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Summary */}
          <Card className="glass-card">
            <CardContent className="pt-6 space-y-3">
              <div className="p-3 rounded-lg bg-secondary/50 border border-border/50">
                <p className="text-xs text-muted-foreground">Estimated Monthly Cost</p>
                <p className="text-2xl font-bold font-mono text-foreground">₹{Math.round(plan.totalCost).toLocaleString("en-IN")}</p>
              </div>
              <div className="p-3 rounded-lg bg-[hsl(var(--risk-low)/.08)] border border-[hsl(var(--risk-low)/.3)]">
                <p className="text-xs text-muted-foreground">Potential Savings with AI Tips</p>
                <p className="text-2xl font-bold font-mono text-[hsl(var(--risk-low))]">₹{Math.round(plan.totalSaving).toLocaleString("en-IN")}</p>
              </div>
              {plan.totalCost > parseInt(budget) && (
                <div className="p-3 rounded-lg bg-[hsl(var(--risk-high)/.08)] border border-[hsl(var(--risk-high)/.3)]">
                  <div className="flex items-center gap-2 text-xs text-[hsl(var(--risk-high))] font-semibold">
                    <AlertTriangle className="w-4 h-4" />
                    Over budget by ₹{Math.round(plan.totalCost - parseInt(budget)).toLocaleString("en-IN")}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Follow AI tips below to optimize spending</p>
                </div>
              )}

              <div className="mt-3">
                <h4 className="text-xs font-semibold text-primary uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5" />
                  AI Cost Optimization Tips
                </h4>
                <div className="space-y-2">
                  {plan.tips.map((t, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-foreground p-2 rounded bg-primary/5 border border-primary/10">
                      <TrendingDown className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Item list */}
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Monthly Shopping List</CardTitle>
              <CardDescription className="text-xs">Family of {familySize} • Budget ₹{parseInt(budget).toLocaleString("en-IN")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1.5">
                {plan.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded text-xs bg-secondary/20 border border-border/30">
                    <div className="flex-1">
                      <span className="font-medium text-foreground">{item.item}</span>
                      <span className="text-muted-foreground ml-2">({item.qty})</span>
                    </div>
                    <span className="font-mono font-semibold text-foreground">₹{Math.round(item.cost)}</span>
                    {item.saving && item.saving > 0 && (
                      <span className="ml-2 text-[10px] text-[hsl(var(--risk-low))]">-₹{item.saving}</span>
                    )}
                  </div>
                ))}
              </div>
              {plan.items.some(i => i.tip) && (
                <div className="mt-3 space-y-1.5">
                  <h5 className="text-[10px] font-semibold text-muted-foreground uppercase">Substitution Tips</h5>
                  {plan.items.filter(i => i.tip).map((item, i) => (
                    <p key={i} className="text-[11px] text-muted-foreground">• <strong className="text-foreground">{item.item}:</strong> {item.tip}</p>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pie chart */}
          <Card className="glass-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Budget Allocation</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                    formatter={(v: number) => [`₹${v}`, "Cost"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default GroceryPlanner;
