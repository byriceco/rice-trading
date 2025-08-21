import React from 'react';
import { 
  Package, 
  Users, 
  ShoppingCart, 
  Receipt, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  DollarSign
} from 'lucide-react';
import { useData } from '../../contexts/DataContext';

export function Dashboard() {
  const { suppliers, customers, purchaseOrders, salesOrders, inventory, transactions } = useData();

  const totalInventoryValue = inventory.reduce((sum, item) => sum + (item.weightKg * item.costPerKg), 0);
  const totalSales = salesOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalPurchases = purchaseOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const pendingPayments = customers.reduce((sum, customer) => sum + customer.balance, 0);
  const pendingReceivables = suppliers.reduce((sum, supplier) => sum + supplier.balance, 0);
  
  const lowStockItems = inventory.filter(item => item.quantity < 50);
  const recentTransactions = transactions.slice(-5).reverse();

  const metrics = [
    {
      title: 'Total Inventory Value',
      value: `৳${totalInventoryValue.toLocaleString()}`,
      change: '+12.5%',
      trend: 'up',
      icon: Package,
      color: 'blue'
    },
    {
      title: 'Total Sales',
      value: `৳${totalSales.toLocaleString()}`,
      change: '+8.2%',
      trend: 'up',
      icon: Receipt,
      color: 'green'
    },
    {
      title: 'Active Suppliers',
      value: suppliers.filter(s => s.status === 'active').length.toString(),
      change: '+2',
      trend: 'up',
      icon: Users,
      color: 'purple'
    },
    {
      title: 'Pending Receivables',
      value: `৳${pendingReceivables.toLocaleString()}`,
      change: '-5.1%',
      trend: 'down',
      icon: DollarSign,
      color: 'orange'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          const isPositive = metric.trend === 'up';
          
          return (
            <div key={metric.title} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{metric.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  metric.color === 'blue' ? 'bg-blue-50' :
                  metric.color === 'green' ? 'bg-green-50' :
                  metric.color === 'purple' ? 'bg-purple-50' : 'bg-orange-50'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    metric.color === 'blue' ? 'text-blue-600' :
                    metric.color === 'green' ? 'text-green-600' :
                    metric.color === 'purple' ? 'text-purple-600' : 'text-orange-600'
                  }`} />
                </div>
              </div>
              <div className="flex items-center mt-4">
                {isPositive ? (
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {metric.change}
                </span>
                <span className="text-sm text-gray-500 ml-1">vs last month</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alert */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Low Stock Alert</h2>
            <AlertTriangle className="w-5 h-5 text-orange-500" />
          </div>
          <div className="space-y-3">
            {lowStockItems.length === 0 ? (
              <p className="text-sm text-gray-500">All items are well-stocked</p>
            ) : (
              lowStockItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{item.riceType} - {item.grade}</p>
                    <p className="text-sm text-gray-600">{item.warehouse}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-orange-600">{item.quantity} bags</p>
                    <p className="text-sm text-gray-500">{item.weightKg} kg</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total Customers</span>
              <span className="font-semibold text-gray-900">{customers.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Active Purchase Orders</span>
              <span className="font-semibold text-gray-900">
                {purchaseOrders.filter(po => po.status !== 'cancelled').length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Active Sales Orders</span>
              <span className="font-semibold text-gray-900">
                {salesOrders.filter(so => so.status !== 'cancelled').length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total Inventory Items</span>
              <span className="font-semibold text-gray-900">{inventory.length}</span>
            </div>
            <div className="flex items-center justify-between border-t pt-4">
              <span className="text-gray-600">Gross Profit Margin</span>
              <span className="font-semibold text-green-600">
                {totalSales > 0 ? ((totalSales - totalPurchases) / totalSales * 100).toFixed(1) : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {recentTransactions.length === 0 ? (
            <p className="text-sm text-gray-500">No recent transactions</p>
          ) : (
            recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-3 ${
                    transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <div>
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                    <p className="text-sm text-gray-500">{transaction.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                  {transaction.type === 'income' ? '+' : '-'}৳{transaction.amount.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">{transaction.date}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}