"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

type Summary = {
  totalOrdersToday: number;
  lowStockProducts: number;
};

type ChartData = { date: string; revenue: number };

export default function Home() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    // TODO: replace with real backend API
    fetch("/api/dashboard/summary")
      .then(res => res.json())
      .then(setSummary);

    fetch("/api/dashboard/revenue7days")
      .then(res => res.json())
      .then(setChartData);
  }, []);

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Tổng đơn hôm nay</h2>
          <p className="text-4xl mt-2">{summary?.totalOrdersToday ?? "-"}</p>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Sản phẩm sắp hết hàng</h2>
          <p className="text-4xl mt-2">{summary?.lowStockProducts ?? "-"}</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Doanh thu 7 ngày</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" stroke="#3b82f6" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
