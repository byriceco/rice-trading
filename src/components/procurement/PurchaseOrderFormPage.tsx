import React, { useMemo, useState } from 'react';
import { ArrowLeft, Calculator, Info, CreditCard } from 'lucide-react';
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
    const paymentStatus = formData.paidAmount >= totalAmount ? 'paid' : (formData.paidAmount > 0 ? 'partial' : 'pending');
    addPurchaseOrder({
      ...formData,
      supplierName: supplier.name,
      totalAmount,
      paymentStatus,
    });
    navigate('/purchase-orders');
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create Purchase Order</h1>
        <button onClick={() => navigate(-1)} className="inline-flex items-center px-3 py-2 text-gray-600 hover:text-gray-900">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: form sections */}
          <div className="lg:col-span-2 space-y-6">
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
              {formData.supplierId && (
                <div className="flex items-start gap-3 text-sm bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <Info className="w-4 h-4 text-gray-500 mt-0.5" />
                  <div className="text-gray-700">
                    {(() => {
                      const s = suppliers.find(s => s.id === formData.supplierId);
                      return s ? (
                        <>
                          <div className="font-medium text-gray-900">{s.name}</div>
                          <div className="text-gray-600">{s.contact} • {s.phone}</div>
                          <div className="text-gray-500">{s.address}</div>
                        </>
                      ) : null;
                    })()}
                  </div>
                </div>
              )}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price per kg</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">৳</span>
                    <input type="number" step="0.01" value={formData.pricePerKg} onChange={(e) => setFormData({ ...formData, pricePerKg: Number(e.target.value) })} className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required />
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right: sticky summary */}
          <aside className="lg:col-span-1">
            <div className="sticky top-6 space-y-4">
              <section className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
                <h3 className="text-sm font-semibold text-gray-700 flex items-center"><Calculator className="w-4 h-4 mr-2" /> Summary</h3>
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <span className="text-gray-600">Bags × Bag Size</span>
                    <span className="font-medium text-gray-900">{formData.quantity} × {formData.bagSize}kg</span>
                  </div>
                  <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <span className="text-gray-600">Total Weight</span>
                    <span className="font-medium text-gray-900">{formData.weightKg} kg</span>
                  </div>
                  <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <span className="text-gray-600">Price per kg</span>
                    <span className="font-medium text-gray-900">৳{formData.pricePerKg}</span>
                  </div>
                  <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <span className="text-gray-600">Total Amount</span>
                    <span className="text-lg font-semibold text-gray-900">৳{totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </section>

              <section className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
                <h3 className="text-sm font-semibold text-gray-700 flex items-center"><CreditCard className="w-4 h-4 mr-2" /> Payment</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Paid Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">৳</span>
                    <input
                      type="number"
                      value={formData.paidAmount}
                      onChange={(e) => setFormData({ ...formData, paidAmount: Number(e.target.value) })}
                      className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      min={0}
                      max={totalAmount}
                    />
                  </div>
                  <p className="mt-2 text-sm">Status: {formData.paidAmount >= totalAmount ? (
                    <span className="text-green-600 font-medium">Paid</span>
                  ) : formData.paidAmount > 0 ? (
                    <span className="text-blue-600 font-medium">Partial</span>
                  ) : (
                    <span className="text-orange-600 font-medium">Pending</span>
                  )}</p>
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => navigate('/purchase-orders')} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
                  <button
                    type="submit"
                    disabled={!formData.supplierId || !formData.date || formData.quantity <= 0 || formData.bagSize <= 0 || formData.weightKg <= 0 || formData.pricePerKg <= 0}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Save Order
                  </button>
                </div>
                <p className="text-xs text-gray-500 inline-flex items-center"><Info className="w-3 h-3 mr-1" /> Payment status is set based on paid amount.</p>
              </section>
            </div>
          </aside>
        </div>
      </form>
    </div>
  );
}
