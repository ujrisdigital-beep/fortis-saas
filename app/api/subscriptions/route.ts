import { NextRequest, NextResponse } from "next/server";

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    priceGMD: 3430,
    priceUSD: 49,
    period: "monthly",
    features: ["10 UJU Cycle analyses/mo", "5 Ikenga assessments/mo", "3 Ask UJRIS reviews/mo", "5 grant applications", "Email support"],
  },
  {
    id: "professional",
    name: "Professional",
    priceGMD: 6930,
    priceUSD: 99,
    period: "monthly",
    features: ["Unlimited UJU Cycle", "Unlimited Ikenga", "20 Ask UJRIS reviews/mo", "Unlimited grants", "API access (1000 calls/mo)", "Priority support"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    priceGMD: 13930,
    priceUSD: 199,
    period: "monthly",
    features: ["Everything in Professional", "Unlimited Ask UJRIS", "Unlimited API", "Dedicated manager", "Custom prompts", "SLA 2hr"],
  },
];

export async function GET() {
  return NextResponse.json({ plans: PLANS });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { planId, userId, paymentMethod, currency = "GMD", billing = "monthly" } = body;

  if (!planId || !userId) {
    return NextResponse.json({ error: "planId and userId required" }, { status: 400 });
  }

  const plan = PLANS.find((p) => p.id === planId);
  if (!plan) return NextResponse.json({ error: "Plan not found" }, { status: 404 });

  const price = billing === "annual"
    ? Math.round((currency === "USD" ? plan.priceUSD : plan.priceGMD) * 10 * 0.8)
    : (currency === "USD" ? plan.priceUSD : plan.priceGMD);

  const subscription = {
    id: `SUB-${Date.now()}`,
    planId, userId, paymentMethod,
    currency, billing, price,
    status: "active",
    startDate: new Date().toISOString(),
    nextBillingDate: billing === "annual"
      ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    plan,
  };

  return NextResponse.json({ subscription, message: "Subscription activated" }, { status: 201 });
}
