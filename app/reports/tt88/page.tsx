'use client'

import { useState } from 'react'
import axios from 'axios'

export default function RevenueReportPage() {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [data, setData] = useState<any[]>([])

  const fetchReport = async () => {
    const res = await axios.get('/api/reports/revenue-detail', {
      params: { from, to },
    })
    setData(res.data)
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        Sổ chi tiết doanh thu (S1-HKD)
      </h1>

      {/* Filter */}
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
        <button
          onClick={fetchReport}
          className="bg-blue-600 text-white px-4 rounded"
        >
          Xem báo cáo
        </button>
      </div>

      {/* Table */}
      <div className="overflow-auto">
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Ngày</th>
              <th className="border p-2">Số HĐ</th>
              <th className="border p-2">Doanh thu</th>
              <th className="border p-2">Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                <td className="border p-2">{row.date}</td>
                <td className="border p-2">{row.invoiceNo}</td>
                <td className="border p-2 text-right">
                  {row.amount.toLocaleString()}
                </td>
                <td className="border p-2">{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
