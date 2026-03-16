import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Megaphone, MapPin, Calendar, CheckCircle2, Building2, Clock } from "lucide-react";

const DISTRICTS = ["Chennai", "Coimbatore", "Madurai", "Salem", "Tiruchirappalli", "Tirunelveli"];

type Subsidy = { title: string; description: string; commodity: string; price: string; validTill: string; source: string; type: "active" | "upcoming" };
type Center = { name: string; address: string; timings: string; stock: string };

const SUBSIDIES: Record<string, Subsidy[]> = {
  Chennai: [
    { title: "Onion at Subsidized Rate", description: "Government selling onions at ₹25/kg through ration shops and mobile vans across Chennai.", commodity: "Onion", price: "₹25/kg (Market: ₹38/kg)", validTill: "31 Mar 2026", source: "Dept. of Civil Supplies, TN", type: "active" },
    { title: "Free Rice Distribution", description: "Under PMGKAY extension, 5kg free rice per person per month through PDS outlets.", commodity: "Rice", price: "Free (5kg/person)", validTill: "30 Jun 2026", source: "Ministry of Food & Public Distribution", type: "active" },
    { title: "Dal Subsidy Program", description: "Tur Dal available at ₹60/kg at select fair price shops. Bharat Dal brand.", commodity: "Tur Dal", price: "₹60/kg (Market: ₹135/kg)", validTill: "30 Apr 2026", source: "NAFED / Bharat Brand", type: "upcoming" },
  ],
  Madurai: [
    { title: "Mobile Ration Vans", description: "Government mobile vans selling onions and potatoes at subsidized rates in rural areas around Madurai.", commodity: "Onion, Potato", price: "₹22/kg Onion, ₹18/kg Potato", validTill: "15 Apr 2026", source: "TN Civil Supplies Corporation", type: "active" },
    { title: "Amma Unavagam Meal", description: "Subsidized meals at ₹5 across Amma Unavagam centers. Includes rice, sambar, and curd rice.", commodity: "Cooked Meals", price: "₹5/meal", validTill: "Ongoing", source: "Greater Madurai Corporation", type: "active" },
  ],
};

// Fill other districts
for (const d of DISTRICTS) {
  if (!SUBSIDIES[d]) {
    SUBSIDIES[d] = [
      { title: "Bharat Brand Dal & Rice", description: `Subsidized pulses and rice available at fair price shops in ${d} district.`, commodity: "Rice, Tur Dal", price: "₹29/kg Rice, ₹60/kg Dal", validTill: "30 Apr 2026", source: "NAFED", type: "active" },
      { title: "Amma Unavagam", description: "Affordable meals at government-run food centers.", commodity: "Cooked Meals", price: "₹5–₹10/meal", validTill: "Ongoing", source: "TN Government", type: "active" },
    ];
  }
}

const CENTERS: Record<string, Center[]> = {
  Chennai: [
    { name: "Koyambedu FPS #12", address: "Near Koyambedu Bus Stand, Chennai-107", timings: "7 AM – 6 PM", stock: "Onion, Rice" },
    { name: "T. Nagar Ration Shop", address: "Pondy Bazaar, T. Nagar, Chennai-17", timings: "8 AM – 5 PM", stock: "Rice, Dal, Wheat" },
    { name: "Mobile Van – Tondiarpet", address: "Routes through Tondiarpet, Royapuram", timings: "9 AM – 1 PM", stock: "Onion, Potato" },
  ],
  Madurai: [
    { name: "Mattuthavani FPS", address: "Near Mattuthavani Bus Stand", timings: "7 AM – 5 PM", stock: "Onion, Rice, Dal" },
    { name: "Amma Unavagam – Periyar", address: "Periyar Bus Stand, Madurai", timings: "7 AM – 9 PM", stock: "Cooked Meals" },
  ],
};

for (const d of DISTRICTS) {
  if (!CENTERS[d]) {
    CENTERS[d] = [
      { name: `${d} Main FPS`, address: `Central Market Area, ${d}`, timings: "8 AM – 5 PM", stock: "Rice, Dal, Wheat" },
      { name: `${d} Mobile Van`, address: `Routes through ${d} rural areas`, timings: "9 AM – 2 PM", stock: "Onion, Potato" },
    ];
  }
}

const SubsidyAlerts = () => {
  const [district, setDistrict] = useState("Chennai");
  const [checked, setChecked] = useState(false);
  const [showCenters, setShowCenters] = useState(false);

  const subsidies = SUBSIDIES[district] || [];
  const centers = CENTERS[district] || [];

  return (
    <div className="space-y-4">
      <Card className="glass-card">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <Megaphone className="w-5 h-5 text-primary" />
            Government Subsidy & Food Program Alerts
          </CardTitle>
          <CardDescription>Stay informed about affordable food supply programs in your district</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Select District</label>
              <div className="flex flex-wrap gap-2">
                {DISTRICTS.map((d) => (
                  <button key={d} onClick={() => { setDistrict(d); setChecked(false); setShowCenters(false); }}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all border ${
                      district === d ? "bg-primary/10 text-primary border-primary/30" : "bg-secondary/50 text-muted-foreground border-border/50"
                    }`}>{d}</button>
                ))}
              </div>
            </div>
            <Button onClick={() => setChecked(true)}>
              <Megaphone className="w-4 h-4 mr-2" />
              Check Subsidy Programs
            </Button>
          </div>
        </CardContent>
      </Card>

      {checked && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subsidies.map((s, i) => (
              <Card key={i} className={`glass-card ${s.type === "active" ? "border-[hsl(var(--risk-low)/.3)]" : "border-primary/20"}`}>
                <CardContent className="pt-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      s.type === "active" ? "bg-[hsl(var(--risk-low)/.15)] text-[hsl(var(--risk-low))]" : "bg-primary/10 text-primary"
                    }`}>
                      {s.type === "active" ? "Active" : "Upcoming"}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{s.commodity}</span>
                  </div>
                  <h3 className="font-semibold text-sm text-foreground">{s.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{s.description}</p>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2 text-primary font-semibold font-mono">
                      💰 {s.price}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-3 h-3" /> Valid till: {s.validTill}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Building2 className="w-3 h-3" /> {s.source}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button variant="outline" onClick={() => setShowCenters(!showCenters)} className="w-fit">
            <MapPin className="w-4 h-4 mr-2" />
            {showCenters ? "Hide" : "View"} Nearby Distribution Centers
          </Button>

          {showCenters && (
            <Card className="glass-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Distribution Centers — {district}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {centers.map((c, i) => (
                    <div key={i} className="p-3 rounded-lg bg-secondary/30 border border-border/50 space-y-1.5">
                      <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[hsl(var(--risk-low))]" />
                        {c.name}
                      </h4>
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5"><MapPin className="w-3 h-3" />{c.address}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5"><Clock className="w-3 h-3" />{c.timings}</p>
                      <p className="text-xs text-foreground">Available: {c.stock}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default SubsidyAlerts;
