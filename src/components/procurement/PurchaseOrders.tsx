import React, { useState } from 'react';
import { Plus, Search, Filter, Edit2, Eye } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import type { PurchaseOrder } from '../../contexts/DataContext';

export function PurchaseOrders() {
  const { purchaseOrders, suppliers, addPurchaseOrder, updatePurchaseOrder } = useData();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [editingOrder, setEditingOrder] = useState<PurchaseOrder | null>(null);
  const [viewingOrder, setViewingOrder] = useState<PurchaseOrder | null>(null);

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
    paidAmount: 0
  });

  const riceTypes = ['Basmati', 'Sona Masuri', 'IR64', 'Ponni', 'Jeera', 'Other'];
  const grades = {
    'Basmati': ['1121', 'Pusa', 'Traditional'],
    'Sona Masuri': ['Premium', 'Standard'],
    'IR64': ['Standard', 'Parboiled'],
    'Ponni': ['Raw', 'Parboiled'],
    'Jeera': ['Premium'],
    'Other': ['Grade A', 'Grade B']
  };

  const filteredOrders = purchaseOrders.filter(order => {
    const matchesSearch = order.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.riceType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const supplier = suppliers.find(s => s.id === formData.supplierId);
    if (!supplier) return;

    const totalAmount = formData.weightKg * formData.pricePerKg;
    const orderData = {
      ...formData,
      supplierName: supplier.name,
      totalAmount
    };

    if (editingOrder) {
      updatePurchaseOrder(editingOrder.id, orderData);
    } else {
      addPurchaseOrder(orderData);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      supplierId: '',
      date: new Date().toISOString().split('T')[0],
      riceType: 'Basmati',
      grade: '1121',
      bagSize: 50,
      quantity: 0,
      weightKg: 0,
      pricePerKg: 0,
      status: 'pending',
      paymentStatus: 'pending',
      paidAmount: 0
    });
    setEditingOrder(null);
    setShowForm(false);
  };

  const handleEdit = (order: PurchaseOrder) => {
    setFormData({
      supplierId: order.supplierId,
      date: order.date,
      riceType: order.riceType,
      grade: order.grade,
      bagSize: order.bagSize,
      quantity: order.quantity,
      weightKg: order.weightKg,
      pricePerKg: order.pricePerKg,
      status: order.status,
      paymentStatus: order.paymentStatus,
      paidAmount: order.paidAmount
    });
    setEditingOrder(order);
    setShowForm(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'received': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'partial': return 'bg-blue-100 text-blue-800';
      case 'paid': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Purchase Orders</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Purchase Order
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by supplier or rice type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="received">Received</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Purchase Order Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">
              {editingOrder ? 'Edit Purchase Order' : 'Create New Purchase Order'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Supplier
                  </label>
                  <select
                    value={formData.supplierId}
                    onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Supplier</option>
                    {suppliers.filter(s => s.status === 'active').map(supplier => (
                      <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rice Type
                  </label>
                  <select
                    value={formData.riceType}
                    onChange={(e) => setFormData({ ...formData, riceType: e.target.value, grade: grades[e.target.value as keyof typeof grades][0] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {riceTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Grade
                  </label>
                  <select
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {grades[formData.riceType as keyof typeof grades]?.map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bag Size (kg)
                  </label>
                  <input
                    type="number"
                    value={formData.bagSize}
                    onChange={(e) => setFormData({ ...formData, bagSize: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity (bags)
                  </label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => {
                      const qty = Number(e.target.value);
                      setFormData({ 
                        ...formData, 
                        quantity: qty,
                        weightKg: qty * formData.bagSize
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={formData.weightKg}
                    onChange={(e) => setFormData({ ...formData, weightKg: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price per kg (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.pricePerKg}
                    onChange={(e) => setFormData({ ...formData, pricePerKg: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-lg font-semibold text-gray-900">
                  Total Amount: ₹{(formData.weightKg * formData.pricePerKg).toLocaleString()}
                </div>
              </div>

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
                  {editingOrder ? 'Update' : 'Create'} Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Order Modal */}
      {viewingOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Purchase Order Details</h2>
            <div className="space-y-3">
              <div><span className="font-medium">Order ID:</span> {viewingOrder.id}</div>
              <div><span className="font-medium">Supplier:</span> {viewingOrder.supplierName}</div>
              <div><span className="font-medium">Date:</span> {viewingOrder.date}</div>
              <div><span className="font-medium">Rice Type:</span> {viewingOrder.riceType} - {viewingOrder.grade}</div>
              <div><span className="font-medium">Quantity:</span> {viewingOrder.quantity} bags ({viewingOrder.bagSize}kg each)</div>
              <div><span className="font-medium">Total Weight:</span> {viewingOrder.weightKg} kg</div>
              <div><span className="font-medium">Price per kg:</span> ₹{viewingOrder.pricePerKg}</div>
              <div><span className="font-medium">Total Amount:</span> ₹{viewingOrder.totalAmount.toLocaleString()}</div>
              <div><span className="font-medium">Status:</span> 
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(viewingOrder.status)}`}>
                  {viewingOrder.status}
                </span>
              </div>
              <div><span className="font-medium">Payment Status:</span> 
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(viewingOrder.paymentStatus)}`}>
                  {viewingOrder.paymentStatus}
                </span>
              </div>
              <div><span className="font-medium">Paid Amount:</span> ₹{viewingOrder.paidAmount.toLocaleString()}</div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setViewingOrder(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rice Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity & Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.supplierName}</div>
                      <div className="text-sm text-gray-500">{order.date}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.riceType}</div>
                      <div className="text-sm text-gray-500">{order.grade}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">{order.quantity} bags × {order.bagSize}kg</div>
                      <div className="text-sm text-gray-500">₹{order.pricePerKg}/kg</div>
                      <div className="text-sm font-medium text-gray-900">₹{order.totalAmount.toLocaleString()}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      <span className={`block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setViewingOrder(order)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(order)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
            <ShoppingCart className="w-full h-full" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No purchase orders found</h3>
          <p className="text-gray-600 mb-4">Create your first purchase order to get started</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Create First Order
          </button>
        </div>
      )}
    </div>
  );
}