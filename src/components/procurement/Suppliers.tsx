import React, { useMemo, useState } from 'react';
import { Plus, Edit2, Phone, Mail, MapPin, Check, X, Users, DollarSign, ArrowUpDown } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import type { Supplier } from '../../contexts/DataContext';

export function Suppliers() {
  const { suppliers, addSupplier, updateSupplier } = useData();
  const [showForm, setShowForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  const [sortKey, setSortKey] = useState<'name_asc' | 'balance_desc' | 'status_active'>('name_asc');
  const [formData, setFormData] = useState({
    name: '',
    supplierCode: '',
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSupplier) {
      updateSupplier(editingSupplier.id, {
        ...formData,
        balance: formData.openingBalance,
      });
    } else {
      addSupplier({
        ...formData,
        balance: formData.openingBalance
      });
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      supplierCode: '',
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
      status: 'active',
    });
    setEditingSupplier(null);
    setShowForm(false);
  };

  const handleEdit = (supplier: Supplier) => {
    setFormData({
      name: supplier.name,
      supplierCode: supplier.supplierCode || '',
      contact: supplier.contact,
      phone: supplier.phone,
      email: supplier.email,
      address: supplier.address,
      city: supplier.city || '',
      district: supplier.district || '',
      postalCode: supplier.postalCode || '',
      binVat: supplier.binVat || '',
      tin: supplier.tin || '',
      paymentTerms: supplier.paymentTerms || 'Net 30',
      openingBalance: supplier.openingBalance ?? supplier.balance ?? 0,
      creditLimit: supplier.creditLimit ?? 0,
      notes: supplier.notes || '',
      status: supplier.status,
    });
    setEditingSupplier(supplier);
    setShowForm(true);
  };

  const doesSupplierMatchSearch = (supplier: Supplier, term: string): boolean => {
    if (!term.trim()) return true;
    const needle = term.toLowerCase();
    return (
      supplier.name.toLowerCase().includes(needle) ||
      supplier.contact.toLowerCase().includes(needle) ||
      supplier.address.toLowerCase().includes(needle) ||
      supplier.phone.toLowerCase().includes(needle) ||
      supplier.email.toLowerCase().includes(needle) ||
      supplier.status.toLowerCase().includes(needle)
    );
  };

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((s) => doesSupplierMatchSearch(s, searchTerm));
  }, [suppliers, searchTerm]);

  const sortedSuppliers = useMemo(() => {
    const copy = [...filteredSuppliers];
    switch (sortKey) {
      case 'balance_desc':
        copy.sort((a, b) => b.balance - a.balance);
        break;
      case 'status_active':
        copy.sort((a, b) => {
          // Active first, then by name
          const av = a.status === 'active' ? 0 : 1;
          const bv = b.status === 'active' ? 0 : 1;
          if (av !== bv) return av - bv;
          return a.name.localeCompare(b.name);
        });
        break;
      case 'name_asc':
      default:
        copy.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }
    return copy;
  }, [filteredSuppliers, sortKey]);

  const totalPages = Math.max(1, Math.ceil(sortedSuppliers.length / pageSize));
  const paginatedSuppliers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedSuppliers.slice(start, start + pageSize);
  }, [sortedSuppliers, currentPage, pageSize]);

  const handleChangePage = (nextPage: number) => {
    const bounded = Math.min(Math.max(1, nextPage), totalPages);
    setCurrentPage(bounded);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const getInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  const totalSuppliers = suppliers.length;
  const activeSuppliers = suppliers.filter((s) => s.status === 'active').length;
  const inactiveSuppliers = suppliers.filter((s) => s.status !== 'active').length;
  const totalOutstanding = suppliers.reduce((sum, s) => sum + s.balance, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Suppliers</h1>
        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search name, phone, email, address..."
                className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 w-72"
              />
              <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
              </svg>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <div className="relative">
              <ArrowUpDown className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <select
                value={sortKey}
                onChange={(e) => { setSortKey(e.target.value as any); setCurrentPage(1); }}
                className="pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-sm"
              >
                <option value="name_asc">Sort: Name (A-Z)</option>
                <option value="balance_desc">Sort: Balance (High → Low)</option>
                <option value="status_active">Sort: Status (Active first)</option>
              </select>
            </div>
          </div>
          <div className="flex rounded-lg overflow-hidden border border-gray-300">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 text-sm ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}
              title="Grid view"
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 text-sm border-l border-gray-300 ${viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}
              title="List view"
            >
              List
            </button>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Supplier
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Suppliers</p>
              <p className="text-2xl font-bold text-gray-900">{totalSuppliers}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-green-600">{activeSuppliers}</p>
            </div>
            <Check className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Inactive</p>
              <p className="text-2xl font-bold text-red-600">{inactiveSuppliers}</p>
            </div>
            <X className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Outstanding</p>
              <p className="text-2xl font-bold text-gray-900">৳{totalOutstanding.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Mobile search */}
      <div className="sm:hidden">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search name, phone, email, address..."
          className="w-full mt-2 mb-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Supplier Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-3xl shadow-xl border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">
              {editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <p className="text-sm text-gray-500">Fields marked as required must be completed.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <section className="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-4">
                  <h3 className="text-sm font-semibold text-gray-700">Basic Info</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Supplier Code (optional)</label>
                      <input type="text" value={formData.supplierCode} onChange={(e) => setFormData({ ...formData, supplierCode: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="e.g. SUP-0001" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Supplier Name<span className="text-red-500">*</span></label>
                      <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person<span className="text-red-500">*</span></label>
                    <input type="text" value={formData.contact} onChange={(e) => setFormData({ ...formData, contact: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required />
                  </div>
                </section>

                <section className="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-4">
                  <h3 className="text-sm font-semibold text-gray-700">Contact</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone<span className="text-red-500">*</span></label>
                      <input type="tel" inputMode="tel" placeholder="+8801XXXXXXXXX" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required />
                      <p className="text-xs text-gray-500 mt-1">Bangladesh format preferred (e.g., +8801...)</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email<span className="text-red-500">*</span></label>
                      <input type="email" placeholder="name@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required />
                    </div>
                  </div>
                </section>
              </div>

              <section className="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-4">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <section className="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-4">
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

                <section className="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-4">
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">Credit Limit</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">৳</span>
                        <input type="number" value={formData.creditLimit} onChange={(e) => setFormData({ ...formData, creditLimit: Number(e.target.value) })} className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" min={0} />
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              <section className="bg-gray-50 rounded-xl border border-gray-200 p-4 space-y-2">
                <h3 className="text-sm font-semibold text-gray-700">Notes</h3>
                <textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" rows={2} placeholder="Any additional info..." />
              </section>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  {editingSupplier ? 'Update' : 'Add'} Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Suppliers Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedSuppliers.map((supplier) => (
            <div key={supplier.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                  {getInitials(supplier.name)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{supplier.name}</h3>
                  <p className="text-sm text-gray-600">{supplier.contact}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  supplier.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {supplier.status === 'active' ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                </span>
                <button
                  onClick={() => handleEdit(supplier)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{supplier.address}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Phone className="w-4 h-4 mr-2" />
                <a className="hover:underline" href={`tel:${supplier.phone}`}>{supplier.phone}</a>
              </div>
              <div className="flex items-center text-gray-600">
                <Mail className="w-4 h-4 mr-2" />
                <a className="hover:underline" href={`mailto:${supplier.email}`}>{supplier.email}</a>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Outstanding Balance</span>
                <span className="font-semibold text-lg text-red-600">
                  ৳{supplier.balance.toLocaleString()}
                </span>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <a href={`tel:${supplier.phone}`} className="inline-flex items-center px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                  <Phone className="w-4 h-4 mr-2" /> Call
                </a>
                <a href={`mailto:${supplier.email}`} className="inline-flex items-center px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                  <Mail className="w-4 h-4 mr-2" /> Email
                </a>
              </div>
            </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedSuppliers.map((supplier) => (
                <tr key={supplier.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-semibold">
                        {getInitials(supplier.name)}
                      </div>
                      <span>{supplier.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{supplier.contact}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600"><a className="hover:underline" href={`tel:${supplier.phone}`}>{supplier.phone}</a></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600"><a className="hover:underline" href={`mailto:${supplier.email}`}>{supplier.email}</a></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{supplier.address}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${supplier.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {supplier.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">৳{supplier.balance.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="inline-flex items-center gap-2">
                      <a title="Call" href={`tel:${supplier.phone}`} className="p-2 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700">
                        <Phone className="w-4 h-4" />
                      </a>
                      <a title="Email" href={`mailto:${supplier.email}`} className="p-2 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700">
                        <Mail className="w-4 h-4" />
                      </a>
                      <button title="Edit" onClick={() => handleEdit(supplier)} className="p-2 rounded hover:bg-gray-100 text-blue-600 hover:text-blue-700">
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedSuppliers.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">No suppliers match your search</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-3">
        <div className="text-sm text-gray-600">
          Showing {(sortedSuppliers.length === 0 ? 0 : (currentPage - 1) * pageSize + 1)}-
          {Math.min(currentPage * pageSize, sortedSuppliers.length)} of {sortedSuppliers.length}
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-600">Per page</label>
          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
            className="px-2 py-1 border border-gray-300 rounded"
          >
            <option value={6}>6</option>
            <option value={9}>9</option>
            <option value={12}>12</option>
            <option value={24}>24</option>
          </select>
          <div className="flex items-center border border-gray-300 rounded overflow-hidden">
            <button onClick={() => handleChangePage(currentPage - 1)} className="px-3 py-1 text-sm disabled:opacity-50" disabled={currentPage <= 1}>
              Prev
            </button>
            <span className="px-3 py-1 text-sm text-gray-700">{currentPage} / {totalPages}</span>
            <button onClick={() => handleChangePage(currentPage + 1)} className="px-3 py-1 text-sm disabled:opacity-50" disabled={currentPage >= totalPages}>
              Next
            </button>
          </div>
        </div>
      </div>

      {suppliers.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No suppliers yet</h3>
          <p className="text-gray-600 mb-4">Get started by adding your first supplier</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add First Supplier
          </button>
        </div>
      )}
    </div>
  );
}