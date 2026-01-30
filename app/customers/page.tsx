"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios"; // Import axios
import { Plus, Search, Trash2, Edit, Phone, MapPin, Mail } from "lucide-react";

// Định nghĩa kiểu dữ liệu cho Khách hàng
interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  address: string | null;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Hàm gọi API lấy danh sách khách hàng
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/customers");
      
      // 👉 THÊM DÒNG NÀY ĐỂ KIỂM TRA
      console.log("Dữ liệu API trả về:", res.data); 

      // Kiểm tra an toàn trước khi set
      if (Array.isArray(res.data)) {
        setCustomers(res.data);
      } else {
        console.error("Lỗi: API không trả về mảng!", res.data);
        setCustomers([]); // Set mảng rỗng để không bị lỗi màn hình
      }
    } catch (err) {
      console.error("Lỗi:", err);
      setError("Không thể tải dữ liệu.");
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  
    
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý Khách hàng</h1>
        <button className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors">
          <Plus className="h-4 w-4" />
          Thêm khách hàng
        </button>
      </div>

      {/* Thông báo lỗi nếu có */}
      {error && (
        <div className="p-3 bg-yellow-50 text-yellow-700 rounded-lg text-sm border border-yellow-200">
          ⚠️ {error}
        </div>
      )}

      {/* Thanh tìm kiếm */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Tìm tên, số điện thoại..."
          className="w-full rounded-lg border border-gray-300 pl-10 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* Bảng dữ liệu */}
      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500 font-medium">
            <tr>
              <th className="px-6 py-3">Tên khách hàng</th>
              <th className="px-6 py-3">Liên hệ</th>
              <th className="px-6 py-3">Địa chỉ</th>
              <th className="px-6 py-3 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">Đang tải dữ liệu...</td></tr>
            ) : customers.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">Chưa có khách hàng nào</td></tr>
            ) : (
              customers.map((cus) => (
                <tr key={cus.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{cus.name}</td>
                  <td className="px-6 py-4 text-gray-600 space-y-1">
                      <div className="flex items-center gap-2"><Phone className="h-3 w-3"/> {cus.phone}</div>
                      {cus.email && <div className="flex items-center gap-2"><Mail className="h-3 w-3"/> {cus.email}</div>}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                   <div className="flex items-center gap-2"><MapPin className="h-3 w-3"/> {cus.address || "-"}</div>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button className="p-1 text-blue-600 hover:bg-blue-50 rounded"><Edit className="h-4 w-4" /></button>
                    <button className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}