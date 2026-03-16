import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/dashboard/Header";
import { ArrowLeft, MessageSquare, TrendingUp, MapPin, Megaphone, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import SmsAlertSystem from "@/components/community/SmsAlertSystem";
import FarmerDecisionTool from "@/components/community/FarmerDecisionTool";
import MarketPriceFinder from "@/components/community/MarketPriceFinder";
import SubsidyAlerts from "@/components/community/SubsidyAlerts";
import GroceryPlanner from "@/components/community/GroceryPlanner";

const MODULES = [
  { id: "sms", label: "SMS Price Alerts", icon: MessageSquare, desc: "Alert families without apps" },
  { id: "farmer", label: "Farmer Decision Tool", icon: TrendingUp, desc: "Sell or hold advisory" },
  { id: "market", label: "Best Market Finder", icon: MapPin, desc: "Find best selling price" },
  { id: "subsidy", label: "Subsidy Alerts", icon: Megaphone, desc: "Government food programs" },
  { id: "planner", label: "Grocery Planner", icon: ShoppingCart, desc: "Smart family budgeting" },
] as const;

type ModuleId = typeof MODULES[number]["id"];

const CommunityImpact = () => {
  const [active, setActive] = useState<ModuleId>("sms");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container px-4 py-4 space-y-4">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>

        <div>
          <h2 className="text-xl font-bold text-foreground">Community Impact Tools</h2>
          <p className="text-sm text-muted-foreground">Direct benefit tools for farmers and low-income families</p>
        </div>

        {/* Module selector */}
        <div className="flex flex-wrap gap-2">
          {MODULES.map((m) => (
            <button
              key={m.id}
              onClick={() => setActive(m.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all border",
                active === m.id
                  ? "bg-primary/10 text-primary border-primary/30"
                  : "bg-card border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
              )}
            >
              <m.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{m.label}</span>
            </button>
          ))}
        </div>

        {/* Active module */}
        <div className="min-h-[500px]">
          {active === "sms" && <SmsAlertSystem />}
          {active === "farmer" && <FarmerDecisionTool />}
          {active === "market" && <MarketPriceFinder />}
          {active === "subsidy" && <SubsidyAlerts />}
          {active === "planner" && <GroceryPlanner />}
        </div>

        <footer className="text-center py-6 border-t border-border">
          <p className="text-xs text-muted-foreground uppercase tracking-widest">
            PriceShield AI • Ministry of Consumer Affairs • Government of India
          </p>
        </footer>
      </main>
    </div>
  );
};

export default CommunityImpact;
