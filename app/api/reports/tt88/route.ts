import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");

  return NextResponse.json([
    { date: from, revenue: 10000, orders: 10 },
    { date: to, revenue: 15000, orders: 12 },
  ]);
}
