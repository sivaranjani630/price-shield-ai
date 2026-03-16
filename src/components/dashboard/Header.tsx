import { Shield, Activity, Bell, LogOut } from "lucide-react";
import { ALERTS } from "@/data/commodities";

const Header = () => {
  const criticalCount = ALERTS.filter(a => a.severity === "critical" || a.severity === "high").length;

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-50">
      <div className="container flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 glow-primary">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight">
              <span className="text-gradient-primary">PriceShield</span>
              <span className="text-muted-foreground font-medium ml-1">AI</span>
            </h1>
            <p className="text-[10px] text-muted-foreground tracking-widest uppercase">
              Essential Commodity Surge Warning System
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
            <Activity className="w-3 h-3 text-risk-low animate-pulse" />
            <span>System Active</span>
            <span className="text-border">|</span>
            <span className="font-mono">Last sync: 2 min ago</span>
          </div>

          <div className="relative">
            <Bell className="w-5 h-5 text-muted-foreground" />
            {criticalCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold rounded-full bg-risk-high text-foreground">
                {criticalCount}
              </span>
            )}
          </div>

          {/* User avatar */}
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-chart-forecast text-xs font-bold text-foreground">
            TS
          </div>

          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
