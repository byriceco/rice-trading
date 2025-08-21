import React, { useState } from 'react';
import { ArrowRightLeft, Plus, Search, Filter, Eye } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import type { StockTransfer } from '../../contexts/DataContext';

export function StockTransfers() {
  const { stockTransfers, addStockTransfer, updateStockTransfer, inventory } = useData();
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewingTransfer, setViewingTransfer] = useState<StockTransfer | null>(null);

  const [formData, setFormData] = useState({
    from: 'Main Warehouse',
    to: 'Secondary Warehouse',
    riceType: 'Basmati',
    grade: '1121',
    bagSize: 50,
    quantity: 0,
    weightKg: 0,
    reason: ''
  });

  const warehouses = ['Main Warehouse', 'Secondary Warehouse', 'Cold Storage'];
  const riceTypes = ['Basmati', 'Sona Masuri', 'IR64', 'Ponni', 'Jeera', 'Other'];

  const filteredTransfers = stockTransfers.filter(transfer => {
    const matchesSearch = transfer.riceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transfer.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transfer.to.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || transfer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const transferData = {
      ...formData,
      date: new Date().toISOString().split('T')[0],
      status: 'pending' as 'pending' | 'completed'
    };

    addStockTransfer(transferData);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      from: 'Main Warehouse',
      to: 'Secondary Warehouse',
      riceType: 'Basmati',
      grade: '1121',
      bagSize: 50,
      quantity: 0,
      weightKg: 0,
      reason: ''
    });
    setShowForm(false);
  };

  const handleCompleteTransfer = (transfer: StockTransfer) => {
    updateStockTransfer(transfer.id, { status: 'completed' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Stock Transfers</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Transfer
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search transfers..."
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
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transfer Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Create Stock Transfer</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    From Warehouse
                  </label>
                  <select
                    value={formData.from}
                    onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {warehouses.map(warehouse => (
                      <option key={warehouse} value={warehouse}>{warehouse}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To Warehouse
                  </label>
                  <select
                    value={formData.to}
                    onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {warehouses.filter(w => w !== formData.from).map(warehouse => (
                      <option key={warehouse} value={warehouse}>{warehouse}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rice Type
                </label>
                <select
                  value={formData.riceType}
                  onChange={(e) => setFormData({ ...formData, riceType: e.target.value })}
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
                <input
                  type="text"
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
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
                  Reason for Transfer
                </label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  required
                />
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
                  Create Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Transfer Modal */}
      {viewingTransfer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Transfer Details</h2>
            <div className="space-y-3">
              <div><span className="font-medium">Transfer ID:</span> {viewingTransfer.id}</div>
              <div><span className="font-medium">From:</span> {viewingTransfer.from}</div>
              <div><span className="font-medium">To:</span> {viewingTransfer.to}</div>
              <div><span className="font-medium">Rice Type:</span> {viewingTransfer.riceType} - {viewingTransfer.grade}</div>
              <div><span className="font-medium">Quantity:</span> {viewingTransfer.quantity} bags ({viewingTransfer.bagSize}kg each)</div>
              <div><span className="font-medium">Total Weight:</span> {viewingTransfer.weightKg} kg</div>
              <div><span className="font-medium">Date:</span> {viewingTransfer.date}</div>
              <div><span className="font-medium">Status:</span> 
                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(viewingTransfer.status)}`}>
                  {viewingTransfer.status}
                </span>
              </div>
              <div><span className="font-medium">Reason:</span> {viewingTransfer.reason}</div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              {viewingTransfer.status === 'pending' && (
                <button
                  onClick={() => {
                    handleCompleteTransfer(viewingTransfer);
                    setViewingTransfer(null);
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Mark Complete
                </button>
              )}
              <button
                onClick={() => setViewingTransfer(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transfers Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transfer Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rice & Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
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
              {filteredTransfers.map((transfer) => (
                <tr key={transfer.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{transfer.from}</div>
                        <div className="flex items-center text-sm text-gray-500">
                          <ArrowRightLeft className="w-3 h-3 mr-1" />
                          {transfer.to}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{transfer.riceType} - {transfer.grade}</div>
                      <div className="text-sm text-gray-500">{transfer.quantity} bags × {transfer.bagSize}kg</div>
                      <div className="text-sm text-gray-500">{transfer.weightKg} kg total</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{transfer.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transfer.status)}`}>
                      {transfer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setViewingTransfer(transfer)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {transfer.status === 'pending' && (
                        <button
                          onClick={() => handleCompleteTransfer(transfer)}
                          className="text-green-600 hover:text-green-900 text-xs"
                        >
                          Complete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredTransfers.length === 0 && (
        <div className="text-center py-12">
          <ArrowRightLeft className="w-24 h-24 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No stock transfers found</h3>
          <p className="text-gray-600 mb-4">Create your first stock transfer to get started</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Create First Transfer
          </button>
        </div>
      )}
    </div>
  );
}