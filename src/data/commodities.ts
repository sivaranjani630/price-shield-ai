export type CommodityId = "onion" | "tomato" | "potato" | "rice" | "wheat" | "tur_dal";

export interface Commodity {
  id: CommodityId;
  name: string;
  unit: string;
  icon: string;
  category: "vegetable" | "grain" | "pulse";
}

export const COMMODITIES: Commodity[] = [
  { id: "onion", name: "Onion", unit: "₹/kg", icon: "🧅", category: "vegetable" },
  { id: "tomato", name: "Tomato", unit: "₹/kg", icon: "🍅", category: "vegetable" },
  { id: "potato", name: "Potato", unit: "₹/kg", icon: "🥔", category: "vegetable" },
  { id: "rice", name: "Rice", unit: "₹/kg", icon: "🍚", category: "grain" },
  { id: "wheat", name: "Wheat", unit: "₹/kg", icon: "🌾", category: "grain" },
  { id: "tur_dal", name: "Tur Dal", unit: "₹/kg", icon: "🫘", category: "pulse" },
];

export type RiskLevel = "low" | "medium" | "high" | "critical";

export interface PricePoint {
  date: string;
  price: number;
  predicted?: boolean;
  anomaly?: boolean;
  confidenceLow?: number;
  confidenceHigh?: number;
}

export interface StateRisk {
  state: string;
  stateCode: string;
  risk: RiskLevel;
  surgeProb: number;
  avgPrice: number;
  priceChange: number;
}

export interface CommodityData {
  id: CommodityId;
  currentPrice: number;
  weekChange: number;
  monthChange: number;
  riskLevel: RiskLevel;
  surgeProb: number;
  volatility: number;
  arrivalDrop: number;
  weatherScore: number;
  priceHistory: PricePoint[];
  forecast: PricePoint[];
  stateRisks: StateRisk[];
}

const generatePriceHistory = (basePrice: number, volatility: number, days: number, anomalyDays: number[] = []): PricePoint[] => {
  const points: PricePoint[] = [];
  let price = basePrice * 0.85;
  const today = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dayIndex = days - i;
    
    const trend = (dayIndex / days) * (basePrice - price);
    const noise = (Math.random() - 0.5) * volatility * basePrice;
    const seasonal = Math.sin(dayIndex / 30 * Math.PI) * basePrice * 0.05;
    
    price = basePrice * 0.85 + trend + noise + seasonal;
    price = Math.max(price * 0.7, Math.min(price * 1.5, price));
    
    const isAnomaly = anomalyDays.includes(dayIndex);
    if (isAnomaly) price *= 1.25 + Math.random() * 0.15;

    points.push({
      date: date.toISOString().split("T")[0],
      price: Math.round(price * 100) / 100,
      anomaly: isAnomaly,
    });
  }
  return points;
};

const generateForecast = (lastPrice: number, trend: number, days: number): PricePoint[] => {
  const points: PricePoint[] = [];
  let price = lastPrice;
  const today = new Date();
  
  for (let i = 1; i <= days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    price += trend + (Math.random() - 0.45) * 2;
    const confidence = i * 1.5;
    points.push({
      date: date.toISOString().split("T")[0],
      price: Math.round(price * 100) / 100,
      predicted: true,
      confidenceLow: Math.round((price - confidence) * 100) / 100,
      confidenceHigh: Math.round((price + confidence) * 100) / 100,
    });
  }
  return points;
};

const INDIAN_STATES: { state: string; stateCode: string }[] = [
  { state: "Maharashtra", stateCode: "MH" },
  { state: "Karnataka", stateCode: "KA" },
  { state: "Madhya Pradesh", stateCode: "MP" },
  { state: "Uttar Pradesh", stateCode: "UP" },
  { state: "Rajasthan", stateCode: "RJ" },
  { state: "Gujarat", stateCode: "GJ" },
  { state: "Andhra Pradesh", stateCode: "AP" },
  { state: "Tamil Nadu", stateCode: "TN" },
  { state: "West Bengal", stateCode: "WB" },
  { state: "Punjab", stateCode: "PB" },
  { state: "Haryana", stateCode: "HR" },
  { state: "Bihar", stateCode: "BR" },
  { state: "Odisha", stateCode: "OD" },
  { state: "Kerala", stateCode: "KL" },
  { state: "Telangana", stateCode: "TG" },
];

const generateStateRisks = (basePrice: number): StateRisk[] => {
  const risks: RiskLevel[] = ["low", "medium", "high", "critical"];
  return INDIAN_STATES.map((s) => {
    const risk = risks[Math.floor(Math.random() * 4)] as RiskLevel;
    const surgeProb = risk === "low" ? 5 + Math.random() * 20 : risk === "medium" ? 30 + Math.random() * 25 : risk === "high" ? 60 + Math.random() * 20 : 85 + Math.random() * 15;
    const priceVar = (Math.random() - 0.3) * 0.4;
    return {
      ...s,
      risk,
      surgeProb: Math.round(surgeProb),
      avgPrice: Math.round(basePrice * (1 + priceVar) * 100) / 100,
      priceChange: Math.round(priceVar * 100 * 10) / 10,
    };
  });
};

