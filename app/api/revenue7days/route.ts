import { NextResponse } from "next/server";

export async function GET() {
  const data = [
    { date: "2025-01-01", revenue: 1000 },
    { date: "2025-01-02", revenue: 1200 },
    { date: "2025-01-03", revenue: 900 },
    // …
  ];
  return NextResponse.json(data);
}
