import type { StateCommodityData } from "@/data/stateData";
import type { CommodityId } from "@/data/commodities";
import { COMMODITIES } from "@/data/commodities";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, TrendingDown } from "lucide-react";

interface Props {
  data: StateCommodityData;
  stateName: string;
  allCommodities: Record<CommodityId, StateCommodityData>;
}

const StatePriceTable = ({ data, stateName, allCommodities }: Props) => {
  return (
    <div className="glass-card p-4 space-y-4">
      <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
        📊 District-Wise Price Breakdown — {COMMODITIES.find(c => c.id === data.commodityId)?.name}
      </h3>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50">
              <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground">District</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground text-right">Price (₹/kg)</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground text-right">Week Δ</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground text-right">vs National</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground text-right">Surge %</TableHead>
              <TableHead className="text-[10px] uppercase tracking-wider text-muted-foreground">7-Day Trend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.districts.map((d) => (
              <TableRow key={d.district} className="border-border/30 hover:bg-muted/30">
                <TableCell className="font-medium text-sm text-foreground">{d.district}</TableCell>
                <TableCell className="text-right font-mono text-sm font-semibold text-foreground">₹{d.price}</TableCell>
                <TableCell className="text-right">
                  <span className={cn("text-xs font-semibold flex items-center justify-end gap-0.5", d.weekChange > 0 ? "text-risk-high" : "text-risk-low")}>
                    {d.weekChange > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {d.weekChange > 0 ? "+" : ""}{d.weekChange}%
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <span className={cn("text-xs font-mono", d.nationalDiff > 0 ? "text-risk-high" : "text-risk-low")}>
                    {d.nationalDiff > 0 ? "+" : ""}{d.nationalDiff}%
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <span className={cn("text-xs font-bold px-1.5 py-0.5 rounded", d.surgeProb > 70 ? "bg-risk-high/20 text-risk-high" : d.surgeProb > 40 ? "bg-risk-medium/20 text-risk-medium" : "bg-risk-low/20 text-risk-low")}>
                    {d.surgeProb}%
                  </span>
                </TableCell>
                <TableCell>
                  <MiniTrend data={d.trend7d} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* All Commodities Summary */}
      <div className="border-t border-border/50 pt-4">
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">All Commodity Prices — {stateName}</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {COMMODITIES.map((c) => {
            const cd = allCommodities[c.id];
            return (
              <div key={c.id} className="flex items-center justify-between p-2 rounded-md bg-muted/30 border border-border/30">
                <span className="text-xs text-muted-foreground">{c.icon} {c.name}</span>
                <div className="text-right">
                  <span className="text-sm font-bold font-mono text-foreground">₹{cd.stateAvgPrice}</span>
                  <span className={cn("text-[10px] ml-1", cd.weekChange > 0 ? "text-risk-high" : "text-risk-low")}>
                    {cd.weekChange > 0 ? "+" : ""}{cd.weekChange}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const MiniTrend = ({ data }: { data: number[] }) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const h = 20;
  const w = 48;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");
  const up = data[data.length - 1] > data[0];
  return (
    <svg width={w} height={h} className="inline-block">
      <polyline points={points} fill="none" stroke={up ? "hsl(var(--risk-high))" : "hsl(var(--risk-low))"} strokeWidth="1.5" />
    </svg>
  );
};

export default StatePriceTable;
