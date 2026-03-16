import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Zap, Play, RotateCcw, TrendingDown } from "lucide-react";
import type { CommodityData } from "@/data/commodities";

interface Props {
  data: CommodityData;
}

const InterventionSimulator = ({ data }: Props) => {
  const [bufferRelease, setBufferRelease] = useState(0);
  const [importQty, setImportQty] = useState(0);
  const [transportReduction, setTransportReduction] = useState(0);
  const [simulated, setSimulated] = useState(false);

  const priceImpact = -(bufferRelease * 0.12 + importQty * 0.08 + transportReduction * 0.15);
  const newPrice = data.currentPrice * (1 + priceImpact / 100);
  const newSurgeProb = Math.max(5, data.surgeProb + priceImpact * 1.2);

  const runSimulation = () => setSimulated(true);
  const reset = () => {
    setBufferRelease(0);
    setImportQty(0);
    setTransportReduction(0);
    setSimulated(false);
  };

  return (
    <div className="glass-card p-4">
      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4 uppercase tracking-wider">
        <Zap className="w-4 h-4 text-primary" />
        Intervention Simulator
      </h3>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-muted-foreground">Buffer Stock Release</span>
            <span className="font-mono font-semibold text-foreground">{bufferRelease} MT</span>
          </div>
          <Slider value={[bufferRelease]} onValueChange={([v]) => { setBufferRelease(v); setSimulated(false); }} max={100} step={5} className="w-full" />
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-muted-foreground">Import Quantity</span>
            <span className="font-mono font-semibold text-foreground">{importQty} MT</span>
          </div>
          <Slider value={[importQty]} onValueChange={([v]) => { setImportQty(v); setSimulated(false); }} max={100} step={5} className="w-full" />
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-muted-foreground">Transport Delay Reduction</span>
            <span className="font-mono font-semibold text-foreground">{transportReduction}%</span>
          </div>
          <Slider value={[transportReduction]} onValueChange={([v]) => { setTransportReduction(v); setSimulated(false); }} max={100} step={5} className="w-full" />
        </div>

        <div className="flex gap-2">
          <Button onClick={runSimulation} className="flex-1 text-xs h-10" size="sm">
            <Play className="w-3 h-3 mr-1" /> Run Simulation
          </Button>
          <Button onClick={reset} variant="outline" className="text-xs h-10 w-10 p-0" size="sm">
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        {simulated && (
          <div className="animate-slide-up border border-border rounded-lg p-3 bg-surface-elevated space-y-2">
            <div className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <TrendingDown className="w-3.5 h-3.5 text-risk-low" />
              Simulation Results
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-muted/50 rounded-md p-2">
                <span className="text-muted-foreground block text-[10px]">Estimated Price</span>
                <span className="font-mono font-bold text-risk-low">₹{newPrice.toFixed(2)}</span>
              </div>
              <div className="bg-muted/50 rounded-md p-2">
                <span className="text-muted-foreground block text-[10px]">Price Reduction</span>
                <span className="font-mono font-bold text-risk-low">{priceImpact.toFixed(1)}%</span>
              </div>
              <div className="bg-muted/50 rounded-md p-2">
                <span className="text-muted-foreground block text-[10px]">New Surge Prob.</span>
                <span className="font-mono font-bold text-foreground">{newSurgeProb.toFixed(0)}%</span>
              </div>
              <div className="bg-muted/50 rounded-md p-2">
                <span className="text-muted-foreground block text-[10px]">Risk Reduction</span>
                <span className="font-mono font-bold text-risk-low">{(data.surgeProb - newSurgeProb).toFixed(0)}pts</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterventionSimulator;
