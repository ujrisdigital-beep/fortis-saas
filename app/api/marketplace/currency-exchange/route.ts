import { NextRequest, NextResponse } from "next/server";

const DEMO_LISTINGS = [
  { id: "fx1", operator: "Gambia Forex Bureau", fromCurrency: "GMD", toCurrency: "USD", buyRate: 68.5, sellRate: 71.0, minAmount: 1000, maxAmount: 500000, kycVerified: true, rating: 4.8, location: "Banjul Independence Drive", phone: "2203001234" },
  { id: "fx2", operator: "Atlantic Exchange", fromCurrency: "GMD", toCurrency: "GBP", buyRate: 83.0, sellRate: 87.0, minAmount: 2000, maxAmount: 1000000, kycVerified: true, rating: 4.6, location: "Senegambia Strip, Kololi", phone: "2203002345" },
  { id: "fx3", operator: "Euro Africa Forex", fromCurrency: "GMD", toCurrency: "EUR", buyRate: 73.5, sellRate: 76.5, minAmount: 1000, maxAmount: 750000, kycVerified: true, rating: 4.7, location: "Kairaba Avenue, KMC", phone: "2203003456" },
  { id: "fx4", operator: "Trust Bureau de Change", fromCurrency: "GMD", toCurrency: "USD", buyRate: 67.0, sellRate: 72.5, minAmount: 500, maxAmount: 200000, kycVerified: false, rating: 4.2, location: "Serrekunda Market", phone: "2203004567" },
  { id: "fx5", operator: "Premier Forex", fromCurrency: "GMD", toCurrency: "GBP", buyRate: 84.0, sellRate: 86.0, minAmount: 5000, maxAmount: 2000000, kycVerified: true, rating: 4.9, location: "Bertil Harding Highway", phone: "2203005678" },
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const toCurrency = searchParams.get("toCurrency");

  let listings = DEMO_LISTINGS;
  if (toCurrency) listings = listings.filter((l) => l.toCurrency === toCurrency);

  // Sort by best sell rate (lowest spread = better deal)
  listings.sort((a, b) => a.sellRate - b.sellRate);

  return NextResponse.json({ listings, commission: 0.005, updatedAt: new Date().toISOString() });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { operatorId, fromCurrency, toCurrency, amount, direction } = body;

  if (!operatorId || !fromCurrency || !toCurrency || !amount) {
    return NextResponse.json({ error: "operatorId, fromCurrency, toCurrency, amount required" }, { status: 400 });
  }

  const operator = DEMO_LISTINGS.find((l) => l.id === operatorId);
  if (!operator) return NextResponse.json({ error: "Operator not found" }, { status: 404 });

  const rate = direction === "buy" ? operator.buyRate : operator.sellRate;
  const commission = amount * 0.005;
  const converted = direction === "buy" ? amount / rate : amount * rate;
  const transactionId = `FX-${Date.now()}`;

  return NextResponse.json({
    transactionId,
    fromAmount: amount,
    fromCurrency,
    toAmount: Math.round(converted * 100) / 100,
    toCurrency,
    rate,
    commission: Math.round(commission),
    net: Math.round(converted - commission),
    operator: operator.operator,
    status: "pending_kyc",
    message: "Transaction initiated. Present this reference to the operator.",
    createdAt: new Date().toISOString(),
  }, { status: 201 });
}
