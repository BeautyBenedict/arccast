"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

const CONTRACT_ADDRESS = "0xEB655C83Ef17eC23B5F718BC7c6F072B789CEa5F";
const USDC_ADDRESS     = "0x3600000000000000000000000000000000000000";
const ARC_CHAIN_ID     = 5042002;
const ARC_RPC          = "https://rpc.testnet.arc.network";
const WEATHER_API_KEY  = "f0750dd7a6a2424821d07586d1bcde90";
const APPROVE_AMOUNT   = 10_000_000;

const SEL = {
  queryWeather:        "0x6b4292f3",
  checkIn:             "0x183ff085",
  subscribeMonthly:    "0xb6604472",
  subscribeYearly:     "0x6b20e22f",
  isSubscribed:        "0xb92ae87c",
  getStreak:           "0x5eeadb0d",
  getQueryFee:         "0x38b8caf2",
  getFreeQueries:      "0xd0bb4b3e",
  getSubscriptionInfo: "0xf804bb0e",
  getWalletRecords:    "0x0b52c64e",
  getRecord:           "0x03e9e609",
  leaderboard:         "0xd1d33d20",
  totalRecords:        "0x125f8974",
  balanceOf:           "0x70a08231",
  approve:             "0x095ea7b3",
  allowance:           "0xdd62ed3e",
};

const COUNTRY: Record<string, string> = {
  AF:"Afghanistan",AL:"Albania",DZ:"Algeria",AO:"Angola",AR:"Argentina",AM:"Armenia",
  AU:"Australia",AT:"Austria",AZ:"Azerbaijan",BH:"Bahrain",BD:"Bangladesh",BY:"Belarus",
  BE:"Belgium",BJ:"Benin",BO:"Bolivia",BA:"Bosnia and Herzegovina",BW:"Botswana",
  BR:"Brazil",BG:"Bulgaria",BF:"Burkina Faso",BI:"Burundi",CM:"Cameroon",CA:"Canada",
  CF:"Central African Republic",TD:"Chad",CL:"Chile",CN:"China",CO:"Colombia",
  CD:"DR Congo",CG:"Congo",CR:"Costa Rica",HR:"Croatia",CU:"Cuba",CY:"Cyprus",
  CZ:"Czech Republic",DK:"Denmark",DJ:"Djibouti",DO:"Dominican Republic",EC:"Ecuador",
  EG:"Egypt",SV:"El Salvador",ET:"Ethiopia",FI:"Finland",FR:"France",GA:"Gabon",
  GE:"Georgia",DE:"Germany",GH:"Ghana",GR:"Greece",GT:"Guatemala",GN:"Guinea",
  HT:"Haiti",HN:"Honduras",HU:"Hungary",IN:"India",ID:"Indonesia",IR:"Iran",IQ:"Iraq",
  IE:"Ireland",IL:"Israel",IT:"Italy",JM:"Jamaica",JP:"Japan",JO:"Jordan",KZ:"Kazakhstan",
  KE:"Kenya",KP:"North Korea",KR:"South Korea",KW:"Kuwait",KG:"Kyrgyzstan",LA:"Laos",
  LB:"Lebanon",LR:"Liberia",LY:"Libya",LT:"Lithuania",MG:"Madagascar",MW:"Malawi",
  MY:"Malaysia",ML:"Mali",MR:"Mauritania",MX:"Mexico",MD:"Moldova",MN:"Mongolia",
  MA:"Morocco",MZ:"Mozambique",MM:"Myanmar",NA:"Namibia",NP:"Nepal",NL:"Netherlands",
  NZ:"New Zealand",NI:"Nicaragua",NE:"Niger",NG:"Nigeria",NO:"Norway",OM:"Oman",
  PK:"Pakistan",PA:"Panama",PY:"Paraguay",PE:"Peru",PH:"Philippines",PL:"Poland",
  PT:"Portugal",QA:"Qatar",RO:"Romania",RU:"Russia",RW:"Rwanda",SA:"Saudi Arabia",
  SN:"Senegal",RS:"Serbia",SL:"Sierra Leone",SO:"Somalia",ZA:"South Africa",
  SS:"South Sudan",ES:"Spain",LK:"Sri Lanka",SD:"Sudan",SE:"Sweden",CH:"Switzerland",
  SY:"Syria",TW:"Taiwan",TJ:"Tajikistan",TZ:"Tanzania",TH:"Thailand",TG:"Togo",
  TN:"Tunisia",TR:"Turkey",TM:"Turkmenistan",UG:"Uganda",UA:"Ukraine",
  AE:"United Arab Emirates",GB:"United Kingdom",US:"United States",UY:"Uruguay",
  UZ:"Uzbekistan",VE:"Venezuela",VN:"Vietnam",YE:"Yemen",ZM:"Zambia",ZW:"Zimbabwe",
};

const COUNTRY_CAPITALS: Record<string, string> = {
  nigeria:"Lagos",ghana:"Accra",kenya:"Nairobi",ethiopia:"Addis Ababa",
  tanzania:"Dar es Salaam","south africa":"Cape Town",egypt:"Cairo",
  morocco:"Casablanca",algeria:"Algiers",senegal:"Dakar",cameroon:"Yaounde",
  uganda:"Kampala",rwanda:"Kigali",zambia:"Lusaka",zimbabwe:"Harare",
  angola:"Luanda",mozambique:"Maputo",mali:"Bamako",niger:"Niamey",
  chad:"Ndjamena",sudan:"Khartoum",somalia:"Mogadishu",
  usa:"New York","united states":"New York",america:"New York",
  uk:"London","united kingdom":"London",england:"London",britain:"London",
  france:"Paris",germany:"Berlin",italy:"Rome",spain:"Madrid",
  portugal:"Lisbon",netherlands:"Amsterdam",belgium:"Brussels",
  switzerland:"Geneva",sweden:"Stockholm",norway:"Oslo",denmark:"Copenhagen",
  finland:"Helsinki",poland:"Warsaw",russia:"Moscow",ukraine:"Kyiv",
  turkey:"Istanbul",greece:"Athens",hungary:"Budapest",romania:"Bucharest",
  china:"Beijing",japan:"Tokyo",india:"Mumbai","south korea":"Seoul",
  korea:"Seoul","north korea":"Pyongyang",indonesia:"Jakarta",
  thailand:"Bangkok",vietnam:"Hanoi",philippines:"Manila",malaysia:"Kuala Lumpur",
  singapore:"Singapore",pakistan:"Karachi",bangladesh:"Dhaka",
  "sri lanka":"Colombo",nepal:"Kathmandu",iran:"Tehran",iraq:"Baghdad",
  "saudi arabia":"Riyadh","united arab emirates":"Dubai",uae:"Dubai",
  israel:"Tel Aviv",jordan:"Amman",lebanon:"Beirut",kuwait:"Kuwait City",
  qatar:"Doha",brazil:"Sao Paulo",argentina:"Buenos Aires",
  colombia:"Bogota",peru:"Lima",chile:"Santiago",venezuela:"Caracas",
  mexico:"Mexico City",canada:"Toronto",australia:"Sydney","new zealand":"Auckland",
};

const CONTINENT: Record<string, string> = {
  NG:"Africa",GH:"Africa",KE:"Africa",ET:"Africa",TZ:"Africa",ZA:"Africa",EG:"Africa",
  MA:"Africa",DZ:"Africa",TN:"Africa",SN:"Africa",CM:"Africa",UG:"Africa",RW:"Africa",
  ZM:"Africa",ZW:"Africa",AO:"Africa",MZ:"Africa",ML:"Africa",NE:"Africa",TD:"Africa",
  SD:"Africa",SO:"Africa",BI:"Africa",BJ:"Africa",BF:"Africa",GA:"Africa",GN:"Africa",
  MW:"Africa",MG:"Africa",NA:"Africa",MR:"Africa",LR:"Africa",SL:"Africa",TG:"Africa",
  DJ:"Africa",CF:"Africa",CG:"Africa",CD:"Africa",SS:"Africa",
  US:"North America",CA:"North America",MX:"North America",
  GT:"Central America",HN:"Central America",SV:"Central America",
  NI:"Central America",CR:"Central America",PA:"Central America",
  BR:"South America",AR:"South America",CO:"South America",PE:"South America",
  CL:"South America",VE:"South America",EC:"South America",BO:"South America",
  PY:"South America",UY:"South America",
  GB:"Europe",FR:"Europe",DE:"Europe",IT:"Europe",ES:"Europe",PT:"Europe",
  NL:"Europe",BE:"Europe",CH:"Europe",SE:"Europe",NO:"Europe",DK:"Europe",
  FI:"Europe",PL:"Europe",RU:"Europe",UA:"Europe",TR:"Europe",GR:"Europe",
  HU:"Europe",RO:"Europe",CZ:"Europe",AT:"Europe",HR:"Europe",RS:"Europe",
  BG:"Europe",SK:"Europe",SI:"Europe",LT:"Europe",LV:"Europe",EE:"Europe",
  MD:"Europe",AL:"Europe",BA:"Europe",CY:"Europe",
  CN:"Asia",JP:"Asia",IN:"Asia",KR:"Asia",KP:"Asia",ID:"Asia",TH:"Asia",
  VN:"Asia",PH:"Asia",MY:"Asia",SG:"Asia",PK:"Asia",BD:"Asia",LK:"Asia",
  NP:"Asia",IR:"Asia",IQ:"Asia",SA:"Asia",AE:"Asia",IL:"Asia",JO:"Asia",
  LB:"Asia",KW:"Asia",QA:"Asia",BH:"Asia",OM:"Asia",YE:"Asia",SY:"Asia",
  KZ:"Asia",UZ:"Asia",TM:"Asia",KG:"Asia",TJ:"Asia",AZ:"Asia",GE:"Asia",
  AM:"Asia",MN:"Asia",MM:"Asia",LA:"Asia",KH:"Asia",TW:"Asia",AF:"Asia",
  AU:"Oceania",NZ:"Oceania",
};

const countryName = (code: string) => COUNTRY[code] || code;

