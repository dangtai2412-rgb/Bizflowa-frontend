"use client"
import { useEffect, useState } from 'react';
import { Plus, Search, Trash2, Wallet, Calendar, FileText, Loader2 } from "lucide-react";
import api from '@/lib/axios';

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State form
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    expense_name: '',
    amount: '',
    category: 'Điện nước',
    note: ''
  });

  const categories = ["Điện nước", "Mặt bằng", "Lương nhân viên", "Nhập hàng", "Ăn uống", "Khác"];

  // 1. Lấy dữ liệu
  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const res = await api.get('/expenses/');
      setExpenses(res.data);
    } catch (error) {
      console.error("Lỗi tải chi phí:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // 2. Xử lý thêm mới
  const handleCreate = async () => {
    if (!formData.expense_name || !formData.amount) return alert("Vui lòng nhập tên và số tiền!");
    
    try {
      setIsCreating(true);
      await api.post('/expenses/', {
        ...formData,
        amount: Number(formData.amount)
      });
      
      // Reset & Reload
      setFormData({ expense_name: '', amount: '', category: 'Điện nước', note: '' });
      fetchExpenses();
      alert("Đã lưu phiếu chi!");
    } catch (error) {
      alert("Lỗi khi tạo phiếu chi");
    } finally {
      setIsCreating(false);
    }
  };

  // 3. Xử lý xóa
  const handleDelete = async (id: number) => {
    if(!confirm("Bạn chắc chắn muốn xóa khoản chi này?")) return;
    try {
      await api.delete(`/expenses/${id}`);
      fetchExpenses();
    } catch (error) {
      alert("Lỗi khi xóa");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Wallet className="text-orange-600"/> Quản lý Chi Phí
        </h1>
        <p className="text-gray-500 text-sm mt-1">Ghi chép tiền điện, nước, lương thưởng...</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form Thêm Mới (Cột trái) */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit sticky top-6">
          <h3 className="font-bold text-gray-700 mb-4">📝 Tạo phiếu chi mới</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Tên khoản chi</label>
              <input 
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="VD: Tiền điện tháng 2"
                value={formData.expense_name}
onChange={e => setFormData({...formData, expense_name: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Số tiền (VNĐ)</label>
              <input 
                type="number"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none font-medium text-orange-600"
                placeholder="0"
                value={formData.amount}
                onChange={e => setFormData({...formData, amount: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Loại chi phí</label>
              <select 
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-white"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Ghi chú</label>
              <textarea 
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                rows={3}
                placeholder="Chi tiết..."
                value={formData.note}
                onChange={e => setFormData({...formData, note: e.target.value})}
              ></textarea>
            </div>

            <button 
              onClick={handleCreate}
              disabled={isCreating}
              className="w-full py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              {isCreating ? <Loader2 className="animate-spin" size={18}/> : <Plus size={18}/>}
              Lưu Phiếu Chi
            </button>
          </div>
        </div>

        {/* Danh Sách (Cột phải) */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <span className="font-semibold text-gray-700">Lịch sử chi tiêu</span>
            <div className="text-sm text-gray-500">
              Tổng cộng: <span className="font-bold text-gray-800">{expenses.length} phiếu</span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-600 font-medium text-xs uppercase">
                <tr>
                  <th className="px-6 py-3">Ngày</th>
                  <th className="px-6 py-3">Nội dung</th>
<th className="px-6 py-3">Số tiền</th>
                  <th className="px-6 py-3 text-center">Xóa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan={4} className="text-center py-8 text-gray-500">Đang tải dữ liệu...</td></tr>
                ) : expenses.length === 0 ? (
                  <tr><td colSpan={4} className="text-center py-8 text-gray-400">Chưa có dữ liệu</td></tr>
                ) : (
                  expenses.map((item: any) => (
                    <tr key={item.expense_id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4 text-sm text-gray-500 flex items-center gap-2">
                        <Calendar size={14}/>
                        {new Date(item.expense_date).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-800">{item.expense_name}</p>
                        <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-md mt-1">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-orange-600">
                        -{item.amount.toLocaleString('vi-VN')} ₫
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => handleDelete(item.expense_id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}