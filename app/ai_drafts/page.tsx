"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios"; // Sử dụng cấu hình axios bạn đã có
import { Check, X, Bot, User, Package, CreditCard } from "lucide-react";

interface AIDraftItem {
  product_name: string;
  quantity: number;
}

interface AIDraft {
  draft_id: number;
  recognized_content: string;
  extracted_json: string; // Backend gửi về chuỗi JSON
  confirmation_status: string;
  created_at: string;
}

export default function AIDraftsPage() {
  const [drafts, setDrafts] = useState<AIDraft[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Lấy danh sách đơn hàng nháp từ Backend
  const fetchDrafts = async () => {
    try {
      const res = await api.get("/ai-draft-orders");
      // Chỉ hiển thị các đơn đang chờ (Pending)
      const pendingDrafts = res.data.filter((d: AIDraft) => d.confirmation_status === "Pending");
      setDrafts(pendingDrafts);
    } catch (error) {
      console.error("Lỗi lấy dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrafts();
  }, []);

  // 2. Xác nhận đơn hàng (Chuyển nháp thành thật)
  const handleConfirm = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xác nhận đơn hàng này không? Hệ thống sẽ tự động tạo hóa đơn và hạch toán công nợ.")) return;

    try {
      await api.post(`/ai-draft-orders/${id}/confirm`);
      alert("Xác nhận thành công! Đơn hàng đã được chuyển vào hệ thống quản lý.");
      setDrafts(drafts.filter((d) => d.draft_id !== id));
    } catch (error) {
      alert("Lỗi khi xác nhận đơn hàng. Vui lòng kiểm tra lại thông tin sản phẩm/khách hàng.");
    }
  };

  if (loading) return <div className="p-8 text-center">Đang tải đơn hàng từ AI...</div>;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-3">
        <Bot className="h-8 w-8 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">Đơn hàng nháp từ AI</h1>
      </div>

      {drafts.length === 0 ? (
        <div className="bg-gray-50 border-2 border-dashed rounded-xl p-12 text-center text-gray-500">
          Hiện không có lệnh thoại nào cần xử lý.
        </div>
      ) : (
        <div className="grid gap-6">
          {drafts.map((draft) => {
            // Giải mã JSON từ AI để hiển thị chi tiết
            const details = JSON.parse(draft.extracted_json || "{}");
            
            return (
              <div key={draft.draft_id} className="bg-white border rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-4 bg-blue-50 border-b flex justify-between items-center">
                  <div className="flex items-center gap-2 text-blue-700">
                    <Bot className="h-4 w-4" />
                    <span className="text-sm font-medium italic">"{draft.recognized_content}"</span>
                  </div>
                  <span className="text-xs text-gray-400">{new Date(draft.created_at).toLocaleString('vi-VN')}</span>
                </div>

                <div className="p-6 grid md:grid-cols-3 gap-4">
                  {/* Thông tin khách */}
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold">Khách hàng</p>
                      <p className="font-semibold text-gray-900">{details.customer_name || "Chưa rõ"}</p>
                    </div>
                  </div>

                  {/* Thanh toán */}
                  <div className="flex items-start gap-3">
                    <CreditCard className="h-5 w-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-bold">Thanh toán</p>
                      <span className={`text-sm px-2 py-0.5 rounded-full font-medium ${details.payment_method === 'Debt' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                        {details.payment_method === 'Debt' ? 'Ghi nợ' : 'Tiền mặt'}
                      </span>
                    </div>
                  </div>

                  {/* Sản phẩm */}
                  <div className="flex items-start gap-3 md:col-span-1 border-l pl-4">
                    <Package className="h-5 w-5 text-gray-400 mt-1" />
                    <div className="w-full">
                      <p className="text-xs text-gray-500 uppercase font-bold underline mb-1">Sản phẩm trích xuất</p>
                      <ul className="space-y-1">
                        {details.items?.map((item: AIDraftItem, idx: number) => (
                          <li key={idx} className="text-sm flex justify-between border-b border-gray-50 pb-1">
                            <span className="text-gray-700">{item.product_name}</span>
                            <span className="font-bold text-blue-600">x{item.quantity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t flex justify-end gap-3">
                  <button className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-red-600 flex items-center gap-2">
                    <X className="h-4 w-4" /> Bỏ qua
                  </button>
                  <button 
                    onClick={() => handleConfirm(draft.draft_id)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 flex items-center gap-2 shadow-sm"
                  >
                    <Check className="h-4 w-4" /> Xác nhận & Tạo đơn
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}