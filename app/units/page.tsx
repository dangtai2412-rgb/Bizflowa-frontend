"use client";
import { useState, useEffect } from 'react';

export default function UnitsPage() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [units, setUnits] = useState([]);
  const [newUnit, setNewUnit] = useState({ unit_name: '', conversion_rate: 1 });

  // 1. Tải danh sách sản phẩm để chọn trước khi thêm đơn vị
  useEffect(() => {
    fetch('http://localhost:5000/product', {
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
    })
    .then(res => res.json())
    .then(data => setProducts(data));
  }, []);

  // 2. Khi chọn sản phẩm -> Tải danh sách đơn vị của nó
  useEffect(() => {
    if (selectedProduct) {
        fetch(`http://localhost:5000/unit/product/${selectedProduct}`, {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        })
        .then(res => res.json())
        .then(data => setUnits(data));
    }
  }, [selectedProduct]);

  const handleAddUnit = async () => {
    if (!selectedProduct) return alert("Vui lòng chọn sản phẩm trước!");
    
    // Logic quy đổi: Nếu tỷ lệ = 1 thì là đơn vị cơ bản (Base), >1 là quy đổi
    const isBase = newUnit.conversion_rate === 1;
    
    const res = await fetch('http://localhost:5000/unit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({
            product_id: selectedProduct,
            unit_name: newUnit.unit_name,
            conversion_rate: newUnit.conversion_rate,
            is_base_unit: isBase
        })
    });

    if (res.ok) {
        // Reload units
        const updatedUnits = await fetch(`http://localhost:5000/unit/product/${selectedProduct}`, {
             headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        }).then(r => r.json());
        setUnits(updatedUnits);
        setNewUnit({ unit_name: '', conversion_rate: 1 });
    }
  };

  return (
    <div className="p-6">
       <h1 className="text-2xl font-bold mb-6">Cài đặt Đơn vị tính</h1>

       <div className="flex gap-6">
           {/* Cột trái: Chọn sản phẩm */}
           <div className="w-1/3 border-r pr-6">
               <h3 className="font-semibold mb-3">Chọn sản phẩm</h3>
               <select 
                className="w-full p-2 border rounded"
                onChange={(e) => setSelectedProduct(e.target.value)}
               >
                   <option value="">-- Chọn sản phẩm --</option>
                   {products.map((p: any) => (
                       <option key={p.id} value={p.id}>{p.name}</option>
                   ))}
               </select>
           </div>

           {/* Cột phải: Danh sách đơn vị & Form thêm */}
           <div className="w-2/3">
               {selectedProduct ? (
                   <>
                       <div className="mb-6 bg-blue-50 p-4 rounded">
                           <h4 className="font-bold mb-2 text-blue-800">Thêm đơn vị quy đổi</h4>
                           <div className="flex gap-2 items-end">
                                <div>
                                    <label className="text-xs">Tên ĐV (VD: Thùng)</label>
                                    <input 
                                        className="border p-2 rounded w-full"
                                        value={newUnit.unit_name}
                                        onChange={e => setNewUnit({...newUnit, unit_name: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs">Quy đổi (VD: 24)</label>
                                    <input 
                                        type="number"
                                        className="border p-2 rounded w-24"
                                        value={newUnit.conversion_rate}
                                        onChange={e => setNewUnit({...newUnit, conversion_rate: Number(e.target.value)})}
                                    />
                                </div>
                                <button onClick={handleAddUnit} className="bg-blue-600 text-white px-4 py-2 rounded">Lưu</button>
                           </div>
                           <p className="text-xs text-gray-500 mt-2">* Nhập 1 nếu là đơn vị cơ bản (Lon, Cái). Nhập số lớn hơn 1 nếu là đơn vị lớn (Thùng, Hộp).</p>
                       </div>

                       <table className="min-w-full border">
                           <thead className="bg-gray-100">
                               <tr>
                                   <th className="p-2 text-left">Tên đơn vị</th>
                                   <th className="p-2 text-left">Tỷ lệ quy đổi</th>
                                   <th className="p-2 text-left">Hành động</th>
                               </tr>
                           </thead>
                           <tbody>
                               {units.map((u: any) => (
                                   <tr key={u.id} className="border-t">
                                       <td className="p-2">{u.name}</td>
                                       <td className="p-2">{u.conversion_rate || 1}</td>
                                       <td className="p-2">
                                           <button className="text-red-500 text-sm">Xóa</button>
                                       </td>
                                   </tr>
                               ))}
                           </tbody>
                       </table>
                   </>
               ) : (
                   <div className="text-gray-400 italic">Vui lòng chọn một sản phẩm bên trái để cài đặt đơn vị.</div>
               )}
           </div>
       </div>
    </div>
  );
}