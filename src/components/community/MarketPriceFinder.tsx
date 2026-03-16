import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Star, TrendingUp, TrendingDown, ArrowRight } from "lucide-react";

const COMMODITIES = ["Onion", "Tomato", "Potato", "Rice", "Wheat", "Tur Dal"];
const DISTRICTS = ["Chennai", "Coimbatore", "Madurai", "Salem", "Tiruchirappalli", "Tirunelveli"];

type MarketData = { market: string; price: number; change: number; volume: string; distance: string };

const MARKET_DATA: Record<string, Record<string, MarketData[]>> = {
  Onion: {
    Madurai: [
      { market: "Mattuthavani Mandi", price: 28, change: -3, volume: "120 tons", distance: "2 km" },
      { market: "Tallakulam Market", price: 31, change: 2, volume: "85 tons", distance: "5 km" },
      { market: "Periyar Bus Stand Mkt", price: 26, change: -5, volume: "60 tons", distance: "4 km" },
      { market: "Thiruparankundram", price: 33, change: 5, volume: "40 tons", distance: "12 km" },
    ],
    Chennai: [
      { market: "Koyambedu Wholesale", price: 35, change: 2, volume: "450 tons", distance: "0 km" },
      { market: "Thirumazhisai", price: 32, change: -1, volume: "120 tons", distance: "15 km" },
      { market: "Ambattur", price: 34, change: 1, volume: "90 tons", distance: "12 km" },
      { market: "Tambaram", price: 30, change: -4, volume: "70 tons", distance: "25 km" },
    ],
    Coimbatore: [
      { market: "Mettupalayam Road", price: 29, change: -2, volume: "200 tons", distance: "3 km" },
      { market: "Singanallur", price: 27, change: -5, volume: "100 tons", distance: "8 km" },
      { market: "Pollachi", price: 25, change: -7, volume: "150 tons", distance: "35 km" },
    ],
    Salem: [
      { market: "Shevapet Market", price: 30, change: 1, volume: "110 tons", distance: "2 km" },
      { market: "Attur", price: 27, change: -3, volume: "60 tons", distance: "45 km" },
    ],
    Tiruchirappalli: [
      { market: "Gandhi Market", price: 29, change: -1, volume: "180 tons", distance: "1 km" },
      { market: "Srirangam", price: 31, change: 2, volume: "50 tons", distance: "8 km" },
    ],
    Tirunelveli: [
      { market: "Palayamkottai Mkt", price: 32, change: 3, volume: "70 tons", distance: "3 km" },
      { market: "Tenkasi", price: 28, change: -2, volume: "40 tons", distance: "50 km" },
    ],
  },
};

// Generate similar data for other commodities
for (const com of COMMODITIES.slice(1)) {
  MARKET_DATA[com] = {};
  const basePrice = com === "Tomato" ? 42 : com === "Potato" ? 22 : com === "Rice" ? 48 : com === "Wheat" ? 32 : 135;
  for (const dist of DISTRICTS) {
    const count = 2 + Math.floor(Math.random() * 3);
    MARKET_DATA[com][dist] = Array.from({ length: count }, (_, i) => ({
      market: `${dist} Market ${i + 1}`,
      price: basePrice + Math.floor(Math.random() * 12) - 5,
      change: Math.floor(Math.random() * 10) - 5,
      volume: `${50 + Math.floor(Math.random() * 200)} tons`,
      distance: `${1 + Math.floor(Math.random() * 40)} km`,
    }));
  }
}

const MarketPriceFinder = () => {
  const [commodity, setCommodity] = useState("Onion");
  const [district, setDistrict] = useState("Madurai");
  const [searched, setSearched] = useState(false);

  const markets = MARKET_DATA[commodity]?.[district] || [];
  const bestMarket = markets.length ? markets.reduce((a, b) => (a.price > b.price ? a : b)) : null;

  return (
    <div className="space-y-4">
      <Card className="glass-card">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <MapPin className="w-5 h-5 text-primary" />
            Best Market Price Finder
          </CardTitle>
          <CardDescription>Find the best nearby mandi to sell your produce at maximum price</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Commodity</label>
              <div className="flex flex-wrap gap-2">
                {COMMODITIES.map((c) => (
                  <button key={c} onClick={() => { setCommodity(c); setSearched(false); }}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all border ${
                      commodity === c ? "bg-primary/10 text-primary border-primary/30" : "bg-secondary/50 text-muted-foreground border-border/50"
                    }`}>{c}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">District</label>
              <div className="flex flex-wrap gap-2">
                {DISTRICTS.map((d) => (
                  <button key={d} onClick={() => { setDistrict(d); setSearched(false); }}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all border ${
                      district === d ? "bg-primary/10 text-primary border-primary/30" : "bg-secondary/50 text-muted-foreground border-border/50"
                    }`}>{d}</button>
                ))}
              </div>
            </div>
            <div className="flex items-end">
              <Button onClick={() => setSearched(true)} className="w-full">
                <MapPin className="w-4 h-4 mr-2" />
                Find Best Market
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {searched && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Best market highlight */}
          {bestMarket && (
            <Card className="glass-card glow-primary">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-5 h-5 text-primary fill-primary" />
                  <span className="text-sm font-semibold text-primary uppercase tracking-wider">Best Market</span>
                </div>
                <h3 className="text-lg font-bold text-foreground">{bestMarket.market}</h3>
                <p className="text-3xl font-bold font-mono text-primary mt-2">₹{bestMarket.price}<span className="text-sm text-muted-foreground font-normal">/kg</span></p>
                <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                  <p>📦 Daily volume: {bestMarket.volume}</p>
                  <p>📍 Distance: {bestMarket.distance}</p>
                  <p className={bestMarket.change >= 0 ? "text-[hsl(var(--risk-low))]" : "text-[hsl(var(--risk-high))]"}>
                    {bestMarket.change >= 0 ? "↑" : "↓"} {Math.abs(bestMarket.change)}% vs last week
                  </p>
                </div>
                <Button variant="outline" className="w-full mt-4" size="sm">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Get Directions
                </Button>
              </CardContent>
            </Card>
          )}

          {/* All markets table */}
          <Card className="glass-card lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">All Markets in {district}</CardTitle>
              <CardDescription className="text-xs">{commodity} prices across nearby mandis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-xs text-muted-foreground">
                      <th className="text-left py-2 pr-4">Market</th>
                      <th className="text-right py-2 px-4">Price/kg</th>
                      <th className="text-right py-2 px-4">Change</th>
                      <th className="text-right py-2 px-4">Volume</th>
                      <th className="text-right py-2 pl-4">Distance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {markets.map((m, i) => (
                      <tr key={i} className={`border-b border-border/50 ${m === bestMarket ? "bg-primary/5" : ""}`}>
                        <td className="py-2.5 pr-4 font-medium text-foreground">
                          {m === bestMarket && <Star className="w-3 h-3 text-primary inline mr-1" />}
                          {m.market}
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono font-semibold text-foreground">₹{m.price}</td>
                        <td className="py-2.5 px-4 text-right">
                          <span className={`inline-flex items-center gap-0.5 text-xs ${m.change >= 0 ? "text-[hsl(var(--risk-low))]" : "text-[hsl(var(--risk-high))]"}`}>
                            {m.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            {Math.abs(m.change)}%
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-right text-muted-foreground">{m.volume}</td>
                        <td className="py-2.5 pl-4 text-right text-muted-foreground">{m.distance}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MarketPriceFinder;
