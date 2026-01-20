import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    totalOrdersToday: 42,
    lowStockProducts: 5,
  });
}
