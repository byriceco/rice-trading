import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../contexts/DataContext';

export function SupplierFormPage() {
  const { addSupplier } = useData();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    district: '',
    postalCode: '',
    binVat: '',
    tin: '',
    paymentTerms: 'Net 30',
    openingBalance: 0,
    creditLimit: 0,
    notes: '',
    status: 'active' as 'active' | 'inactive',
  });

  const [step, setStep] = useState<1 | 2 | 3>(1);

  const canProceedStep1 =
    formData.name.trim().length > 0 &&
    formData.contact.trim().length > 0 &&
    formData.phone.trim().length > 0;

  const canProceedStep2 = formData.address.trim().length > 0;

  const generateSupplierCode = () => {
    const random = Math.floor(Math.random() * 10000);
    return `SUP-${String(random).padStart(4, '0')}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addSupplier({
      ...formData,
      supplierCode: generateSupplierCode(),
      balance: formData.openingBalance,
    });
    navigate('/suppliers');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Add New Supplier</h1>
        <button onClick={() => navigate(-1)} className="px-3 py-2 text-gray-600 hover:text-gray-900">Back</button>
      </div>

      <div className="flex items-center justify-between mb-4 text-sm">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>1</span>
          <span className={`${step === 1 ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>Basic & Contact</span>
        </div>
        <div className="flex-1 mx-2 h-px bg-gray-200" />
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>2</span>
          <span className={`${step === 2 ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>Address</span>
        </div>
        <div className="flex-1 mx-2 h-px bg-gray-200" />
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>3</span>
          <span className={`${step === 3 ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>Terms & Financials</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
              <h3 className="text-sm font-semibold text-gray-700">Basic Info</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Supplier Name<span className="text-red-500">*</span></label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Generated Code</label>
                  <input type="text" value="Will be generated" className="w-full px-3 py-2 border border-dashed border-gray-300 rounded-lg bg-gray-50 text-gray-500" disabled />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person<span className="text-red-500">*</span></label>
                <input type="text" value={formData.contact} onChange={(e) => setFormData({ ...formData, contact: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required />
              </div>
            </section>

            <section className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
              <h3 className="text-sm font-semibold text-gray-700">Contact</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone<span className="text-red-500">*</span></label>
                  <input type="tel" inputMode="tel" placeholder="+8801XXXXXXXXX" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required />
                  <p className="text-xs text-gray-500 mt-1">Bangladesh format preferred (e.g., +8801...)</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" placeholder="name@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
            </section>
          </div>
        )}

        {step === 2 && (
          <section className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
            <h3 className="text-sm font-semibold text-gray-700">Address</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Street Address<span className="text-red-500">*</span></label>
              <textarea value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" rows={2} required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input type="text" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                <input type="text" value={formData.district} onChange={(e) => setFormData({ ...formData, district: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                <input type="text" placeholder="e.g., 1212" value={formData.postalCode} onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          </section>
        )}

        {step === 3 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <section className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
                <h3 className="text-sm font-semibold text-gray-700">Tax & Terms</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">BIN/VAT</label>
                    <input type="text" placeholder="XXXXXXXX-XXXX" value={formData.binVat} onChange={(e) => setFormData({ ...formData, binVat: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">TIN</label>
                    <input type="text" value={formData.tin} onChange={(e) => setFormData({ ...formData, tin: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Terms</label>
                    <select value={formData.paymentTerms} onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option value="Advance">Advance</option>
                      <option value="Net 7">Net 7</option>
                      <option value="Net 15">Net 15</option>
                      <option value="Net 30">Net 30</option>
                      <option value="Net 45">Net 45</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </section>

              <section className="bg-white rounded-xl border border-gray-200 p-4 space-y-4">
                <h3 className="text-sm font-semibold text-gray-700">Financials</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Opening Balance</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">৳</span>
                      <input type="number" value={formData.openingBalance} onChange={(e) => setFormData({ ...formData, openingBalance: Number(e.target.value) })} className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" min={0} />
                    </div>
                  </div>
                  <div>
                    <label className="block text sm font-medium text-gray-700 mb-1">Credit Limit</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">৳</span>
                      <input type="number" value={formData.creditLimit} onChange={(e) => setFormData({ ...formData, creditLimit: Number(e.target.value) })} className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" min={0} />
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <section className="bg-white rounded-xl border border-gray-200 p-4 space-y-2">
              <h3 className="text-sm font-semibold text-gray-700">Notes</h3>
              <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" rows={2} placeholder="Any additional info..." />
            </section>
          </>
        )}

        <div className="flex justify-between gap-3">
          <button type="button" onClick={() => navigate('/suppliers')} className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
          <div className="ml-auto flex gap-3">
            {step > 1 && (
              <button type="button" onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Back</button>
            )}
            {step < 3 && (
              <button
                type="button"
                onClick={() => setStep((s) => (s + 1) as 1 | 2 | 3)}
                disabled={(step === 1 && !canProceedStep1) || (step === 2 && !canProceedStep2)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
              >
                Next
              </button>
            )}
            {step === 3 && (
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Save Supplier</button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