// ─── EIP-6963 wallet detection ────────────────────────────────────────────────
interface EIP6963ProviderInfo {
  uuid: string;
  name: string;
  icon: string;
  rdns: string;
}
interface EIP6963ProviderDetail {
  info: EIP6963ProviderInfo;
  provider: any;
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface WeatherData {
  city: string; country: string; temp: number; feels_like: number;
  humidity: number; condition: string; description: string;
  wind: number; visibility: number; icon: string;
  cityDescription?: string; aqi?: number; lat: number; lon: number;
}
interface ForecastDay {
  date: string; temp_min: number; temp_max: number;
  condition: string; description: string; icon: string; humidity: number;
}
interface HistoryRecord {
  id: number; city: string; querier: string; timestamp: number;
  weatherData: string; note: string; type: "weather" | "checkin"; hidden?: boolean;
}
type TxStatus = "idle" | "approving" | "confirmed_approve" | "signing" | "confirming" | "done" | "error";
type Tab = "home" | "history" | "streak" | "subscribe";
type SubPlan = "monthly" | "yearly";

// ─── helpers ──────────────────────────────────────────────────────────────────
const truncate   = (a: string) => a.slice(0, 6) + "..." + a.slice(-4);
const formatTime = (ts: number): string => {
  if (!ts || ts < 1_000_000_000 || ts > 9_999_999_999) return "Unknown date";
  try { return new Date(ts * 1000).toLocaleString(); } catch { return "Unknown date"; }
};
const padAddr = (a: string) =>
  "000000000000000000000000" + a.replace(/^0x/i, "").toLowerCase().padStart(40, "0");
const pad64 = (n: number | bigint) => BigInt(n).toString(16).padStart(64, "0");

function decodeRevert(raw: unknown): string {
  // raw can be anything MetaMask sends — string, object, number, undefined
  // Always coerce to string first before any .slice() or .startsWith() calls
  let hex: string;
  if (typeof raw === "string") {
    hex = raw;
  } else if (raw && typeof raw === "object") {
    // Some wallets wrap error data as { data: "0x..." } or { message: "..." }
    const obj = raw as any;
    hex = obj.data ?? obj.message ?? obj.toString() ?? "";
  } else {
    hex = String(raw ?? "");
  }

  if (!hex || hex === "0x" || hex === "undefined" || hex === "null") {
    return "Transaction reverted (no reason given)";
  }

  try {
    // Error(string) — selector 0x08c379a0
    if (hex.startsWith("0x08c379a0")) {
      const data      = hex.slice(10);
      const strOffset = parseInt(data.slice(0, 64), 16);
      const lenStart  = strOffset * 2;
      const strLen    = parseInt(data.slice(lenStart, lenStart + 64), 16);
      const strData   = data.slice(lenStart + 64, lenStart + 64 + strLen * 2);
      const msg       = new TextDecoder().decode(
        new Uint8Array((strData.match(/.{2}/g) ?? []).map(b => parseInt(b, 16)))
      );
      return `Contract error: "${msg}"`;
    }
    // Panic(uint256) — selector 0x4e487b71
    if (hex.startsWith("0x4e487b71")) {
      const code = parseInt(hex.slice(10, 74), 16);
      if (code === 0x11) return "Contract error: arithmetic overflow. Try again.";
      return `Contract panic code 0x${code.toString(16)}`;
    }
  } catch { /* ignore decode errors */ }

  // Return first 40 chars of whatever we got as a last resort
  const preview = hex.length > 40 ? hex.slice(0, 40) + "…" : hex;
  return `Transaction reverted (${preview})`;
}

function abiEncStr(s: string): string {
  const bytes = new TextEncoder().encode(s);
  const lenWord = bytes.length.toString(16).padStart(64, "0");
  const dataHex = Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join("");
  return lenWord + dataHex.padEnd(Math.ceil(bytes.length / 32) * 64, "0");
}

function buildQueryCalldata(city: string, weatherJson: string, note: string): string {
  const e1 = abiEncStr(city);
  const e2 = abiEncStr(weatherJson);
  const e3 = abiEncStr(note);
  const o1 = 96;
  const o2 = o1 + e1.length / 2;
  const o3 = o2 + e2.length / 2;
  return (
    SEL.queryWeather +
    o1.toString(16).padStart(64, "0") +
    o2.toString(16).padStart(64, "0") +
    o3.toString(16).padStart(64, "0") +
    e1 + e2 + e3
  );
}

function readWord(hex: string, wordIndex: number): string {
  return hex.slice(wordIndex * 64, (wordIndex + 1) * 64);
}

function decodeStrAt(hex: string, byteOffset: number): string {
  try {
    if (byteOffset < 0 || byteOffset * 2 + 64 > hex.length) return "";
    const co  = byteOffset * 2;
    const len = parseInt(hex.slice(co, co + 64), 16);
    if (isNaN(len) || len === 0 || len > 100_000) return "";
    const raw = hex.slice(co + 64, co + 64 + len * 2);
    if (raw.length < len * 2) return "";
    const bytes = new Uint8Array((raw.match(/.{2}/g) ?? []).map(b => parseInt(b, 16)));
    return new TextDecoder("utf-8", { fatal: false }).decode(bytes);
  } catch { return ""; }
}

function isValidTimestamp(n: number): boolean {
  return n > 1_600_000_000 && n < 2_500_000_000;
}

function looksLikeCity(s: string): boolean {
  if (!s || s.length === 0 || s.length > 200) return false;
  const garbage = Array.from(s).filter(c => c.charCodeAt(0) < 32 || c.charCodeAt(0) === 127).length;
  return garbage < 2;
}

// ─── Decode getRecord return value ────────────────────────────────────────────
// The struct returned is: (string city, address querier, uint256 timestamp, string weatherData, string note)
// ABI encoding wraps this in an outer tuple pointer, so the layout is:
//
//   word 0:  outer tuple offset (0x20 = 32) — skip this
//   word 1:  offset to city string  (relative to start of tuple = word 1)
//   word 2:  querier address (padded to 32 bytes)
//   word 3:  timestamp uint256
//   word 4:  offset to weatherData string
//   word 5:  offset to note string
//   word 6+: string data
//
// We try every possible "start" offset (0..3) to be resilient against
// different wrapper depths, and pick the first one that yields a valid
// timestamp AND a valid-looking city string.
function decodeWeatherRecord(raw: string, id: number, querier: string): HistoryRecord | null {
  if (!raw || raw === "0x" || raw.length < 200) return null;
  const hex = raw.startsWith("0x") ? raw.slice(2) : raw;
  const totalWords = Math.floor(hex.length / 64);

  // Try start offsets 0, 1, 2, 3 — one of them will land on the struct head
  for (let start = 0; start <= 3; start++) {
    try {
      if (start + 5 > totalWords) continue;

      // struct head words relative to `start`:
      //   +0 = city string offset (uint256, bytes from start of struct)
      //   +1 = querier address (skip — we already have it from the call context)
      //   +2 = timestamp uint256
      //   +3 = weatherData string offset
      //   +4 = note string offset
      const cityRelOff = parseInt(readWord(hex, start + 0), 16);
      const ts         = parseInt(readWord(hex, start + 2), 16);
      const wdRelOff   = parseInt(readWord(hex, start + 3), 16);
      const noteRelOff = parseInt(readWord(hex, start + 4), 16);

      // Sanity: timestamp must look like a unix timestamp
      if (!isValidTimestamp(ts)) continue;

      // Sanity: offsets must be reasonable (< 50KB)
      if (cityRelOff > 50000 || wdRelOff > 50000 || noteRelOff > 50000) continue;

      // String offsets in the ABI are relative to the start of the struct (word `start`)
      const structByteBase = start * 32;
      const cityAbsOff = structByteBase + cityRelOff;
      const wdAbsOff   = structByteBase + wdRelOff;
      const noteAbsOff = structByteBase + noteRelOff;

      const city = decodeStrAt(hex, cityAbsOff);
      if (!looksLikeCity(city)) continue;

      const weatherData = decodeStrAt(hex, wdAbsOff);
      const note        = decodeStrAt(hex, noteAbsOff);

      console.log(`[decodeWeatherRecord] id=${id} start=${start} ts=${ts} city="${city}" note="${note?.slice(0,30)}"`);
      return { id, city, querier, timestamp: ts, weatherData, note: note || "", type: "weather" };
    } catch { continue; }
  }

  // Last resort: dump raw hex to console so we can debug the exact layout
  console.warn("[decodeWeatherRecord] ALL starts failed for id", id);
  console.warn("  hex words:", Array.from({length: Math.min(totalWords, 12)}, (_, i) =>
    `[${i}] ${hex.slice(i*64, i*64+64)}`).join("\n       "));
  return null;
}

// ─── UI helpers ───────────────────────────────────────────────────────────────
function buildCityDescription(city: string, cc: string, condition: string, temp: number, searched: string): string {
  const full = countryName(cc);
  const cont = CONTINENT[cc] || "the world";
  const c    = condition.toLowerCase();
  const climate = temp > 30 ? "known for its warm tropical climate" : temp < 10 ? "known for its cool temperatures" : "enjoying mild weather";
  const wx = c.includes("rain") ? "Currently experiencing rainfall"
    : c.includes("cloud") ? "Overcast skies today"
    : c.includes("clear") ? "Clear sunny skies today"
    : c.includes("snow")  ? "Snowfall in the area"
    : c.includes("thunder") ? "Thunderstorm conditions"
    : "Mixed weather conditions today";
  if (COUNTRY_CAPITALS[searched.toLowerCase().trim()])
    return `${city} is the main city shown for ${full}, a country in ${cont}. ${wx} with temperatures around ${temp}°C.`;
  if (city.toLowerCase() === full.toLowerCase())
    return `Showing weather for ${full}, located in ${cont}. ${wx} with temperatures around ${temp}°C.`;
  return `${city} is a location in ${full}, ${cont}, ${climate}. ${wx} with temperatures around ${temp}°C.`;
}

function weatherBg(cond: string, dark: boolean) {
  const c = cond.toLowerCase();
  if (c.includes("clear") || c.includes("sun"))       return dark ? "from-amber-950 via-orange-900 to-yellow-900" : "from-amber-50 via-orange-50 to-yellow-50";
  if (c.includes("cloud"))                             return dark ? "from-slate-900 via-gray-800 to-slate-800"    : "from-slate-100 via-gray-100 to-slate-200";
  if (c.includes("rain") || c.includes("drizzle"))     return dark ? "from-blue-950 via-slate-900 to-indigo-950"  : "from-blue-50 via-slate-100 to-indigo-100";
  if (c.includes("thunder") || c.includes("storm"))    return dark ? "from-purple-950 via-slate-900 to-gray-900"  : "from-purple-50 via-slate-100 to-gray-100";
  if (c.includes("snow"))                              return dark ? "from-blue-950 via-slate-800 to-blue-900"    : "from-blue-50 via-slate-50 to-blue-100";
  return dark ? "from-slate-900 via-gray-900 to-slate-800" : "from-slate-100 via-gray-50 to-slate-200";
}

function aqiInfo(aqi: number) {
  const m: Record<number, { label: string; color: string; bg: string }> = {
    1: { label: "Good",      color: "text-emerald-400", bg: "bg-emerald-500/10" },
    2: { label: "Fair",      color: "text-lime-400",    bg: "bg-lime-500/10"    },
    3: { label: "Moderate",  color: "text-amber-400",   bg: "bg-amber-500/10"   },
    4: { label: "Poor",      color: "text-orange-400",  bg: "bg-orange-500/10"  },
    5: { label: "Very Poor", color: "text-red-400",     bg: "bg-red-500/10"     },
  };
  return m[aqi] ?? { label: "Unknown", color: "text-gray-400", bg: "bg-gray-500/10" };
}

// ─── Always-visible countdown to next midnight UTC ───────────────────────────
function useCountdownToMidnight() {
  const [t, setT] = useState({ h: 0, m: 0, s: 0, total: 0 });
  useEffect(() => {
    const tick = () => {
      const now  = Math.floor(Date.now() / 1000);
      const next = nextMidnightUTC();
      const diff = Math.max(0, next - now);
      setT({
        h: Math.floor(diff / 3600),
        m: Math.floor((diff % 3600) / 60),
        s: diff % 60,
        total: diff,
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

function nextMidnightUTC(): number {
  const n = new Date();
  return Math.floor(new Date(Date.UTC(n.getUTCFullYear(), n.getUTCMonth(), n.getUTCDate() + 1)).getTime() / 1000);
}

function utcDateOf(unixSec: number): string {
  const d = new Date(unixSec * 1000);
  return `${d.getUTCFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()}`;
}
function todayUTCStr(): string {
  return utcDateOf(Math.floor(Date.now() / 1000));
}
function yesterdayUTCStr(): string {
  return utcDateOf(Math.floor(Date.now() / 1000) - 86400);
}

function computeStreakDisplay(lastCheckIn: bigint, onChainCount: bigint): {
  displayCount: bigint;
  checkedInToday: boolean;
  streakBroken: boolean;
} {
  if (lastCheckIn === 0n) {
    return { displayCount: 0n, checkedInToday: false, streakBroken: false };
  }
  const lastDate  = utcDateOf(Number(lastCheckIn));
  const today     = todayUTCStr();
  const yesterday = yesterdayUTCStr();

  const checkedInToday     = lastDate === today;
  const checkedInYesterday = lastDate === yesterday;
  const streakBroken       = !checkedInToday && !checkedInYesterday;

  return {
    displayCount:  streakBroken ? 0n : onChainCount,
    checkedInToday,
    streakBroken,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function ArcCast() {
  const [dark, setDark]         = useState(true);
  const [account, setAccount]   = useState<string | null>(null);
  const [chainOk, setChainOk]   = useState(false);

  // ── EIP-6963 discovered wallets ──────────────────────────
  const [discoveredWallets, setDiscoveredWallets] = useState<EIP6963ProviderDetail[]>([]);
  // Computed wallet options — built client-side only (avoids SSR window error)
  const [walletOptions, setWalletOptions] = useState<{ id: string; name: string; icon: string; desc: string; provider: any }[]>([]);
  // The provider instance chosen by the user
  const activeProviderRef = useRef<any>(null);

  const [city, setCity]         = useState("");
  const [note, setNote]         = useState("");
  const [weather, setWeather]   = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [fetching, setFetching] = useState(false);
  const [weatherErr, setWeatherErr]   = useState("");
  const [cityWarning, setCityWarning] = useState("");

  const [txStatus, setTxStatus] = useState<TxStatus>("idle");
  const [txHash, setTxHash]     = useState("");
  const [txError, setTxError]   = useState("");
  const [txStep, setTxStep]     = useState("");

  const [history, setHistory]               = useState<HistoryRecord[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const [streak, setStreak]         = useState<{ count: bigint; totalCheckIns: bigint; lastCheckIn: bigint } | null>(null);
  const [subscribed, setSubscribed] = useState(false);
  const [subExpiry, setSubExpiry]   = useState(0);
  const [usdcBalance, setUsdcBalance]   = useState<bigint>(0n);
  const [totalQueries, setTotalQueries] = useState<bigint>(0n);
  const [leaderScore, setLeaderScore]   = useState<bigint>(0n);
  const [freeQueries, setFreeQueries]   = useState<bigint>(0n);
  const [queryFee, setQueryFee]         = useState<bigint>(10000n);

  const [tab, setTab]                 = useState<Tab>("home");
  const [checkingIn, setCheckingIn]   = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm]     = useState<number | null>(null);

  const dataLoadedRef = useRef<string | null>(null);
  const countdown = useCountdownToMidnight();

  const streakDisplay = streak
    ? computeStreakDisplay(streak.lastCheckIn, streak.count)
    : { displayCount: 0n, checkedInToday: false, streakBroken: false };

  // ── Get the active provider (chosen wallet or fallback) ───
  const eth = useCallback(() => {
    // Use whatever the user explicitly selected
    if (activeProviderRef.current) return activeProviderRef.current;
    // Fallback: window.ethereum (MetaMask or first injected)
    return (window as any).ethereum;
  }, []);

  // ── EIP-6963: discover all installed wallets ─────────────
  useEffect(() => {
    const seen = new Set<string>();
    const handleAnnounce = (event: any) => {
      const detail: EIP6963ProviderDetail = event.detail;
      if (!detail?.info?.uuid || seen.has(detail.info.uuid)) return;
      seen.add(detail.info.uuid);
      setDiscoveredWallets(prev => [...prev, detail]);
    };
    window.addEventListener("eip6963:announceProvider", handleAnnounce as EventListener);
    window.dispatchEvent(new Event("eip6963:requestProvider"));
    return () => window.removeEventListener("eip6963:announceProvider", handleAnnounce as EventListener);
  }, []);

  // ── Build walletOptions whenever discovered wallets update ─
  // Must run client-side only (useEffect) — avoids "window is not defined" SSR crash
  useEffect(() => {
    const opts: { id: string; name: string; icon: string; desc: string; provider: any }[] = [];

    // EIP-6963 discovered wallets take priority
    for (const w of discoveredWallets) {
      opts.push({
        id: w.info.uuid,
        name: w.info.name,
        icon: w.info.icon,
        desc: w.info.rdns,
        provider: w.provider,
      });
    }

    // Fallback: legacy window.ethereum / window.ethereum.providers
    if (opts.length === 0) {
      const win = window as any;
      if (win.ethereum) {
        const providers: any[] = win.ethereum.providers || [win.ethereum];
        for (const p of providers) {
          if (p.isMetaMask && !p.isRabby)
            opts.push({ id: "metamask-legacy", name: "MetaMask",      icon: "🦊", desc: "Most popular Ethereum wallet",        provider: p });
          else if (p.isRabby)
            opts.push({ id: "rabby-legacy",    name: "Rabby",         icon: "🐰", desc: "Security-focused multi-chain wallet", provider: p });
          else if (p.isOkxWallet || p.isOKExWallet)
            opts.push({ id: "okx-legacy",      name: "OKX Wallet",    icon: "⭕", desc: "Multi-chain web3 wallet",             provider: p });
          else if (opts.length === 0)
            opts.push({ id: "injected",         name: "Browser Wallet",icon: "🌐", desc: "Injected EVM wallet",                provider: p });
        }
      }
    }

    setWalletOptions(opts);
  }, [discoveredWallets]);

  // ── eth_call ──────────────────────────────────────────────
  const call = useCallback(async (to: string, data: string): Promise<string | null> => {
    try {
      return await eth().request({ method: "eth_call", params: [{ to, data }, "latest"] });
    } catch (e) { console.warn("eth_call:", e); return null; }
  }, [eth]);

  // ── Wait for tx receipt ───────────────────────────────────
  const waitForTx = useCallback(async (hash: string, maxSec = 240): Promise<boolean> => {
    const deadline = Date.now() + maxSec * 1000;
    while (Date.now() < deadline) {
      try {
        const r = await eth().request({ method: "eth_getTransactionReceipt", params: [hash] });
        if (r?.status === "0x1") return true;
        if (r?.status === "0x0") { console.warn("Tx reverted:", hash); return false; }
      } catch { /* ignore */ }
      await new Promise(res => setTimeout(res, 5000));
    }
    return false;
  }, [eth]);

  // ── Read USDC allowance ───────────────────────────────────
  const readAllowance = useCallback(async (owner: string): Promise<bigint> => {
    for (let i = 0; i < 4; i++) {
      try {
        const r = await eth().request({
          method: "eth_call",
          params: [{ to: USDC_ADDRESS, data: SEL.allowance + padAddr(owner) + padAddr(CONTRACT_ADDRESS) }, "latest"],
        });
        if (r && r !== "0x") return BigInt(r);
      } catch { /* ignore */ }
      if (i < 3) await new Promise(r => setTimeout(r, 2000));
    }
    return 0n;
  }, [eth]);

  // ── Switch / add Arc Testnet ──────────────────────────────
  // Uses wallet_addEthereumChain as the primary call because it works in ALL cases:
  //   - Fresh MetaMask (chain not added): shows "Add Network" popup with full details
  //   - MetaMask with chain already saved: shows "Switch to Arc Testnet" popup
  // This guarantees the user always sees a wallet popup regardless of their state.
  const switchToArc = useCallback(async (providerOverride?: any): Promise<boolean> => {
    // Resolution order: explicit arg > activeRef > window.ethereum
    const provider = providerOverride ?? activeProviderRef.current ?? (window as any).ethereum;
    if (!provider) return false;

    const hexId = "0x" + ARC_CHAIN_ID.toString(16); // 5042002 = 0x4CE912

    // IMPORTANT: Arc Testnet native currency (USDC gas token) uses 18 decimals
    // for the native denomination even though the ERC20 interface uses 6.
    // MetaMask rejects wallet_addEthereumChain if decimals is wrong.
    const arcNetworkParams = {
      chainId:   hexId,
      chainName: "Arc Testnet",
      nativeCurrency: { name: "USDC", symbol: "USDC", decimals: 18 },
      rpcUrls:   ["https://rpc.testnet.arc.network"],
      blockExplorerUrls: ["https://testnet.arcscan.app"],
    };

    try {
      await provider.request({ method: "wallet_addEthereumChain", params: [arcNetworkParams] });
      setChainOk(true);
      return true;
    } catch (err: any) {
      console.error("switchToArc wallet_addEthereumChain:", err?.code, err?.message);
      if (err?.code === 4001) return false; // user rejected — respect that
      // Fallback for wallets that only support wallet_switchEthereumChain
      try {
        await provider.request({ method: "wallet_switchEthereumChain", params: [{ chainId: hexId }] });
        setChainOk(true);
        return true;
      } catch (switchErr: any) {
        console.error("switchToArc fallback:", switchErr?.code, switchErr?.message);
        return false;
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Connect wallet — uses the provider from EIP-6963 or fallback ──
  const connectWithProvider = useCallback(async (provider: any, walletName: string) => {
    setShowWalletModal(false);
    if (!provider) {
      alert(`${walletName} not found. Please install it and refresh the page.`);
      return;
    }

    // Store the provider BEFORE any awaits so all subsequent calls use it
    activeProviderRef.current = provider;

    try {
      // Step 1: Request account access
      const accounts = await provider.request({ method: "eth_requestAccounts" });
      if (!accounts || accounts.length === 0) throw new Error("No accounts returned");
      setAccount(accounts[0]);

      // Step 2: ALWAYS prompt to add/switch to Arc network, regardless of current chain.
      // wallet_addEthereumChain shows a popup in BOTH cases:
      //   - Chain not in wallet yet → "Add Arc Testnet" popup
      //   - Chain already saved     → "Switch to Arc Testnet" popup
      // This ensures first-timers always get the network prompt.
      const switched = await switchToArc(provider);
      if (!switched) {
        // User rejected the network switch — keep them connected but show the banner
        const cid = await provider.request({ method: "eth_chainId" });
        if (parseInt(cid, 16) === ARC_CHAIN_ID) setChainOk(true);
        // else: chainOk stays false → the "Wrong network" banner will show
      }
    } catch (e: any) {
      if (e?.code === 4001) {
        // User rejected account access — clean up fully
        activeProviderRef.current = null;
        return;
      }
      activeProviderRef.current = null;
      console.error("connectWithProvider:", e);
      alert(`Failed to connect ${walletName}: ${e?.message || "Unknown error"}`);
    }
  }, [switchToArc]);

  // ── Legacy fallback: connect with window.ethereum ─────────
  const connectLegacy = useCallback(async (walletId: string) => {
    setShowWalletModal(false);
    const win = window as any;
    let provider = win.ethereum;

    // If multiple providers are injected (window.ethereum.providers array),
    // try to find the one matching the chosen wallet id
    if (win.ethereum?.providers?.length > 0) {
      const found = win.ethereum.providers.find((p: any) => {
        if (walletId === "metamask") return p.isMetaMask && !p.isRabby;
        if (walletId === "rabby")    return p.isRabby;
        if (walletId === "okx")      return p.isOkxWallet || p.isOKExWallet;
        return false;
      });
      if (found) provider = found;
    }

    if (!provider) {
      alert(`${walletId} wallet not found. Please install it.`);
      return;
    }

    activeProviderRef.current = provider;
    try {
      const accounts = await provider.request({ method: "eth_requestAccounts" });
      if (!accounts || accounts.length === 0) throw new Error("No accounts");
      setAccount(accounts[0]);
      const cid = await provider.request({ method: "eth_chainId" });
      if (parseInt(cid, 16) === ARC_CHAIN_ID) setChainOk(true);
      else await switchToArc();
    } catch (e: any) {
      activeProviderRef.current = null;
      if (e?.code !== 4001) console.error(e);
    }
  }, [switchToArc]);

  const disconnectWallet = useCallback(() => {
    // Clear all state
    setAccount(null);
    setChainOk(false);
    setUsdcBalance(0n);
    setTotalQueries(0n);
    setLeaderScore(0n);
    setSubscribed(false);
    setSubExpiry(0);
    setStreak(null);
    setHistory([]);
    setWeather(null);
    setForecast([]);
    setTxStatus("idle");
    setTxError("");
    setTxHash("");
    setFreeQueries(0n);
    setQueryFee(10000n);
    // Clear provider reference — this is what makes disconnect actually work
    activeProviderRef.current = null;
    dataLoadedRef.current = null;
  }, []);

  // ── Load on-chain history ─────────────────────────────────
  const loadHistory = useCallback(async (acc: string) => {
    setLoadingHistory(true);
    // Preserve any local check-in entries already in state
    setHistory(prev => prev.filter(r => r.type === "checkin"));
    try {
      const raw = await call(CONTRACT_ADDRESS, SEL.getWalletRecords + padAddr(acc));
      console.log("[loadHistory] getWalletRecords raw length:", raw?.length, "raw:", raw?.slice(0, 80));

      if (!raw || raw === "0x" || raw.length < 130) {
        console.log("[loadHistory] No records returned from contract (empty wallet or no queries yet)");
        setLoadingHistory(false);
        return;
      }

      const hex    = raw.slice(2);
      const arrLen = parseInt(hex.slice(64, 128), 16);
      console.log("[loadHistory] Record count:", arrLen);

      if (!arrLen || isNaN(arrLen) || arrLen === 0) {
        console.log("[loadHistory] Array length is 0 or invalid");
        setLoadingHistory(false);
        return;
      }

      const ids: number[] = [];
      for (let i = 0; i < arrLen; i++)
        ids.push(parseInt(hex.slice(128 + i * 64, 192 + i * 64), 16));

      console.log("[loadHistory] IDs to fetch:", ids);
      const toFetch = ids.slice(-20).reverse();
      const records: HistoryRecord[] = [];

      for (const id of toFetch) {
        const recRaw = await call(CONTRACT_ADDRESS, SEL.getRecord + id.toString(16).padStart(64, "0"));
        if (recRaw && recRaw !== "0x") {
          const rec = decodeWeatherRecord(recRaw, id, acc);
          if (rec) {
            records.push(rec);
          } else {
            // Decode failed — log the full word layout for debugging
            const dbgHex = recRaw.startsWith("0x") ? recRaw.slice(2) : recRaw;
            const wordCount = Math.min(Math.floor(dbgHex.length / 64), 10);
            console.warn(`[loadHistory] Decode FAILED for id=${id}`);
            for (let wi = 0; wi < wordCount; wi++) {
              console.warn(`  word[${wi}]: ${dbgHex.slice(wi*64, wi*64+64)}`);
            }
            // Still push a visible placeholder so user knows the record exists
            records.push({
              id, city: `Record #${id}`, querier: acc,
              timestamp: Math.floor(Date.now() / 1000),
              weatherData: "", note: "⚠️ Could not decode this record — check browser console for raw data",
              type: "weather",
            });
          }
        }
        await new Promise(r => setTimeout(r, 200));
      }

      // Merge on-chain records with preserved local check-ins
      setHistory(prev => {
        const localCheckIns = prev.filter(r => r.type === "checkin");
        return [...localCheckIns, ...records];
      });
    } catch (e) { console.error("loadHistory:", e); }
    setLoadingHistory(false);
  }, [call]);

  // ── Load balances / streak / sub ──────────────────────────
  const loadChainData = useCallback(async (acc: string) => {
    try {
      const [bal, tot, lb, fq, qf, subRaw, skRaw] = await Promise.all([
        call(USDC_ADDRESS,     SEL.balanceOf           + padAddr(acc)),
        call(CONTRACT_ADDRESS, SEL.totalRecords),
        call(CONTRACT_ADDRESS, SEL.leaderboard         + padAddr(acc)),
        call(CONTRACT_ADDRESS, SEL.getFreeQueries      + padAddr(acc)),
        call(CONTRACT_ADDRESS, SEL.getQueryFee         + padAddr(acc)),
        call(CONTRACT_ADDRESS, SEL.getSubscriptionInfo + padAddr(acc)),
        call(CONTRACT_ADDRESS, SEL.getStreak           + padAddr(acc)),
      ]);

      if (bal  && bal  !== "0x") setUsdcBalance(BigInt(bal));
      if (tot  && tot  !== "0x") setTotalQueries(BigInt(tot));
      if (lb   && lb   !== "0x") setLeaderScore(BigInt(lb));
      if (fq   && fq   !== "0x") setFreeQueries(BigInt(fq));
      if (qf   && qf   !== "0x") setQueryFee(BigInt(qf));

      if (subRaw && subRaw.length > 66) {
        const h = subRaw.slice(2);
        setSubscribed(BigInt("0x" + h.slice(0, 64)) === 1n);
        setSubExpiry(Number(BigInt("0x" + h.slice(64, 128))));
      }

      if (skRaw && skRaw.length > 130) {
        const h  = skRaw.slice(2);
        const v0 = BigInt("0x" + h.slice(0,   64));
        const v1 = BigInt("0x" + h.slice(64,  128));
        const v2 = BigInt("0x" + h.slice(128, 192));

        console.log("getStreak raw values:", v0.toString(), v1.toString(), v2.toString());

        const isTs = (v: bigint) => v > 1_600_000_000n && v < 2_500_000_000n;

        let lastCheckIn = 0n, count = 0n, totalCheckIns = 0n;

        if (isTs(v0)) {
          lastCheckIn = v0; count = v1; totalCheckIns = v2;
        } else if (isTs(v1)) {
          lastCheckIn = v1; count = v0; totalCheckIns = v2;
        } else if (isTs(v2)) {
          lastCheckIn = v2; count = v0; totalCheckIns = v1;
        } else {
          lastCheckIn = v0; count = v1; totalCheckIns = v2;
        }

        if (count > totalCheckIns && totalCheckIns > 0n) {
          [count, totalCheckIns] = [totalCheckIns, count];
        }

        setStreak({ lastCheckIn, count, totalCheckIns });
      } else {
        setStreak({ lastCheckIn: 0n, count: 0n, totalCheckIns: 0n });
      }
    } catch (e) { console.error("loadChainData:", e); }
  }, [call]);

  // ── Bootstrap ─────────────────────────────────────────────
  useEffect(() => {
    if (!account || !chainOk) return;
    if (dataLoadedRef.current === account) return;
    dataLoadedRef.current = account;
    loadChainData(account);
    loadHistory(account);
  }, [account, chainOk, loadChainData, loadHistory]);

  // ── Wallet event listeners ─────────────────────────────────
  useEffect(() => {
    const provider = activeProviderRef.current || (window as any).ethereum;
    if (!provider) return;

    const onAccounts = (accs: string[]) => {
      if (!activeProviderRef.current) return; // ignore events after disconnect
      if (accs.length === 0) {
        disconnectWallet();
      } else {
        setAccount(accs[0]);
        setWeather(null);
        setHistory([]);
        dataLoadedRef.current = null;
      }
    };

    // chainChanged fires whenever the user switches networks in their wallet.
    // We use it to update chainOk in real-time so the banner appears/disappears.
    const onChain = (rawChainId: string) => {
      if (!activeProviderRef.current) return;
      const numId = parseInt(rawChainId, 16);
      if (numId === ARC_CHAIN_ID) {
        setChainOk(true);
      } else {
        setChainOk(false);
      }
    };

    provider.on?.("accountsChanged", onAccounts);
    provider.on?.("chainChanged", onChain);

    return () => {
      provider.removeListener?.("accountsChanged", onAccounts);
      provider.removeListener?.("chainChanged", onChain);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, disconnectWallet]);

  // ── Fetch weather ─────────────────────────────────────────
  const fetchWeather = async () => {
    if (!city.trim()) return;
    setFetching(true); setWeatherErr(""); setWeather(null); setForecast([]);
    setTxStatus("idle"); setCityWarning("");
    const searched = city.trim();
    const capital  = COUNTRY_CAPITALS[searched.toLowerCase()];
    const qCity    = capital || searched;
    if (capital) setCityWarning(`Showing weather for ${capital} as the main city for ${searched}.`);
    try {
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(qCity)}&appid=${WEATHER_API_KEY}&units=metric`);
      if (!res.ok) throw new Error(res.status === 404 ? "Location not found. Try a specific city name." : "Weather service error. Try again.");
      const d = await res.json();
      const w: WeatherData = {
        city: d.name, country: d.sys.country, temp: Math.round(d.main.temp),
        feels_like: Math.round(d.main.feels_like), humidity: d.main.humidity,
        condition: d.weather[0].main, description: d.weather[0].description,
        wind: Math.round(d.wind.speed * 3.6), visibility: Math.round((d.visibility || 0) / 1000),
        icon: d.weather[0].icon, lat: d.coord.lat, lon: d.coord.lon,
      };
      w.cityDescription = buildCityDescription(w.city, w.country, w.condition, w.temp, searched);
      try {
        const aq = await (await fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${w.lat}&lon=${w.lon}&appid=${WEATHER_API_KEY}`)).json();
        w.aqi = aq.list[0].main.aqi;
      } catch { }
      setWeather(w);
      try {
        const fc = await (await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${w.lat}&lon=${w.lon}&appid=${WEATHER_API_KEY}&units=metric&cnt=40`)).json();
        const byDay: Record<string, any[]> = {};
        fc.list.forEach((item: any) => { const date = item.dt_txt.split(" ")[0]; (byDay[date] ??= []).push(item); });
        const todayStr = new Date().toISOString().slice(0, 10);
        const futureDays = Object.entries(byDay).filter(([date]) => date > todayStr).slice(0, 3);
        setForecast(futureDays.map(([date, items]) => ({
          date,
          temp_min: Math.round(Math.min(...items.map((i: any) => i.main.temp_min))),
          temp_max: Math.round(Math.max(...items.map((i: any) => i.main.temp_max))),
          condition: items[Math.floor(items.length / 2)].weather[0].main,
          description: items[Math.floor(items.length / 2)].weather[0].description,
          icon: items[Math.floor(items.length / 2)].weather[0].icon,
          humidity: Math.round(items.reduce((a: number, i: any) => a + i.main.humidity, 0) / items.length),
        })));
      } catch { }
    } catch (e: any) { setWeatherErr(e.message || "Failed to fetch weather."); }
    finally { setFetching(false); }
  };

  // ── Simulate call ─────────────────────────────────────────
  // Returns null if the call would succeed, or a human-readable error string if it reverts.
  // MetaMask/different wallets put revert data in different places — we check all of them.
  const simulate = useCallback(async (from: string, to: string, data: string): Promise<string | null> => {
    try {
      await eth().request({ method: "eth_call", params: [{ from, to, data }, "latest"] });
      return null; // call succeeded
    } catch (e: any) {
      // Try every known location where wallets put revert data
      const revertData =
        e?.data ??
        e?.error?.data ??
        e?.cause?.data ??
        e?.info?.error?.data ??
        e?.info?.data ??
        null;

      if (revertData) {
        return decodeRevert(revertData);
      }

      // No revert data — use the message (e.g. "execution reverted: AlreadySubscribed")
      const msg: string = e?.message ?? e?.error?.message ?? "Simulation failed";
      // Strip MetaMask prefix noise if present
      const cleaned = msg.replace(/^.*execution reverted:?\s*/i, "").trim();
      return cleaned || "Transaction would fail (no revert reason given)";
    }
  }, [eth]);

  // ── Store weather on-chain ────────────────────────────────
  const submitToChain = async () => {
    if (!weather || !account) return;
    setTxStatus("approving"); setTxError(""); setTxHash(""); setTxStep("");

    try {
      const wJson = JSON.stringify({
        temp: weather.temp, feels_like: weather.feels_like, humidity: weather.humidity,
        condition: weather.condition, description: weather.description,
        wind: weather.wind, visibility: weather.visibility,
        country: weather.country, aqi: weather.aqi ?? null,
        fetched_at: new Date().toISOString(),
      });

      setTxStep("Checking USDC allowance…");
      const fee         = freeQueries > 0n ? 0n : queryFee;
      const allowance   = await readAllowance(account);
      const needApprove = allowance < fee + 1000n;

      if (needApprove) {
        const approveData = SEL.approve + padAddr(CONTRACT_ADDRESS) + pad64(APPROVE_AMOUNT);

        setTxStep("Checking approval will succeed…");
        const approveErr = await simulate(account, USDC_ADDRESS, approveData);
        if (approveErr) throw new Error(`USDC approval would fail: ${approveErr}`);

        setTxStep("Please approve USDC in your wallet (popup 1 of 2)…");
        let approveTx: string;
        try {
          approveTx = await eth().request({
            method: "eth_sendTransaction",
            params: [{ from: account, to: USDC_ADDRESS, data: approveData, gas: "0x" + (120_000).toString(16) }],
          });
        } catch (e: any) {
          if (e?.code === 4001 || e?.message?.includes("rejected") || e?.message?.includes("denied"))
            throw new Error("Approval cancelled by user.");
          throw e;
        }

        setTxStatus("confirming");
        setTxStep(`Waiting for approval confirmation on Arc…`);
        const ok = await waitForTx(approveTx, 240);
        if (!ok) throw new Error("USDC approval transaction reverted on-chain. Check your USDC balance and try again.");

        setTxStatus("confirmed_approve");
        setTxStep("Approval confirmed! Verifying allowance before query…");

        for (let i = 0; i < 8; i++) {
          await new Promise(r => setTimeout(r, 3000));
          const newAl = await readAllowance(account);
          console.log(`Allowance check ${i + 1}: ${newAl.toString()}`);
          if (newAl >= fee) break;
        }
      } else {
        setTxStatus("confirmed_approve");
        setTxStep("Allowance already sufficient — skipping approval…");
        await new Promise(r => setTimeout(r, 300));
      }

      const calldata = buildQueryCalldata(weather.city, wJson, note);
      setTxStep("Verifying query will succeed…");
      const queryErr = await simulate(account, CONTRACT_ADDRESS, calldata);
      if (queryErr) {
        throw new Error(`Query would fail: ${queryErr}`);
      }

      setTxStatus("signing");
      setTxStep(needApprove ? "Please confirm the weather query (popup 2 of 2)…" : "Please confirm the weather query in your wallet…");

      let queryTx: string;
      try {
        queryTx = await eth().request({
          method: "eth_sendTransaction",
          params: [{ from: account, to: CONTRACT_ADDRESS, data: calldata, gas: "0x" + (700_000).toString(16) }],
        });
      } catch (e: any) {
        if (e?.code === 4001 || e?.message?.includes("rejected") || e?.message?.includes("denied"))
          throw new Error("Transaction cancelled by user.");
        throw e;
      }

      setTxStatus("confirming");
      setTxStep(`Query submitted — waiting for Arc confirmation…`);
      const done = await waitForTx(queryTx, 240);
      if (!done) {
        const postErr = await simulate(account, CONTRACT_ADDRESS, calldata);
        throw new Error(postErr ?? "Transaction reverted on-chain. Please try again.");
      }

      setTxHash(queryTx);
      setTxStatus("done");
      setTxStep("");
      setNote("");
      dataLoadedRef.current = null;

      await new Promise(r => setTimeout(r, 3000));
      await loadChainData(account);
      await loadHistory(account);
      dataLoadedRef.current = account;

    } catch (e: any) {
      setTxStatus("error");
      setTxStep("");
      setTxError(e?.message || "Transaction failed.");
      console.error("submitToChain:", e);
    }
  };

  // ── Daily check-in ────────────────────────────────────────
  const doCheckIn = async () => {
    if (!account) return;
    setCheckingIn(true);
    try {
      const simErr = await simulate(account, CONTRACT_ADDRESS, SEL.checkIn);
      if (simErr) {
        const lower = simErr.toLowerCase();
        if (lower.includes("already") || lower.includes("today") || lower.includes("24"))
          throw new Error("You have already checked in today. Come back tomorrow!");
        throw new Error(simErr);
      }

      const tx = await eth().request({
        method: "eth_sendTransaction",
        params: [{ from: account, to: CONTRACT_ADDRESS, data: SEL.checkIn, gas: "0x" + (150_000).toString(16) }],
      });
      const ok = await waitForTx(tx, 120);
      if (!ok) {
        const postErr = await simulate(account, CONTRACT_ADDRESS, SEL.checkIn);
        throw new Error(postErr ?? "Check-in failed on-chain. Please try again.");
      }

      // Add a local history entry for the check-in
      const now = Math.floor(Date.now() / 1000);
      setHistory(prev => [{
        id: now, city: "Daily Check-in", querier: account,
        timestamp: now, weatherData: "", note: `Streak check-in — tx: ${tx.slice(0, 20)}…`,
        type: "checkin",
      }, ...prev]);

      dataLoadedRef.current = null;
      await loadChainData(account);
      dataLoadedRef.current = account;
      alert("✅ Check-in recorded on Arc! Streak updated.");
    } catch (e: any) {
      alert(e?.message ?? "Check-in failed. Please try again.");
    } finally { setCheckingIn(false); }
  };

  // ── Subscribe ─────────────────────────────────────────────
  const doSubscribe = async (plan: SubPlan) => {
    if (!account) return;
    setSubscribing(true);
    try {
      const subAmount   = plan === "monthly" ? 10_000_000 : 80_000_000;
      const approveData = SEL.approve + padAddr(CONTRACT_ADDRESS) + pad64(subAmount);
      const sel         = plan === "monthly" ? SEL.subscribeMonthly : SEL.subscribeYearly;

      // ── Step 1: Send USDC approval ────────────────────────
      // We approve exactly the subscription amount (10 or 80 USDC).
      // Do NOT simulate approve — it always passes, simulation is not needed here.
      let approveTx: string;
      try {
        approveTx = await eth().request({
          method: "eth_sendTransaction",
          params: [{ from: account, to: USDC_ADDRESS, data: approveData, gas: "0x" + (120_000).toString(16) }],
        });
      } catch (e: any) {
        if (e?.code === 4001) throw new Error("Approval cancelled.");
        throw e;
      }

      if (!await waitForTx(approveTx, 240))
        throw new Error("USDC approval failed on-chain. Check your USDC balance and try again.");

      // ── Step 2: Poll until Arc RPC reflects the new allowance ──
      // Arc testnet RPC can lag by 10–20s after a confirmed tx.
      // We MUST wait for real allowance before calling subscribe or it reverts with no message.
      let allowanceOk = false;
      for (let i = 0; i < 12; i++) {
        await new Promise(r => setTimeout(r, 3000)); // 3s between checks, up to 36s total
        const al = await readAllowance(account);
        console.log(`[subscribe] allowance check ${i + 1}: ${al.toString()} (need ${subAmount})`);
        if (al >= BigInt(subAmount)) { allowanceOk = true; break; }
      }
      if (!allowanceOk) throw new Error("Allowance not reflected by Arc RPC after 36s. Please try subscribing again — the approval is already done.");

      // ── Step 3: Send subscribe transaction ───────────────
      // Do NOT simulate subscribe before sending — eth_call does not carry
      // the real allowance state on Arc testnet and always shows a false revert.
      // Just send the tx directly; the allowance is confirmed above.
      let subTx: string;
      try {
        subTx = await eth().request({
          method: "eth_sendTransaction",
          params: [{ from: account, to: CONTRACT_ADDRESS, data: sel, gas: "0x" + (500_000).toString(16) }],
        });
      } catch (e: any) {
        if (e?.code === 4001) throw new Error("Subscription transaction cancelled.");
        throw e;
      }

      const ok = await waitForTx(subTx, 300);
      if (!ok) throw new Error("Subscription transaction reverted on-chain. Your USDC was not charged. Please try again.");

      setSubscribed(true);
      dataLoadedRef.current = null;
      await loadChainData(account);
      dataLoadedRef.current = account;
      alert(`✅ Subscribed (${plan === "monthly" ? "Monthly" : "Yearly"}) on Arc! Pro features are now unlocked.`);
    } catch (e: any) {
      alert(e?.message ?? "Subscription failed. Please try again.");
    } finally {
      setSubscribing(false);
    }
  };

  const deleteRecord = (id: number) => {
    setHistory(prev => prev.map(r => r.id === id ? { ...r, hidden: true } : r));
    setDeleteConfirm(null);
  };

  const streakReward = (n: bigint) => {
    if (n >= 30n) return { text: "👑 30-day legend! Free query credit earned every 30 days", color: "text-yellow-400" };
    if (n >= 7n)  return { text: "🔥 7-day streak! Fee now 0.008 USDC — 20% off",            color: "text-emerald-400" };
    if (n >= 3n)  return { text: "⭐ 3-day streak! Fee now 0.009 USDC — 10% off",             color: "text-sky-400" };
    return              { text: "Check in daily to unlock real on-chain fee discounts",        color: "text-gray-400" };
  };

  // ── Styles ────────────────────────────────────────────────
  const bg   = dark ? "bg-gray-950" : "bg-gray-50";
  const card = dark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200";
  const txt  = dark ? "text-gray-100" : "text-gray-900";
  const sub  = dark ? "text-gray-400" : "text-gray-500";
  const inp  = dark
    ? "bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500 focus:border-sky-500"
    : "bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-400 focus:border-sky-500";
  const btnP = "bg-sky-500 hover:bg-sky-400 active:scale-[0.98] text-white font-semibold transition-all rounded-xl px-5 py-2.5 text-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed";
  const btnG = dark
    ? "bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700 rounded-xl px-4 py-2 text-sm cursor-pointer transition-all"
    : "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 rounded-xl px-4 py-2 text-sm cursor-pointer transition-all";

  const txBusy   = ["approving","confirmed_approve","signing","confirming"].includes(txStatus);
  const visible  = history.filter(r => !r.hidden);
  const wRecs    = visible.filter(r => r.type === "weather");
  const allRecs  = visible; // includes check-ins

  // ─── RENDER ────────────────────────────────────────────────
  return (
    <div className={`min-h-screen ${bg} ${txt} font-sans transition-colors duration-300`}>

      {/* Delete confirm modal */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={() => setDeleteConfirm(null)}>
          <div className={`w-full max-w-xs rounded-2xl border p-6 space-y-4 ${dark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`} onClick={e => e.stopPropagation()}>
            <h2 className="font-bold">Remove from history?</h2>
            <p className={`text-sm ${sub}`}>This hides it locally only. The record stays on the Arc blockchain forever.</p>
            <div className="flex gap-3">
              <button onClick={() => deleteRecord(deleteConfirm)} className="flex-1 bg-red-500 hover:bg-red-400 text-white font-semibold rounded-xl py-2.5 text-sm cursor-pointer">Yes, remove</button>
              <button onClick={() => setDeleteConfirm(null)} className={`flex-1 ${btnG}`}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Wallet modal — now shows actual detected wallets */}
      {showWalletModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={() => setShowWalletModal(false)}>
          <div className={`w-full max-w-sm rounded-2xl border p-6 space-y-4 ${dark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg">Connect Wallet</h2>
              <button onClick={() => setShowWalletModal(false)} className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${dark ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}>✕</button>
            </div>
            <p className={`text-sm ${sub}`}>Choose your wallet to connect to ArcCast</p>

            {walletOptions.length === 0 ? (
              <div className={`rounded-xl p-4 text-sm text-center ${dark ? "bg-gray-800 text-gray-400" : "bg-gray-100 text-gray-500"}`}>
                <p className="font-semibold mb-1">No wallets detected</p>
                <p>Install MetaMask, Rabby, or another EVM wallet extension, then refresh the page.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {walletOptions.map(w => (
                  <button
                    key={w.id}
                    onClick={() => connectWithProvider(w.provider, w.name)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${dark ? "border-gray-700 hover:border-sky-500 hover:bg-gray-800" : "border-gray-200 hover:border-sky-400 hover:bg-sky-50"}`}
                  >
                    {/* Icon: EIP-6963 returns a data URL image; legacy uses emoji */}
                    {w.icon.startsWith("data:") ? (
                      <img src={w.icon} alt={w.name} className="w-8 h-8 rounded-lg flex-shrink-0 object-contain" />
                    ) : (
                      <span className="text-2xl flex-shrink-0">{w.icon}</span>
                    )}
                    <div className="min-w-0">
                      <p className="font-semibold text-sm">{w.name}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Network info — tells first-timers what network they're joining */}
            <div className={`rounded-xl p-3 space-y-2 text-xs ${dark ? "bg-gray-800 text-gray-300" : "bg-gray-50 border border-gray-200 text-gray-600"}`}>
              <p className="font-semibold text-sky-400 mb-1">🌐 Required Network: Arc Testnet</p>
              <div className="space-y-1">
                <div className="flex justify-between"><span className={sub}>Chain ID</span><span className="font-mono font-semibold">5042002</span></div>
                <div className="flex justify-between"><span className={sub}>RPC URL</span><span className="font-mono text-xs truncate max-w-[180px]">rpc.testnet.arc.network</span></div>
                <div className="flex justify-between"><span className={sub}>Currency</span><span className="font-mono font-semibold">USDC</span></div>
              </div>
              <p className={`text-xs mt-1 ${sub}`}>After connecting, your wallet will automatically prompt you to add this network.</p>
            </div>

            {/* Tip for Chrome cookie / locked wallet issue */}
            <div className={`rounded-xl p-3 text-xs border-l-4 border-amber-500 ${dark ? "bg-amber-900/20 text-amber-300" : "bg-amber-50 text-amber-700"}`}>
              <p className="font-semibold mb-1">⚠️ Wallet not appearing?</p>
              <p>Open your wallet extension, unlock it, then click Connect Wallet again.</p>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className={`sticky top-0 z-40 border-b ${dark ? "border-gray-800 bg-gray-950/95" : "border-gray-200 bg-white/95"} backdrop-blur-md`}>
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="w-8 h-8 relative flex-shrink-0">
              <Image src="/logo.png" alt="ArcCast" fill className="object-contain rounded-lg" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
            </div>
            <span className="text-xl font-bold tracking-tight">Arc<span className="text-sky-500">Cast</span></span>
          </div>
          <div className="hidden sm:flex items-center gap-1">
            {(["home","history","streak","subscribe"] as Tab[]).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all capitalize relative ${tab === t ? "bg-sky-500 text-white" : dark ? "text-gray-400 hover:text-gray-100 hover:bg-gray-800" : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"}`}>
                {t === "subscribe" ? "Pro ⚡" : t}
                {t === "subscribe" && !subscribed && <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full" />}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setDark(!dark)} className={`w-9 h-9 rounded-full flex items-center justify-center text-base transition-all ${dark ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-100 hover:bg-gray-200"}`}>{dark ? "☀️" : "🌙"}</button>
            {account ? (
              <div className="flex items-center gap-2">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm border ${dark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50"}`}>
                  <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
                  <span className={`${sub} font-mono text-xs`}>{truncate(account)}</span>
                  {chainOk && <span className="text-xs text-emerald-400 font-medium hidden sm:block">Arc</span>}
                </div>
                <button onClick={disconnectWallet} className={`text-xs px-2 py-1.5 rounded-lg transition-all ${dark ? "text-gray-500 hover:text-red-400 hover:bg-red-500/10" : "text-gray-400 hover:text-red-500 hover:bg-red-50"}`}>Disconnect</button>
              </div>
            ) : (
              <button onClick={() => setShowWalletModal(true)} className={btnP}>Connect Wallet</button>
            )}
          </div>
        </div>
        <div className={`sm:hidden flex border-t ${dark ? "border-gray-800" : "border-gray-200"}`}>
          {(["home","history","streak","subscribe"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2 text-xs font-medium capitalize ${tab === t ? "text-sky-500 border-b-2 border-sky-500" : sub}`}>
              {t === "subscribe" ? "Pro ⚡" : t}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {account && !chainOk && (
          <div className={`mb-6 rounded-2xl border-2 border-amber-500/50 overflow-hidden ${dark ? "bg-gray-900" : "bg-white"}`}>
            {/* Header row */}
            <div className="bg-amber-500/10 px-5 py-4 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <p className="font-bold text-amber-400 text-base leading-tight">Wrong Network</p>
                  <p className={`text-xs mt-0.5 ${sub}`}>ArcCast requires <span className="font-semibold text-amber-300">Arc Testnet</span> — click below to add it to your wallet automatically.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={async () => { await switchToArc(); }}
                className="flex-shrink-0 bg-amber-500 hover:bg-amber-400 active:scale-95 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all cursor-pointer"
              >
                🔗 Add Arc Network
              </button>
            </div>

            {/* Network details — shown so beginners can add manually too */}
            <div className="px-5 py-4 space-y-3">
              <p className={`text-xs font-semibold uppercase tracking-wide ${sub}`}>Network details — copy these if the automatic button fails</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { l: "Network Name",   v: "Arc Testnet" },
                  { l: "Chain ID",       v: "5042002" },
                  { l: "RPC URL",        v: "https://rpc.testnet.arc.network" },
                  { l: "Currency",       v: "USDC" },
                  { l: "Block Explorer", v: "https://testnet.arcscan.app" },
                ].map(({ l, v }) => (
                  <div key={l} className={`rounded-xl px-3 py-2.5 flex items-center justify-between gap-2 ${dark ? "bg-gray-800" : "bg-gray-50 border border-gray-200"}`}>
                    <div className="min-w-0">
                      <p className={`text-xs ${sub} leading-none mb-0.5`}>{l}</p>
                      <p className="text-sm font-mono font-semibold truncate">{v}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(v).then(() => alert(`Copied: ${v}`))}
                      className={`flex-shrink-0 text-xs px-2 py-1 rounded-lg transition-all cursor-pointer ${dark ? "bg-gray-700 hover:bg-gray-600 text-gray-300" : "bg-gray-200 hover:bg-gray-300 text-gray-600"}`}
                      title="Copy to clipboard"
                    >
                      📋
                    </button>
                  </div>
                ))}
              </div>
              <p className={`text-xs ${sub}`}>
                In MetaMask: click the network dropdown at the top → <span className="font-semibold">Add a network</span> → <span className="font-semibold">Add a network manually</span> → paste the values above.
              </p>
            </div>
          </div>
        )}

        {/* ══════ HOME ══════ */}
        {tab === "home" && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-3 leading-tight">Real weather,<br /><span className="text-sky-500">on-chain forever.</span></h1>
              <p className={`${sub} max-w-md mx-auto`}>Search any city. Sign on Arc. Weather stored permanently on-chain.</p>
            </div>

            {account && (
              <div className={`grid grid-cols-4 gap-3 p-4 rounded-2xl border ${card}`}>
                <div className="text-center"><p className="text-xl font-black text-sky-500">{totalQueries.toString()}</p><p className={`text-xs ${sub}`}>Total queries</p></div>
                <div className="text-center"><p className="text-xl font-black text-emerald-400">{(Number(usdcBalance) / 1_000_000).toFixed(2)}</p><p className={`text-xs ${sub}`}>USDC balance</p></div>
                <div className="text-center"><p className="text-xl font-black text-purple-400">{freeQueries.toString()}</p><p className={`text-xs ${sub}`}>Free queries</p></div>
                <div className="text-center"><p className={`text-xl font-black ${subscribed ? "text-amber-400" : "text-gray-400"}`}>{subscribed ? "PRO" : "FREE"}</p><p className={`text-xs ${sub}`}>Plan</p></div>
              </div>
            )}
            {account && queryFee < 10000n && (
              <div className="rounded-xl px-4 py-2 flex items-center gap-2 text-sm bg-emerald-500/10 border border-emerald-500/20">
                <span>🔥</span><span className="text-emerald-400 font-medium">Streak discount active! Fee: {(Number(queryFee) / 1_000_000).toFixed(4)} USDC</span>
              </div>
            )}
            {account && freeQueries > 0n && (
              <div className="rounded-xl px-4 py-2 flex items-center gap-2 text-sm bg-purple-500/10 border border-purple-500/20">
                <span>🎁</span><span className="text-purple-400 font-medium">You have {freeQueries.toString()} free {freeQueries === 1n ? "query" : "queries"} — next search is free!</span>
              </div>
            )}

            <div className={`rounded-2xl border p-6 space-y-4 ${card}`}>
              <h2 className="font-semibold">Search any city or country</h2>
              <div className="flex gap-2">
                <input type="text" value={city} onChange={e => setCity(e.target.value)} onKeyDown={e => e.key === "Enter" && fetchWeather()}
                  placeholder="Lagos, Japan, South Korea, London…"
                  className={`flex-1 rounded-xl px-4 py-3 text-sm border outline-none transition-all ${inp}`} />
                <button onClick={fetchWeather} disabled={fetching || !city.trim()} className={btnP}>
                  {fetching ? <span className="flex items-center gap-2"><span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />Fetching…</span> : "Search"}
                </button>
              </div>
              {weatherErr && <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">{weatherErr}</p>}
              {cityWarning && <p className={`text-sm rounded-xl px-4 py-2 ${dark ? "bg-sky-500/10 border border-sky-500/20 text-sky-400" : "bg-sky-50 border border-sky-200 text-sky-700"}`}>ℹ️ {cityWarning}</p>}
            </div>

            {weather && (
              <div className={`rounded-2xl overflow-hidden border ${dark ? "border-gray-700" : "border-gray-200"}`}>
                <div className={`bg-gradient-to-br ${weatherBg(weather.condition, dark)} p-6`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-3xl font-extrabold">{weather.city}<span className={`text-base font-normal ml-2 ${sub}`}>{countryName(weather.country)}</span></h2>
                      <p className={`capitalize mt-1 text-sm ${sub}`}>{weather.description}</p>
                    </div>
                    <img src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} alt={weather.condition} className="w-16 h-16 flex-shrink-0" />
                  </div>
                  <div className="mt-3 flex items-end gap-2">
                    <span className="text-6xl font-black leading-none">{weather.temp}°</span>
                    <span className={`text-lg mb-1 ${sub}`}>C</span>
                    <span className={`text-sm mb-1 ${sub}`}>· Feels like {weather.feels_like}°C</span>
                  </div>
                </div>
                <div className={`grid grid-cols-4 gap-px ${dark ? "bg-gray-800" : "bg-gray-100"}`}>
                  {[
                    { l: "Humidity",    v: `${weather.humidity}%` },
                    { l: "Wind",        v: `${weather.wind} km/h` },
                    { l: "Visibility",  v: `${weather.visibility} km` },
                    { l: "Air Quality", v: weather.aqi ? aqiInfo(weather.aqi).label : "N/A", color: weather.aqi ? aqiInfo(weather.aqi).color : sub },
                  ].map(s => (
                    <div key={s.l} className={`p-4 text-center ${dark ? "bg-gray-900" : "bg-white"}`}>
                      <p className={`text-lg font-bold ${"color" in s ? s.color : ""}`}>{s.v}</p>
                      <p className={`text-xs mt-0.5 ${sub}`}>{s.l}</p>
                    </div>
                  ))}
                </div>
                <div className={`p-6 space-y-4 ${dark ? "bg-gray-900" : "bg-white"}`}>
                  {weather.cityDescription && (
                    <div className={`rounded-xl p-4 border-l-4 border-sky-500 ${dark ? "bg-gray-800" : "bg-sky-50"}`}>
                      <p className="text-xs font-semibold uppercase tracking-wide mb-1 text-sky-500">About this location</p>
                      <p className={`text-sm leading-relaxed ${sub}`}>{weather.cityDescription}</p>
                    </div>
                  )}
                  {subscribed && forecast.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide mb-3 text-sky-500">3-Day Forecast</p>
                      <div className="grid grid-cols-3 gap-2">
                        {forecast.map(day => (
                          <div key={day.date} className={`rounded-xl p-3 text-center ${dark ? "bg-gray-800" : "bg-gray-50"}`}>
                            <p className={`text-xs font-semibold ${sub}`}>{new Date(day.date).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}</p>
                            <img src={`https://openweathermap.org/img/wn/${day.icon}.png`} alt={day.condition} className="w-10 h-10 mx-auto" />
                            <p className="text-sm font-bold">{day.temp_max}° <span className={`font-normal ${sub}`}>{day.temp_min}°</span></p>
                            <p className={`text-xs capitalize ${sub}`}>{day.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {!subscribed && forecast.length > 0 && (
                    <div className={`rounded-xl p-4 border border-dashed flex items-center justify-between gap-3 ${dark ? "border-gray-600 bg-gray-800/50" : "border-gray-300 bg-gray-50"}`}>
                      <div><p className="text-sm font-semibold">🔒 3-Day Forecast available</p><p className={`text-xs ${sub} mt-0.5`}>Upgrade to Pro to unlock</p></div>
                      <button onClick={() => setTab("subscribe")} className={`${btnP} text-xs px-3 py-1.5 flex-shrink-0`}>Unlock Pro</button>
                    </div>
                  )}
                  <div>
                    <label className={`block text-xs font-medium mb-2 ${sub}`}>Your personal note (stored on-chain)</label>
                    <textarea value={note} onChange={e => setNote(e.target.value)}
                      placeholder={`e.g. Planning to visit ${weather.city} in June…`}
                      rows={2} className={`w-full rounded-xl px-4 py-3 text-sm border outline-none resize-none transition-all ${inp}`} />
                  </div>
                  {!account ? (
                    <button onClick={() => setShowWalletModal(true)} className={`w-full ${btnP} py-3`}>Connect Wallet to Store on Arc</button>
                  ) : (
                    <button onClick={submitToChain} disabled={txBusy} className={`w-full ${btnP} py-3`}>
                      {txStatus === "approving"         && "Checking allowance…"}
                      {txStatus === "confirmed_approve" && "Preparing query…"}
                      {txStatus === "signing"           && "Confirm in your wallet…"}
                      {txStatus === "confirming"        && "Waiting for Arc confirmation…"}
                      {(txStatus === "idle" || txStatus === "done") && `Store on Arc (${freeQueries > 0n ? "FREE — using credit" : (Number(queryFee) / 1_000_000).toFixed(4) + " USDC"})`}
                      {txStatus === "error"             && "Transaction failed — Retry"}
                    </button>
                  )}
                  {txBusy && txStep && (
                    <div className={`rounded-xl px-4 py-3 flex items-center gap-3 ${dark ? "bg-gray-800" : "bg-gray-100"}`}>
                      <span className="w-3 h-3 border-2 border-sky-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                      <p className={`text-xs ${sub}`}>{txStep}</p>
                    </div>
                  )}
                  {txStatus === "done" && txHash && (
                    <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3 space-y-1">
                      <p className="text-sm font-semibold text-emerald-400">✅ Stored on Arc Testnet!</p>
                      <p className={`text-xs ${sub}`}>Tx: {truncate(txHash)}</p>
                      <p className={`text-xs ${sub}`}>{weather.city} weather + your note are permanently on-chain.</p>
                    </div>
                  )}
                  {txStatus === "error" && txError && (
                    <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">{txError}</div>
                  )}
                  <p className={`text-xs ${sub}`}>
                    {freeQueries > 0n
                      ? "This query is free — using your free credit."
                      : "First use: 2 wallet popups (approve USDC once, then store). Every query after that is just 1 popup."}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══════ HISTORY ══════ */}
        {tab === "history" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Activity history</h2>
                <p className={`text-sm ${sub}`}>{subscribed ? "All activity — Pro" : "Last 5 entries — upgrade Pro to see all"}</p>
              </div>
              <button
                onClick={() => { if (account) { dataLoadedRef.current = null; loadHistory(account); } }}
                className={btnG}
              >
                ↻ Refresh
              </button>
            </div>

            {!account ? (
              <div className={`rounded-2xl border p-8 text-center ${card}`}>
                <p className="text-3xl mb-3">🔗</p>
                <p className={sub}>Connect your wallet to see history.</p>
                <button onClick={() => setShowWalletModal(true)} className={`mt-4 ${btnP}`}>Connect Wallet</button>
              </div>
            ) : loadingHistory ? (
              <div className={`rounded-2xl border p-12 text-center ${card}`}>
                <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className={`font-medium ${sub}`}>Loading your on-chain history…</p>
                <p className={`text-xs ${sub} mt-1`}>Fetching records from Arc Testnet, this may take a moment.</p>
              </div>
            ) : allRecs.length === 0 ? (
              <div className={`rounded-2xl border p-8 text-center ${card}`}>
                <p className="text-3xl mb-3">📭</p>
                <p className={`font-medium mb-1 ${txt}`}>No activity yet</p>
                <p className={`text-sm ${sub}`}>Search a city on Home and store it on-chain, or do a daily check-in on the Streak tab.</p>
                <div className="flex gap-3 justify-center mt-4">
                  <button onClick={() => setTab("home")} className={btnP}>Search Weather</button>
                  <button onClick={() => setTab("streak")} className={btnG}>Daily Check-in</button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Show all records (weather + checkins), limited to 5 for free users */}
                {(subscribed ? allRecs : allRecs.slice(0, 5)).map((r, i) => {
                  if (r.type === "checkin") {
                    return (
                      <div key={`ci-${r.id}-${i}`} className={`rounded-2xl border p-4 flex items-center justify-between gap-3 ${card}`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${dark ? "bg-emerald-500/10" : "bg-emerald-50"}`}>✅</div>
                          <div>
                            <p className="font-semibold text-sm text-emerald-400">Daily Check-in</p>
                            <p className={`text-xs ${sub}`}>{formatTime(r.timestamp)}</p>
                            {r.note && <p className={`text-xs ${sub} mt-0.5 italic`}>{r.note}</p>}
                          </div>
                        </div>
                        <button onClick={() => setDeleteConfirm(r.id)} className={`text-xs px-2 py-1 rounded-lg flex-shrink-0 ${dark ? "text-gray-600 hover:text-red-400 hover:bg-red-500/10" : "text-gray-400 hover:text-red-500 hover:bg-red-50"}`}>✕</button>
                      </div>
                    );
                  }

                  let p: any = {};
                  try { p = JSON.parse(r.weatherData); } catch { }
                  return (
                    <div key={`wr-${r.id}-${i}`} className={`rounded-2xl border p-5 space-y-3 ${card}`}>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-bold text-lg capitalize">{r.city}</p>
                          <p className={`text-xs ${sub}`}>{formatTime(r.timestamp)}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {p.temp !== undefined && <span className="text-2xl font-black text-sky-500">{p.temp}°C</span>}
                          <button onClick={() => setDeleteConfirm(r.id)} className={`text-xs px-2 py-1 rounded-lg ${dark ? "text-gray-600 hover:text-red-400 hover:bg-red-500/10" : "text-gray-400 hover:text-red-500 hover:bg-red-50"}`}>✕</button>
                        </div>
                      </div>
                      {p.condition && (
                        <div className="flex flex-wrap gap-2">
                          <span className={`text-sm capitalize ${sub}`}>{p.description}</span>
                          <span className={`text-sm ${sub}`}>· {p.humidity}% humidity</span>
                          <span className={`text-sm ${sub}`}>· {p.wind} km/h wind</span>
                          {p.visibility !== undefined && <span className={`text-sm ${sub}`}>· {p.visibility} km visibility</span>}
                        </div>
                      )}
                      {p.aqi && (
                        <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${aqiInfo(p.aqi).color} ${aqiInfo(p.aqi).bg}`}>
                          AQI: {aqiInfo(p.aqi).label}
                        </span>
                      )}
                      {r.note && (
                        <div className={`rounded-lg px-3 py-2 text-sm italic border-l-2 border-sky-500 ${dark ? "bg-gray-800 text-gray-300" : "bg-gray-50 text-gray-600"}`}>
                          "{r.note}"
                        </div>
                      )}
                      <p className={`text-xs ${sub} font-mono`}>by {truncate(r.querier)} · Record #{r.id}</p>
                    </div>
                  );
                })}

                {!subscribed && allRecs.length > 5 && (
                  <div className={`rounded-2xl border border-dashed p-6 text-center ${dark ? "border-gray-600" : "border-gray-300"}`}>
                    <p className={`text-sm ${sub} mb-3`}>{allRecs.length - 5} more {allRecs.length - 5 === 1 ? "record" : "records"} hidden — upgrade to Pro to see all</p>
                    <button onClick={() => setTab("subscribe")} className={btnP}>Upgrade to Pro</button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ══════ STREAK ══════ */}
        {tab === "streak" && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold">Daily streak</h2>
              <p className={`text-sm ${sub}`}>Check in every day to keep your streak alive</p>
            </div>

            {!account ? (
              <div className={`rounded-2xl border p-8 text-center ${card}`}>
                <p className="text-3xl mb-3">🔥</p>
                <p className={sub}>Connect wallet to track your streak.</p>
                <button onClick={() => setShowWalletModal(true)} className={`mt-4 ${btnP}`}>Connect Wallet</button>
              </div>
            ) : (
              <>
                {streak !== null && streakDisplay.streakBroken && streak.lastCheckIn > 0n && (
                  <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-4 flex items-start gap-3">
                    <span className="text-xl flex-shrink-0">💔</span>
                    <div>
                      <p className="font-semibold text-red-400">Your streak was reset</p>
                      <p className={`text-xs ${sub} mt-0.5`}>
                        Last check-in was {streak ? new Date(Number(streak.lastCheckIn) * 1000).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" }) : ""}. You missed a day so your streak restarted.
                      </p>
                      <p className="text-xs text-red-400 mt-1">Check in today to start a new streak!</p>
                    </div>
                  </div>
                )}

                {streakDisplay.checkedInToday && (
                  <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-4 flex items-start gap-3">
                    <span className="text-xl flex-shrink-0">✅</span>
                    <div>
                      <p className="font-semibold text-emerald-400">Checked in today!</p>
                      <p className={`text-xs ${sub} mt-0.5`}>Come back tomorrow to keep your streak going.</p>
                    </div>
                  </div>
                )}

                <div className={`rounded-2xl border p-6 text-center space-y-4 ${card}`}>
                  <div>
                    <p className="text-7xl font-black text-sky-500 leading-none">
                      {streak === null ? "—" : streakDisplay.displayCount.toString()}
                    </p>
                    <p className={`text-sm mt-1 ${sub}`}>
                      {streak === null
                        ? "Loading…"
                        : streakDisplay.displayCount === 0n
                          ? "No streak yet — check in to start!"
                          : "day streak"}
                    </p>
                  </div>

                  {streak !== null && streakDisplay.displayCount > 0n && (
                    <p className={`text-sm font-medium ${streakReward(streakDisplay.displayCount).color}`}>
                      {streakReward(streakDisplay.displayCount).text}
                    </p>
                  )}

                  {/* ── Always-visible countdown to next check-in window ── */}
                  <div className={`rounded-2xl p-4 space-y-2 ${dark ? "bg-gray-800" : "bg-gray-100"}`}>
                    <p className={`text-xs font-semibold uppercase tracking-wide ${sub}`}>
                      {streakDisplay.checkedInToday ? "Next check-in available in" : "Check-in window resets in"}
                    </p>
                    <div className="flex items-center justify-center gap-3">
                      {[
                        { v: countdown.h, l: "Hours"   },
                        { v: countdown.m, l: "Minutes" },
                        { v: countdown.s, l: "Seconds" },
                      ].map(({ v, l }) => (
                        <div key={l} className={`flex flex-col items-center rounded-xl px-4 py-2 min-w-[64px] ${dark ? "bg-gray-900" : "bg-white"}`}>
                          <span className="text-2xl font-black text-sky-500 tabular-nums leading-none">
                            {String(v).padStart(2, "0")}
                          </span>
                          <span className={`text-xs mt-1 ${sub}`}>{l}</span>
                        </div>
                      ))}
                    </div>
                    {streakDisplay.checkedInToday ? (
                      <p className={`text-xs ${sub}`}>You're all set for today — see you tomorrow! 🎉</p>
                    ) : (
                      <p className={`text-xs font-medium ${
                        countdown.total < 3600
                          ? "text-amber-400"
                          : streakDisplay.streakBroken && streak && streak.lastCheckIn > 0n
                            ? "text-red-400"
                            : "text-sky-400"
                      }`}>
                        {countdown.total < 3600
                          ? "⚠️ Less than 1 hour left — check in now to keep your streak!"
                          : streakDisplay.streakBroken && streak && streak.lastCheckIn > 0n
                            ? "Streak broken — check in today to restart"
                            : "Check in before midnight UTC to keep your streak"}
                      </p>
                    )}
                  </div>

                  {!streakDisplay.checkedInToday && streak !== null && (
                    <div className={`rounded-xl px-4 py-2 text-sm font-medium ${
                      streakDisplay.streakBroken && streak.lastCheckIn > 0n
                        ? "bg-red-500/10 text-red-400 border border-red-500/20"
                        : "bg-sky-500/10 text-sky-400 border border-sky-500/20"
                    }`}>
                      {streakDisplay.streakBroken && streak.lastCheckIn > 0n
                        ? "⚠️ Streak broken — check in now to restart at 1"
                        : streak.lastCheckIn === 0n
                          ? "You haven't checked in yet — tap below to start!"
                          : "👆 Check in today to keep your streak!"}
                    </div>
                  )}

                  <button onClick={doCheckIn} disabled={checkingIn || streakDisplay.checkedInToday} className={`${btnP} px-12`}>
                    {checkingIn
                      ? <span className="flex items-center gap-2 justify-center"><span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />Checking in…</span>
                      : streakDisplay.checkedInToday
                        ? "Already checked in today ✓"
                        : "Check in today"}
                  </button>

                  <div className={`grid grid-cols-3 gap-3 pt-2 border-t ${dark ? "border-gray-800" : "border-gray-100"}`}>
                    <div className="text-center">
                      <p className="text-xl font-black text-sky-500">{streakDisplay.displayCount.toString()}</p>
                      <p className={`text-xs ${sub}`}>Current streak</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-black text-emerald-400">{streak ? streak.totalCheckIns.toString() : "0"}</p>
                      <p className={`text-xs ${sub}`}>Total check-ins</p>
                    </div>
                    <div className="text-center">
                      <p className={`text-sm font-black ${streak && streak.lastCheckIn > 0n ? "text-purple-400" : "text-gray-500"}`}>
                        {streak && streak.lastCheckIn > 0n
                          ? new Date(Number(streak.lastCheckIn) * 1000).toLocaleDateString("en-GB", { day: "numeric", month: "short" })
                          : "Never"}
                      </p>
                      <p className={`text-xs ${sub}`}>Last check-in</p>
                    </div>
                  </div>
                  <p className={`text-xs ${sub}`}>Once per day · Gas only · No USDC needed</p>
                </div>

                <div className={`rounded-2xl border p-5 ${card}`}>
                  <h3 className="font-semibold mb-4">On-chain milestone rewards</h3>
                  <div className="space-y-3">
                    {[
                      { days: 3,  icon: "⭐", reward: "Query fee drops to 0.009 USDC — 10% discount" },
                      { days: 7,  icon: "🔥", reward: "Query fee drops to 0.008 USDC — 20% discount" },
                      { days: 30, icon: "👑", reward: "1 free query credit added to your wallet"      },
                    ].map(m => {
                      const reached  = streakDisplay.displayCount >= BigInt(m.days);
                      const daysLeft = Math.max(0, m.days - Number(streakDisplay.displayCount));
                      return (
                        <div key={m.days} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${reached ? dark ? "bg-emerald-500/10 border border-emerald-500/20" : "bg-emerald-50 border border-emerald-200" : dark ? "bg-gray-800" : "bg-gray-50"}`}>
                          <span className="text-2xl flex-shrink-0">{m.icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-semibold ${reached ? "text-emerald-400" : ""}`}>{m.days}-day streak</p>
                            <p className={`text-xs ${sub} truncate`}>{m.reward}</p>
                          </div>
                          {reached
                            ? <span className="text-emerald-400 text-xs font-bold flex-shrink-0 bg-emerald-500/10 px-2 py-1 rounded-lg">ACTIVE ✓</span>
                            : <span className={`text-xs flex-shrink-0 ${sub}`}>{daysLeft} day{daysLeft !== 1 ? "s" : ""} to go</span>}
                        </div>
                      );
                    })}
                  </div>
                  <p className={`text-xs ${sub} mt-4 p-3 rounded-xl ${dark ? "bg-gray-800" : "bg-gray-100"}`}>
                    Discounts are enforced by the Arc smart contract automatically — no claim needed.
                  </p>
                </div>

                <div className={`rounded-2xl border p-5 ${card}`}>
                  <h3 className="font-semibold mb-3">Your stats</h3>
                  <div className="space-y-0">
                    {[
                      { l: "Current streak",  v: streakDisplay.displayCount.toString() + " days" },
                      { l: "Total check-ins", v: (streak?.totalCheckIns ?? 0n).toString() },
                      { l: "Queries made",    v: leaderScore.toString() + " total" },
                      { l: "Free credits",    v: freeQueries.toString() + " available", color: freeQueries > 0n ? "text-purple-400" : "" },
                      { l: "Current fee",     v: (Number(queryFee) / 1_000_000).toFixed(4) + " USDC", color: queryFee < 10000n ? "text-emerald-400" : "" },
                      { l: "Wallet",          v: account ? truncate(account) : "—", mono: true },
                      { l: "Network",         v: "Arc Testnet", color: "text-emerald-400" },
                      { l: "Plan",            v: subscribed ? "Pro (active)" : "Free", color: subscribed ? "text-amber-400" : "" },
                    ].map(s => (
                      <div key={s.l} className={`flex justify-between items-center text-sm py-2.5 border-b last:border-0 ${dark ? "border-gray-800" : "border-gray-100"}`}>
                        <span className={sub}>{s.l}</span>
                        <span className={`font-medium ${"mono" in s && s.mono ? "font-mono text-xs" : ""} ${"color" in s && s.color ? s.color : ""}`}>{s.v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ══════ PRO ══════ */}
        {tab === "subscribe" && (
          <div className="space-y-4">
            <div><h2 className="text-xl font-bold">ArcCast Pro</h2><p className={`text-sm ${sub}`}>Unlock the full ArcCast experience</p></div>
            {subscribed && (
              <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-5 flex items-center gap-4">
                <span className="text-3xl">✅</span>
                <div>
                  <p className="font-bold text-emerald-400">You are on Pro!</p>
                  <p className={`text-sm ${sub} mt-0.5`}>Expires: {subExpiry > 0 ? new Date(subExpiry * 1000).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "N/A"}</p>
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Free */}
              <div className={`rounded-2xl border p-5 space-y-4 ${card}`}>
                <div><p className="font-bold text-sm text-gray-400">Free</p><p className="text-3xl font-black mt-1">0</p><p className={`text-xs ${sub}`}>USDC forever</p></div>
                <div className="space-y-2 text-xs">
                  {[["Weather for any city",true],["Air quality index",true],["City descriptions",true],["0.01 USDC per query",true],["Last 5 history entries",true],["Daily streak rewards",true],["3-day forecast",false],["Full history",false]].map(([t,ok]) => (
                    <div key={t as string} className="flex items-start gap-2">
                      <span className={`flex-shrink-0 ${ok ? "text-emerald-400" : "text-gray-600"}`}>{ok ? "✓" : "✗"}</span>
                      <span className={ok ? "" : `${sub} line-through`}>{t as string}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Monthly */}
              <div className={`rounded-2xl border-2 border-sky-500 p-5 space-y-4 relative ${dark ? "bg-gray-900" : "bg-white"}`}>
                <div className="absolute top-3 right-3 bg-sky-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">POPULAR</div>
                <div><p className="font-bold text-sm text-sky-500">Pro Monthly</p><p className="text-3xl font-black mt-1">10</p><p className={`text-xs ${sub}`}>USDC / 30 days</p></div>
                <div className="space-y-2 text-xs">
                  {["Everything in Free","3-day forecast","Full history","2 bonus free queries"].map(f => (
                    <div key={f} className="flex items-start gap-2"><span className="text-sky-400 flex-shrink-0">✓</span><span>{f}</span></div>
                  ))}
                </div>
                {!account ? <button onClick={() => setShowWalletModal(true)} className={`w-full ${btnP} py-2.5`}>Connect Wallet</button>
                  : subscribed ? <div className={`text-center text-xs ${sub} py-2`}>Already subscribed ✓</div>
                  : <button onClick={() => doSubscribe("monthly")} disabled={subscribing} className={`w-full ${btnP} py-2.5`}>
                    {subscribing ? <span className="flex items-center justify-center gap-2"><span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />Processing…</span> : "Subscribe — 10 USDC"}
                  </button>}
              </div>
              {/* Yearly */}
              <div className={`rounded-2xl border p-5 space-y-4 relative ${dark ? "bg-gray-900 border-amber-500/30" : "bg-white border-amber-300"}`}>
                <div className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">SAVE 33%</div>
                <div><p className="font-bold text-sm text-amber-400">Pro Yearly</p><p className="text-3xl font-black mt-1">80</p><p className={`text-xs ${sub}`}>USDC / 365 days</p><p className="text-xs text-amber-400 mt-1">vs 120 USDC monthly</p></div>
                <div className="space-y-2 text-xs">
                  {["Everything in Pro Monthly","5 bonus free queries","365 days uninterrupted"].map(f => (
                    <div key={f} className="flex items-start gap-2"><span className="text-amber-400 flex-shrink-0">✓</span><span>{f}</span></div>
                  ))}
                </div>
                {!account ? <button onClick={() => setShowWalletModal(true)} className={`w-full ${btnP} py-2.5`}>Connect Wallet</button>
                  : subscribed ? <div className={`text-center text-xs ${sub} py-2`}>Already subscribed ✓</div>
                  : <button onClick={() => doSubscribe("yearly")} disabled={subscribing}
                    className="w-full bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-white font-semibold transition-all rounded-xl px-5 py-2.5 text-sm cursor-pointer disabled:opacity-40">
                    {subscribing ? <span className="flex items-center justify-center gap-2"><span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />Processing…</span> : "Subscribe — 80 USDC"}
                  </button>}
              </div>
            </div>
            <p className={`text-xs text-center ${sub}`}>Subscriptions recorded on-chain on Arc Testnet. Renewing extends your current period.</p>
          </div>
        )}
      </main>

      <footer className={`border-t mt-16 py-8 ${dark ? "border-gray-800" : "border-gray-200"}`}>
        <div className="max-w-5xl mx-auto px-4 space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sky-500">ArcCast</span>
              <span className={sub}>·</span>
              <span className={`text-xs ${sub}`}>Real weather, on-chain forever</span>
            </div>
            <div className={`flex items-center gap-3 text-xs ${sub}`}>
              <span>Contract: {truncate(CONTRACT_ADDRESS)}</span>
              <span>·</span>
              <span>Arc Testnet · Chain {ARC_CHAIN_ID}</span>
            </div>
          </div>
          <div className={`text-center text-xs ${sub} border-t pt-3 ${dark ? "border-gray-800" : "border-gray-200"}`}>
            © {new Date().getFullYear()} Beauty Benedict. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}