export const COMMODITY_DATA: Record<CommodityId, CommodityData> = {
  onion: (() => {
    const history = generatePriceHistory(42, 0.08, 90, [25, 67]);
    const lastPrice = history[history.length - 1].price;
    return {
      id: "onion", currentPrice: lastPrice, weekChange: 12.4, monthChange: 28.6,
      riskLevel: "high" as RiskLevel, surgeProb: 78, volatility: 34, arrivalDrop: 22, weatherScore: 72,
      priceHistory: history, forecast: generateForecast(lastPrice, 1.2, 30),
      stateRisks: generateStateRisks(42),
    };
  })(),
  tomato: (() => {
    const history = generatePriceHistory(35, 0.12, 90, [40]);
    const lastPrice = history[history.length - 1].price;
    return {
      id: "tomato", currentPrice: lastPrice, weekChange: 18.2, monthChange: 45.3,
      riskLevel: "critical" as RiskLevel, surgeProb: 92, volatility: 48, arrivalDrop: 35, weatherScore: 85,
      priceHistory: history, forecast: generateForecast(lastPrice, 2.1, 30),
      stateRisks: generateStateRisks(35),
    };
  })(),
  potato: (() => {
    const history = generatePriceHistory(28, 0.05, 90, []);
    const lastPrice = history[history.length - 1].price;
    return {
      id: "potato", currentPrice: lastPrice, weekChange: -2.1, monthChange: 5.3,
      riskLevel: "low" as RiskLevel, surgeProb: 12, volatility: 11, arrivalDrop: -5, weatherScore: 20,
      priceHistory: history, forecast: generateForecast(lastPrice, -0.2, 30),
      stateRisks: generateStateRisks(28),
    };
  })(),
  rice: (() => {
    const history = generatePriceHistory(55, 0.04, 90, []);
    const lastPrice = history[history.length - 1].price;
    return {
      id: "rice", currentPrice: lastPrice, weekChange: 1.8, monthChange: 4.2,
      riskLevel: "low" as RiskLevel, surgeProb: 15, volatility: 8, arrivalDrop: 2, weatherScore: 18,
      priceHistory: history, forecast: generateForecast(lastPrice, 0.15, 30),
      stateRisks: generateStateRisks(55),
    };
  })(),
  wheat: (() => {
    const history = generatePriceHistory(32, 0.06, 90, [55]);
    const lastPrice = history[history.length - 1].price;
    return {
      id: "wheat", currentPrice: lastPrice, weekChange: 5.6, monthChange: 11.2,
      riskLevel: "medium" as RiskLevel, surgeProb: 42, volatility: 19, arrivalDrop: 10, weatherScore: 45,
      priceHistory: history, forecast: generateForecast(lastPrice, 0.5, 30),
      stateRisks: generateStateRisks(32),
    };
  })(),
  tur_dal: (() => {
    const history = generatePriceHistory(145, 0.07, 90, [30, 72]);
    const lastPrice = history[history.length - 1].price;
    return {
      id: "tur_dal", currentPrice: lastPrice, weekChange: 8.9, monthChange: 15.7,
      riskLevel: "high" as RiskLevel, surgeProb: 68, volatility: 26, arrivalDrop: 18, weatherScore: 58,
      priceHistory: history, forecast: generateForecast(lastPrice, 3.5, 30),
      stateRisks: generateStateRisks(145),
    };
  })(),
};

export interface Alert {
  id: string;
  commodity: CommodityId;
  type: "surge" | "anomaly" | "supply";
  message: string;
  severity: RiskLevel;
  timestamp: string;
}

export const ALERTS: Alert[] = [
  { id: "1", commodity: "tomato", type: "surge", message: "Tomato prices projected to surge 45% in Karnataka within 14 days", severity: "critical", timestamp: "2 hours ago" },
  { id: "2", commodity: "onion", type: "surge", message: "Onion arrival volumes dropped 22% in Lasalgaon mandi", severity: "high", timestamp: "4 hours ago" },
  { id: "3", commodity: "tur_dal", type: "supply", message: "Tur Dal buffer stocks at 60-day low in Maharashtra", severity: "high", timestamp: "6 hours ago" },
  { id: "4", commodity: "wheat", type: "anomaly", message: "Abnormal wheat price movement detected in Punjab mandis", severity: "medium", timestamp: "8 hours ago" },
  { id: "5", commodity: "onion", type: "surge", message: "Unseasonal rainfall expected in Nashik — onion supply impact likely", severity: "high", timestamp: "12 hours ago" },
  { id: "6", commodity: "potato", type: "supply", message: "Potato cold storage releases ahead of schedule in UP", severity: "low", timestamp: "1 day ago" },
];
