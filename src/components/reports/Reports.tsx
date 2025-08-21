import React, { useState } from 'react';
import { BarChart3, Download, Calendar, Filter, TrendingUp, Package, Users, DollarSign } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

export function Reports() {
  const { suppliers, customers, purchaseOrders, salesOrders, inventory, transactions } = useData();
  const [activeReport, setActiveReport] = useState<'sales' | 'purchase' | 'inventory' | 'financial'>('sales');
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });

  const reportTypes = [
    { key: 'sales', label: 'Sales Reports', icon: TrendingUp },
    { key: 'purchase', label: 'Purchase Reports', icon: Package },
    { key: 'inventory', label: 'Inventory Reports', icon: Package },
    { key: 'financial', label: 'Financial Reports', icon: DollarSign }
  ];

  // Filter data based on date range
  const filteredSalesOrders = salesOrders.filter(order => 
    order.date >= dateRange.from && order.date <= dateRange.to
  );
  const filteredPurchaseOrders = purchaseOrders.filter(order => 
    order.date >= dateRange.from && order.date <= dateRange.to
  );
  const filteredTransactions = transactions.filter(transaction => 
    transaction.date >= dateRange.from && transaction.date <= dateRange.to
  );

  // Calculate metrics
  const totalSales = filteredSalesOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalPurchases = filteredPurchaseOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalIncome = filteredTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = filteredTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

  // Group data for reports
  const salesByCustomer = filteredSalesOrders.reduce((acc, order) => {
    acc[order.customerName] = (acc[order.customerName] || 0) + order.totalAmount;
    return acc;
  }, {} as Record<string, number>);

  const purchasesBySupplier = filteredPurchaseOrders.reduce((acc, order) => {
    acc[order.supplierName] = (acc[order.supplierName] || 0) + order.totalAmount;
    return acc;
  }, {} as Record<string, number>);

  const salesByRiceType = filteredSalesOrders.reduce((acc, order) => {
    const key = `${order.riceType} - ${order.grade}`;
    acc[key] = (acc[key] || 0) + order.totalAmount;
    return acc;
  }, {} as Record<string, number>);

  const inventoryByWarehouse = inventory.reduce((acc, item) => {
    acc[item.warehouse] = (acc[item.warehouse] || 0) + (item.weightKg * item.costPerKg);
    return acc;
  }, {} as Record<string, number>);

  const renderSalesReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Total Sales</h3>
          <p className="text-3xl font-bold text-blue-600">৳{totalSales.toLocaleString()}</p>
          <p className="text-sm text-blue-700 mt-1">{filteredSalesOrders.length} orders</p>
        </div>
        <div className="bg-green-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-2">Average Order Value</h3>
          <p className="text-3xl font-bold text-green-600">
            ৳{filteredSalesOrders.length > 0 ? Math.round(totalSales / filteredSalesOrders.length).toLocaleString() : 0}
          </p>
        </div>
        <div className="bg-purple-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-purple-900 mb-2">Active Customers</h3>
          <p className="text-3xl font-bold text-purple-600">{Object.keys(salesByCustomer).length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales by Customer</h3>
          <div className="space-y-3">
            {Object.entries(salesByCustomer)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 5)
              .map(([customer, amount]) => (
                <div key={customer} className="flex justify-between items-center">
                  <span className="text-gray-700">{customer}</span>
                  <span className="font-semibold text-gray-900">৳{amount.toLocaleString()}</span>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales by Rice Type</h3>
          <div className="space-y-3">
            {Object.entries(salesByRiceType)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 5)
              .map(([riceType, amount]) => (
                <div key={riceType} className="flex justify-between items-center">
                  <span className="text-gray-700">{riceType}</span>
                  <span className="font-semibold text-gray-900">৳{amount.toLocaleString()}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPurchaseReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-orange-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-orange-900 mb-2">Total Purchases</h3>
          <p className="text-3xl font-bold text-orange-600">৳{totalPurchases.toLocaleString()}</p>
          <p className="text-sm text-orange-700 mt-1">{filteredPurchaseOrders.length} orders</p>
        </div>
        <div className="bg-red-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-900 mb-2">Average Purchase Value</h3>
          <p className="text-3xl font-bold text-red-600">
            ৳{filteredPurchaseOrders.length > 0 ? Math.round(totalPurchases / filteredPurchaseOrders.length).toLocaleString() : 0}
          </p>
        </div>
        <div className="bg-indigo-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-indigo-900 mb-2">Active Suppliers</h3>
          <p className="text-3xl font-bold text-indigo-600">{Object.keys(purchasesBySupplier).length}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Purchases by Supplier</h3>
        <div className="space-y-3">
          {Object.entries(purchasesBySupplier)
            .sort(([,a], [,b]) => b - a)
            .map(([supplier, amount]) => (
              <div key={supplier} className="flex justify-between items-center">
                <span className="text-gray-700">{supplier}</span>
                <span className="font-semibold text-gray-900">৳{amount.toLocaleString()}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  const renderInventoryReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-teal-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-teal-900 mb-2">Total Items</h3>
          <p className="text-3xl font-bold text-teal-600">{inventory.length}</p>
        </div>
        <div className="bg-cyan-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-cyan-900 mb-2">Total Weight</h3>
          <p className="text-3xl font-bold text-cyan-600">
            {inventory.reduce((sum, item) => sum + item.weightKg, 0).toLocaleString()} kg
          </p>
        </div>
        <div className="bg-emerald-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-emerald-900 mb-2">Total Value</h3>
          <p className="text-3xl font-bold text-emerald-600">
            ৳{inventory.reduce((sum, item) => sum + (item.weightKg * item.costPerKg), 0).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory by Warehouse</h3>
          <div className="space-y-3">
            {Object.entries(inventoryByWarehouse).map(([warehouse, value]) => (
              <div key={warehouse} className="flex justify-between items-center">
                <span className="text-gray-700">{warehouse}</span>
                <span className="font-semibold text-gray-900">৳{value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Low Stock Items</h3>
          <div className="space-y-3">
            {inventory
              .filter(item => item.quantity < 50)
              .sort((a, b) => a.quantity - b.quantity)
              .slice(0, 5)
              .map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <span className="text-gray-700">{item.riceType} - {item.grade}</span>
                  <span className="font-semibold text-red-600">{item.quantity} bags</span>
                </div>
              ))}
            {inventory.filter(item => item.quantity < 50).length === 0 && (
              <p className="text-gray-500 text-center py-4">All items are well-stocked</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderFinancialReport = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-green-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-2">Total Income</h3>
          <p className="text-3xl font-bold text-green-600">৳{totalIncome.toLocaleString()}</p>
        </div>
        <div className="bg-red-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-900 mb-2">Total Expenses</h3>
          <p className="text-3xl font-bold text-red-600">৳{totalExpenses.toLocaleString()}</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Net Profit</h3>
          <p className={`text-3xl font-bold ${(totalIncome - totalExpenses) >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
            ৳{(totalIncome - totalExpenses).toLocaleString()}
          </p>
        </div>
        <div className="bg-purple-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-purple-900 mb-2">Profit Margin</h3>
          <p className="text-3xl font-bold text-purple-600">
            {totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100).toFixed(1) : 0}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Outstanding Receivables</h3>
          <div className="space-y-3">
            {customers
              .filter(c => c.balance > 0)
              .sort((a, b) => b.balance - a.balance)
              .slice(0, 5)
              .map((customer) => (
                <div key={customer.id} className="flex justify-between items-center">
                  <span className="text-gray-700">{customer.name}</span>
                  <span className="font-semibold text-green-600">৳{customer.balance.toLocaleString()}</span>
                </div>
              ))}
            {customers.filter(c => c.balance > 0).length === 0 && (
              <p className="text-gray-500 text-center py-4">No outstanding receivables</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Outstanding Payables</h3>
          <div className="space-y-3">
            {suppliers
              .filter(s => s.balance > 0)
              .sort((a, b) => b.balance - a.balance)
              .slice(0, 5)
              .map((supplier) => (
                <div key={supplier.id} className="flex justify-between items-center">
                  <span className="text-gray-700">{supplier.name}</span>
                  <span className="font-semibold text-red-600">৳{supplier.balance.toLocaleString()}</span>
                </div>
              ))}
            {suppliers.filter(s => s.balance > 0).length === 0 && (
              <p className="text-gray-500 text-center py-4">No outstanding payables</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </button>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Date Range:</span>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Report Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {reportTypes.map((report) => {
              const Icon = report.icon;
              return (
                <button
                  key={report.key}
                  onClick={() => setActiveReport(report.key as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeReport === report.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {report.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeReport === 'sales' && renderSalesReport()}
          {activeReport === 'purchase' && renderPurchaseReport()}
          {activeReport === 'inventory' && renderInventoryReport()}
          {activeReport === 'financial' && renderFinancialReport()}
        </div>
      </div>
    </div>
  );
}