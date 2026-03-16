import { useState } from "react";
import { COMMODITY_DATA, type CommodityId } from "@/data/commodities";
import Header from "@/components/dashboard/Header";
import CommoditySelector from "@/components/dashboard/CommoditySelector";
import StatsBar from "@/components/dashboard/StatsBar";
import PriceChart from "@/components/dashboard/PriceChart";
import RiskGauge from "@/components/dashboard/RiskGauge";
import IndiaHeatmap from "@/components/dashboard/IndiaHeatmap";
import AlertPanel from "@/components/dashboard/AlertPanel";
import InterventionSimulator from "@/components/dashboard/InterventionSimulator";
import EconomicImpact from "@/components/dashboard/EconomicImpact";
import DataMethodology from "@/components/dashboard/DataMethodology";
import { BarChart3, FileText, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const Index = () => {
  const [selected, setSelected] = useState<CommodityId>("onion");
  const [activeTab, setActiveTab] = useState<"dashboard" | "methodology">("dashboard");
  const data = COMMODITY_DATA[selected];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container px-4 py-4 space-y-4">
        {/* Commodity selector */}
        <CommoditySelector selected={selected} onSelect={setSelected} />

        {/* Stats row */}
        <StatsBar data={data} />

        {/* Tab switcher */}
        <div className="flex items-center gap-1 bg-card/50 rounded-lg p-1 w-fit border border-border/50">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
              activeTab === "dashboard"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <BarChart3 className="w-4 h-4" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("methodology")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
              activeTab === "methodology"
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <FileText className="w-4 h-4" />
            Data & Methodology
          </button>
          <Link
            to="/community"
            className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all text-muted-foreground hover:text-foreground"
          >
            <Users className="w-4 h-4" />
            Community Impact
          </Link>
        </div>

        {activeTab === "dashboard" ? (
          <>
            {/* Main grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <PriceChart data={data} />
              </div>
              <div>
                <RiskGauge data={data} />
              </div>
            </div>

            {/* Second row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <IndiaHeatmap stateRisks={data.stateRisks} />
              <AlertPanel />
              <InterventionSimulator data={data} />
            </div>

            {/* Economic Impact */}
            <EconomicImpact />
          </>
        ) : (
          <DataMethodology />
        )}

        {/* Footer */}
        <footer className="text-center py-6 border-t border-border">
          <p className="text-xs text-muted-foreground uppercase tracking-widest">
            PriceShield AI • Ministry of Consumer Affairs • Government of India
          </p>
          <p className="text-[10px] text-muted-foreground mt-1">
            Powered by LSTM Neural Networks & Prophet Forecasting Engine • Data Sources: Agmarknet, IMD, NAFED
          </p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
