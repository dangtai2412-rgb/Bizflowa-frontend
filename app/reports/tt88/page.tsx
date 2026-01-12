"use client";

import { useState } from "react";

type ReportRow = {
  date: string;
  revenue: number;
  orders: number;
};

export default function ReportTT88() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [report, setReport] = useState<ReportRow[]>([]);

  const fetchReport = async () => {
    const res = await fetch(`/api/reports/tt88?from=${from}&to=${to}`);
    const data = await res.json();
    setReport(data);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Báo cáo doanh thu</h1>

      <div className="flex gap-4">
        <input
          type="date"
          value={from}
          onChange={e => setFrom(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={to}
          onChange={e => setTo(e.target.value)}
          className="border p-2 rounded"
        />
        <button onClick={fetchReport} className="bg-blue-600 text-white p-2 rounded">
          Tìm
        </button>
      </div>

      <table className="w-full border-collapse border">
        <thead>
          <tr>
            <th className="border p-2">Ngày</th>
            <th className="border p-2">Doanh thu</th>
            <th className="border p-2">Số đơn</th>
          </tr>
        </thead>
        <tbody>
          {report.map((r, i) => (
            <tr key={i}>
              <td className="border p-2">{r.date}</td>
              <td className="border p-2">{r.revenue}</td>
              <td className="border p-2">{r.orders}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
