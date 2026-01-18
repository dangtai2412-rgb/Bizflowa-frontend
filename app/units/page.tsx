"use client";

import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, MoreHorizontal } from 'lucide-react';

// Định nghĩa kiểu dữ liệu dựa trên backend (src/api/schemas/unit.py)
interface Unit {
  id: string;
  name: string;
  description?: string;
}

export default function UnitsPage() {
  const [units, setUnits] = useState<Unit[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Giả lập fetch dữ liệu từ API: GET /api/units
  useEffect(() => {
    // Trong thực tế, bạn sẽ gọi: fetch(`${process.env.NEXT_PUBLIC_API_URL}/units`)
    const mockData: Unit[] = [
      { id: '1', name: 'Cái', description: 'Đơn vị đếm cơ bản' },
      { id: '2', name: 'Thùng', description: 'Quy cách đóng gói thùng' },
      { id: '3', name: 'Hộp', description: 'Quy cách đóng gói hộp' },
      { id: '4', name: 'Kg', description: 'Đơn vị khối lượng' },
    ];
    setUnits(mockData);
  }, []);

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Danh sách Đơn vị tính</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <Plus size={20} />
          Thêm đơn vị
        </button>
      </div>

      {/* Filter & Search Section */}
      <div className="bg-white p-4 rounded-t-xl border-x border-t flex flex-wrap gap-4 items-center justify-between">
        <div className="relative w-full max-w-md">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            placeholder="Tìm kiếm đơn vị..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="text-sm text-gray-500">
          Hiển thị <b>{units.length}</b> đơn vị
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border rounded-b-xl overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên đơn vị</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ghi chú</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {units.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase())).map((unit) => (
              <tr key={unit.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{unit.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{unit.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{unit.description || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-3">
                    <button className="text-blue-600 hover:text-blue-900"><Edit size={18} /></button>
                    <button className="text-red-600 hover:text-red-900"><Trash2 size={18} /></button>
                    <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );


  
}
