import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Phone, CheckCircle2, Globe } from "lucide-react";

const COMMODITIES = ["Onion", "Tomato", "Potato", "Rice", "Wheat", "Tur Dal"];
const LANGUAGES = ["English", "Tamil", "Hindi"];

const ALERT_MESSAGES: Record<string, Record<string, string>> = {
  English: {
    Onion: "⚠️ Alert: Onion prices expected to rise by 15% next week in your area. Consider buying early. Current price: ₹38/kg. — PriceShield AI",
    Tomato: "⚠️ Alert: Tomato prices may surge due to heavy rainfall forecast. Current price: ₹42/kg. Stock up this week. — PriceShield AI",
    Potato: "✅ Info: Potato prices stable at ₹22/kg. No surge expected in next 14 days. — PriceShield AI",
    Rice: "⚠️ Alert: Rice prices trending up by 8% due to transport disruptions. Current: ₹48/kg. — PriceShield AI",
    Wheat: "✅ Info: Wheat prices remain stable at ₹32/kg. Government buffer stock adequate. — PriceShield AI",
    "Tur Dal": "⚠️ Alert: Tur Dal prices expected to increase by 12% next month. Current: ₹135/kg. — PriceShield AI",
  },
  Tamil: {
    Onion: "⚠️ எச்சரிக்கை: வெங்காய விலை அடுத்த வாரம் 15% உயரும் என எதிர்பார்க்கப்படுகிறது. தற்போதைய விலை: ₹38/கிலோ — PriceShield AI",
    Tomato: "⚠️ எச்சரிக்கை: தக்காளி விலை அதிக மழை காரணமாக உயரலாம். தற்போது: ₹42/கிலோ — PriceShield AI",
    Potato: "✅ தகவல்: உருளைக்கிழங்கு விலை ₹22/கிலோ நிலையானது. — PriceShield AI",
    Rice: "⚠️ எச்சரிக்கை: அரிசி விலை போக்குவரத்து தடங்கல் காரணமாக 8% உயர்வு. — PriceShield AI",
    Wheat: "✅ தகவல்: கோதுமை விலை ₹32/கிலோ நிலையானது. — PriceShield AI",
    "Tur Dal": "⚠️ எச்சரிக்கை: துவரம் பருப்பு விலை அடுத்த மாதம் 12% உயரும். — PriceShield AI",
  },
  Hindi: {
    Onion: "⚠️ अलर्ट: प्याज की कीमत अगले हफ्ते 15% बढ़ सकती है। वर्तमान मूल्य: ₹38/किलो — PriceShield AI",
    Tomato: "⚠️ अलर्ट: भारी बारिश के कारण टमाटर की कीमत बढ़ सकती है। वर्तमान: ₹42/किलो — PriceShield AI",
    Potato: "✅ सूचना: आलू की कीमत ₹22/किलो पर स्थिर है। — PriceShield AI",
    Rice: "⚠️ अलर्ट: चावल की कीमत परिवहन बाधाओं के कारण 8% बढ़ रही है। — PriceShield AI",
    Wheat: "✅ सूचना: गेहूं की कीमत ₹32/किलो पर स्थिर है। — PriceShield AI",
    "Tur Dal": "⚠️ अलर्ट: तूर दाल की कीमत अगले महीने 12% बढ़ सकती है। — PriceShield AI",
  },
};

const SmsAlertSystem = () => {
  const [phone, setPhone] = useState("");
  const [commodity, setCommodity] = useState("Onion");
  const [language, setLanguage] = useState("English");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSend = () => {
    if (!phone || phone.length < 10) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card className="glass-card">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <MessageSquare className="w-5 h-5 text-primary" />
            SMS Price Alert System
          </CardTitle>
          <CardDescription>Send price alerts to families without smartphone access</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Phone Number</label>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => { setPhone(e.target.value); setSent(false); }}
                className="font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Select Commodity</label>
            <div className="flex flex-wrap gap-2">
              {COMMODITIES.map((c) => (
                <button
                  key={c}
                  onClick={() => { setCommodity(c); setSent(false); }}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all border ${
                    commodity === c
                      ? "bg-primary/10 text-primary border-primary/30"
                      : "bg-secondary/50 text-muted-foreground border-border/50 hover:text-foreground"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Language</label>
            <div className="flex gap-2">
              {LANGUAGES.map((l) => (
                <button
                  key={l}
                  onClick={() => { setLanguage(l); setSent(false); }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all border ${
                    language === l
                      ? "bg-primary/10 text-primary border-primary/30"
                      : "bg-secondary/50 text-muted-foreground border-border/50 hover:text-foreground"
                  }`}
                >
                  <Globe className="w-3 h-3" />
                  {l}
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleSend}
            disabled={!phone || phone.length < 10 || sending}
            className="w-full"
          >
            {sending ? "Sending..." : "Send Alert"}
          </Button>

          {sent && (
            <div className="flex items-start gap-3 p-3 rounded-lg bg-[hsl(var(--risk-low)/.1)] border border-[hsl(var(--risk-low)/.3)]">
              <CheckCircle2 className="w-5 h-5 text-[hsl(var(--risk-low))] mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-[hsl(var(--risk-low))]">Alert Sent Successfully!</p>
                <p className="text-xs text-muted-foreground mt-1">SMS delivered to {phone}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-base">Message Preview</CardTitle>
          <CardDescription>Preview of the SMS that will be sent</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-secondary/50 rounded-lg p-4 border border-border/50">
            <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
              <span className="font-mono">To: {phone || "+91 XXXXX XXXXX"}</span>
              <span>•</span>
              <span>{language}</span>
            </div>
            <div className="bg-background/50 rounded-md p-3 text-sm leading-relaxed text-foreground">
              {ALERT_MESSAGES[language]?.[commodity] || "Select a commodity to preview the message."}
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Recent Alerts Sent</h4>
            {[
              { phone: "+91 94421 XXXXX", commodity: "Onion", time: "2 hours ago", status: "Delivered" },
              { phone: "+91 98765 XXXXX", commodity: "Tomato", time: "5 hours ago", status: "Delivered" },
              { phone: "+91 87654 XXXXX", commodity: "Rice", time: "1 day ago", status: "Delivered" },
            ].map((r, i) => (
              <div key={i} className="flex items-center justify-between text-xs p-2 rounded bg-secondary/30">
                <span className="font-mono text-muted-foreground">{r.phone}</span>
                <span className="text-foreground">{r.commodity}</span>
                <span className="text-muted-foreground">{r.time}</span>
                <span className="text-[hsl(var(--risk-low))]">{r.status}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SmsAlertSystem;
