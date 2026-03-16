import type { CommodityId, RiskLevel, PricePoint } from "./commodities";

export interface DistrictPrice {
  district: string;
  price: number;
  weekChange: number;
  nationalDiff: number; // % difference from national avg
  surgeProb: number;
  risk: RiskLevel;
  trend7d: number[]; // last 7 day prices
}

export interface StateCommodityData {
  commodityId: CommodityId;
  stateAvgPrice: number;
  nationalAvgPrice: number;
  weekChange: number;
  monthChange: number;
  surgeProb: number;
  riskLevel: RiskLevel;
  peakDate: string;
  districts: DistrictPrice[];
  priceHistory: PricePoint[];
  forecast: PricePoint[];
  rainfallAnomaly: number;
  tempDeviation: number;
  arrivalDrop: number;
  transportDisruption: number;
}

export interface StateData {
  stateCode: string;
  stateName: string;
  slug: string;
  population: number; // in crores
  commodities: Record<CommodityId, StateCommodityData>;
}

const gen7dTrend = (base: number, vol: number): number[] =>
  Array.from({ length: 7 }, (_, i) => Math.round((base + (Math.random() - 0.4) * vol * (i + 1)) * 100) / 100);

const genHistory = (base: number, vol: number): PricePoint[] => {
  const pts: PricePoint[] = [];
  let p = base * 0.82;
  const today = new Date();
  for (let i = 90; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const di = 90 - i;
    p = base * 0.82 + (di / 90) * (base - base * 0.82) + (Math.random() - 0.5) * vol * base + Math.sin(di / 30 * Math.PI) * base * 0.04;
    const anomaly = (di === 28 || di === 65) && vol > 0.07;
    if (anomaly) p *= 1.2;
    pts.push({ date: d.toISOString().split("T")[0], price: Math.round(p * 100) / 100, anomaly });
  }
  return pts;
};

const genForecast = (last: number, trend: number): PricePoint[] => {
  const pts: PricePoint[] = [];
  let p = last;
  const today = new Date();
  for (let i = 1; i <= 30; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    p += trend + (Math.random() - 0.45) * 2;
    const c = i * 1.8;
    pts.push({
      date: d.toISOString().split("T")[0],
      price: Math.round(p * 100) / 100,
      predicted: true,
      confidenceLow: Math.round((p - c) * 100) / 100,
      confidenceHigh: Math.round((p + c) * 100) / 100,
    });
  }
  return pts;
};

const peakDate = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
};

const TN_DISTRICTS = ["Chennai", "Coimbatore", "Madurai", "Salem", "Tiruchirappalli", "Tirunelveli", "Erode", "Vellore", "Thanjavur", "Dindigul"];

const makeTNDistricts = (base: number, vol: number, natAvg: number): DistrictPrice[] => {
  const risks: RiskLevel[] = ["low", "medium", "high", "critical"];
  return TN_DISTRICTS.map((d) => {
    const variance = (Math.random() - 0.3) * 0.35;
    const price = Math.round((base * (1 + variance)) * 100) / 100;
    const wc = Math.round((Math.random() - 0.3) * 20 * 10) / 10;
    const nd = Math.round(((price - natAvg) / natAvg) * 100 * 10) / 10;
    const sp = Math.round(15 + Math.random() * 75);
    const risk = sp < 25 ? "low" : sp < 50 ? "medium" : sp < 75 ? "high" : "critical";
    return {
      district: d,
      price,
      weekChange: wc,
      nationalDiff: nd,
      surgeProb: sp,
      risk: risk as RiskLevel,
      trend7d: gen7dTrend(price, vol * base),
    };
  });
};

const makeCommodity = (
  id: CommodityId,
  stateBase: number,
  natBase: number,
  vol: number,
  trend: number,
  surge: number,
  risk: RiskLevel,
  peak: number,
  rain: number,
  temp: number,
  arrival: number,
  transport: number
): StateCommodityData => {
  const hist = genHistory(stateBase, vol);
  const lastP = hist[hist.length - 1].price;
  return {
    commodityId: id,
    stateAvgPrice: Math.round(stateBase * 100) / 100,
    nationalAvgPrice: natBase,
    weekChange: Math.round((Math.random() - 0.3) * 18 * 10) / 10,
    monthChange: Math.round((Math.random() - 0.2) * 30 * 10) / 10,
    surgeProb: surge,
    riskLevel: risk,
    peakDate: peakDate(peak),
    districts: makeTNDistricts(stateBase, vol, natBase),
    priceHistory: hist,
    forecast: genForecast(lastP, trend),
    rainfallAnomaly: rain,
    tempDeviation: temp,
    arrivalDrop: arrival,
    transportDisruption: transport,
  };
};

export const TAMIL_NADU_DATA: StateData = {
  stateCode: "TN",
  stateName: "Tamil Nadu",
  slug: "tamil-nadu",
  population: 7.7,
  commodities: {
    onion: makeCommodity("onion", 48, 42, 0.09, 1.4, 72, "high", 12, 32, 2.1, 18, 24),
    tomato: makeCommodity("tomato", 52, 35, 0.14, 2.8, 88, "critical", 8, 45, 3.2, 32, 35),
    potato: makeCommodity("potato", 32, 28, 0.05, -0.1, 15, "low", 25, 8, 0.5, -3, 10),
    rice: makeCommodity("rice", 48, 55, 0.04, 0.2, 22, "low", 28, 12, 1.0, 4, 8),
    wheat: makeCommodity("wheat", 38, 32, 0.06, 0.6, 45, "medium", 15, 20, 1.5, 12, 18),
    tur_dal: makeCommodity("tur_dal", 158, 145, 0.08, 4.0, 65, "high", 10, 28, 2.5, 20, 22),
  },
};

// Map of state slugs to state data — easily extensible
export const STATE_DATA_MAP: Record<string, StateData> = {
  "tamil-nadu": TAMIL_NADU_DATA,
};

// Mapping from state codes to slugs
export const STATE_CODE_TO_SLUG: Record<string, string> = {
  TN: "tamil-nadu",
  MH: "maharashtra",
  KA: "karnataka",
  MP: "madhya-pradesh",
  UP: "uttar-pradesh",
  RJ: "rajasthan",
  GJ: "gujarat",
  AP: "andhra-pradesh",
  WB: "west-bengal",
  PB: "punjab",
  HR: "haryana",
  BR: "bihar",
  OD: "odisha",
  KL: "kerala",
  TG: "telangana",
  JK: "jammu-kashmir",
  DL: "delhi",
  JH: "jharkhand",
  CG: "chhattisgarh",
  GA: "goa",
};

export const STATE_SLUG_TO_NAME: Record<string, string> = {
  "tamil-nadu": "Tamil Nadu",
  "maharashtra": "Maharashtra",
  "karnataka": "Karnataka",
  "madhya-pradesh": "Madhya Pradesh",
  "uttar-pradesh": "Uttar Pradesh",
  "rajasthan": "Rajasthan",
  "gujarat": "Gujarat",
  "andhra-pradesh": "Andhra Pradesh",
  "west-bengal": "West Bengal",
  "punjab": "Punjab",
  "haryana": "Haryana",
  "bihar": "Bihar",
  "odisha": "Odisha",
  "kerala": "Kerala",
  "telangana": "Telangana",
  "jammu-kashmir": "Jammu & Kashmir",
  "delhi": "Delhi",
  "jharkhand": "Jharkhand",
  "chhattisgarh": "Chhattisgarh",
  "goa": "Goa",
};
