import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';

export function PurchaseOrderFormPage() {
  const { suppliers, addPurchaseOrder } = useData();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    supplierId: '',
    date: new Date().toISOString().split('T')[0],
    riceType: 'Basmati',
    grade: '1121',
    bagSize: 50,
    quantity: 0,
    weightKg: 0,
    pricePerKg: 0,
    status: 'pending' as 'pending' | 'received' | 'cancelled',
    paymentStatus: 'pending' as 'pending' | 'partial' | 'paid',
    paidAmount: 0,
  });

  const riceTypes = ['Basmati', 'Sona Masuri', 'IR64', 'Ponni', 'Jeera', 'Other'];
  const grades: Record<string, string[]> = {
    Basmati: ['1121', 'Pusa', 'Traditional'],
    'Sona Masuri': ['Premium', 'Standard'],
    IR64: ['Standard', 'Parboiled'],
    Ponni: ['Raw', 'Parboiled'],
    Jeera: ['Premium'],
    Other: ['Grade A', 'Grade B'],
  };

  const totalAmount = useMemo(() => formData.weightKg * formData.pricePerKg, [formData.weightKg, formData.pricePerKg]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const supplier = suppliers.find((s) => s.id === formData.supplierId);
    if (!supplier) return;
    addPurchaseOrder({
      ...formData,
      supplierName: supplier.name,
      totalAmount,
    });
    navigate('/purchase-orders');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create Purchase Order</h1>
        <button onClick={() => navigate(-1)} className="px-3 py-2 text-gray-600 hover:text-gray-900">Back</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
            <h3 className="text-sm font-semibold text-gray-700">Supplier & Date</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Supplier<span className="text-red-500">*</span></label>
                <select value={formData.supplierId} onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required>
                  <option value="">Select Supplier</option>
                  {suppliers.filter((s) => s.status === 'active').map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required />
              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
            <h3 className="text-sm font-semibold text-gray-700">Rice Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rice Type</label>
                <select value={formData.riceType} onChange={(e) => setFormData({ ...formData, riceType: e.target.value, grade: grades[e.target.value]?.[0] || '' })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  {riceTypes.map((t) => (<option key={t} value={t}>{t}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                <select value={formData.grade} onChange={(e) => setFormData({ ...formData, grade: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  {(grades[formData.riceType] || []).map((g) => (<option key={g} value={g}>{g}</option>))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bag Size (kg)</label>
                <input type="number" value={formData.bagSize} onChange={(e) => setFormData({ ...formData, bagSize: Number(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity (bags)</label>
                <input type="number" value={formData.quantity} onChange={(e) => {
                  const qty = Number(e.target.value);
                  setFormData({ ...formData, quantity: qty, weightKg: qty * formData.bagSize });
                }} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Weight (kg)</label>
                <input type="number" value={formData.weightKg} onChange={(e) => setFormData({ ...formData, weightKg: Number(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price per kg (৳)</label>
                <input type="number" step="0.01" value={formData.pricePerKg} onChange={(e) => setFormData({ ...formData, pricePerKg: Number(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required />
              </div>
            </div>
          </section>
        </div>

        <section className="bg-white rounded-xl border border-gray-200 p-4 space-y-2">
          <h3 className="text-sm font-semibold text-gray-700">Summary</h3>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Total Amount</span>
            <span className="text-xl font-semibold text-gray-900">৳{totalAmount.toLocaleString()}</span>
          </div>
        </section>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={() => navigate('/purchase-orders')} className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Save Order</button>
        </div>
      </form>
    </div>
  );
}
