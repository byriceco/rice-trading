import React, { useMemo, useState } from 'react';
import { DollarSign, Plus, TrendingUp, TrendingDown, CreditCard, Wallet } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import type { Transaction } from '../../contexts/DataContext';

export function Finance() {
  const { transactions, addTransaction, suppliers, customers, purchaseOrders, salesOrders } = useData();
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'receivables' | 'payables'>('overview');

  const [formData, setFormData] = useState({
    type: 'expense' as 'income' | 'expense',
    category: '',
    description: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    reference: ''
  });

  const expenseCategories = ['Transport', 'Labor', 'Packaging', 'Storage Rent', 'Utilities', 'Office Expenses', 'Other'];
  const incomeCategories = ['Sales', 'Interest', 'Other Income'];

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const netProfit = totalIncome - totalExpenses;

  const totalReceivables = customers.reduce((sum, customer) => sum + customer.balance, 0);
  const totalPayables = suppliers.reduce((sum, supplier) => sum + supplier.balance, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTransaction(formData);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      type: 'expense',
      category: '',
      description: '',
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      reference: ''
    });
    setShowForm(false);
  };

  const recentTransactions = transactions.slice(-10).reverse();

  const dailySeries = useMemo(() => {
    const byDate: Record<string, { date: string; income: number; expense: number }> = {};
    transactions.forEach((t) => {
      if (!byDate[t.date]) byDate[t.date] = { date: t.date, income: 0, expense: 0 };
      if (t.type === 'income') byDate[t.date].income += t.amount;
      else byDate[t.date].expense += t.amount;
    });
    const series = Object.values(byDate).sort((a, b) => a.date.localeCompare(b.date));
    return series.slice(-14);
  }, [transactions]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Finance & Accounting</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Transaction
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Income</p>
              <p className="text-2xl font-bold text-green-600">৳{totalIncome.toLocaleString()}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600">৳{totalExpenses.toLocaleString()}</p>
            </div>
            <TrendingDown className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Net Profit</p>
              <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ৳{netProfit.toLocaleString()}
              </p>
            </div>
            <DollarSign className={`w-8 h-8 ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`} />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cash Flow</p>
              <p className={`text-2xl font-bold ${(totalReceivables - totalPayables) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ৳{(totalReceivables - totalPayables).toLocaleString()}
              </p>
            </div>
            <Wallet className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Trend Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Income vs Expense (last 14 days)</h3>
        <div className="w-full h-64">
          {/* Lazy import to avoid SSR issues */}
          {/* @ts-ignore */}
          <FinanceChart data={dailySeries} />
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'transactions', label: 'Transactions' },
              { key: 'receivables', label: 'Receivables' },
              { key: 'payables', label: 'Payables' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Receivables Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Total Receivables</span>
                      <span className="font-semibold text-green-600">৳{totalReceivables.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Active Customers</span>
                      <span className="font-semibold text-gray-900">{customers.filter(c => c.status === 'active').length}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Payables Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Total Payables</span>
                      <span className="font-semibold text-red-600">৳{totalPayables.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Active Suppliers</span>
                      <span className="font-semibold text-gray-900">{suppliers.filter(s => s.status === 'active').length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
              <div className="space-y-3">
                {recentTransactions.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No transactions recorded yet</p>
                ) : (
                  recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-3 ${
                          transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                        <div>
                          <p className="font-medium text-gray-900">{transaction.description}</p>
                          <p className="text-sm text-gray-500">{transaction.category} • {transaction.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${
                          transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}৳{transaction.amount.toLocaleString()}
                        </p>
                        {transaction.reference && (
                          <p className="text-sm text-gray-500">{transaction.reference}</p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'receivables' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Customer Receivables</h3>
              <div className="space-y-3">
                {customers.filter(c => c.balance > 0).map((customer) => (
                  <div key={customer.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{customer.name}</p>
                      <p className="text-sm text-gray-500">{customer.contact}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">৳{customer.balance.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">Credit Limit: ৳{customer.creditLimit.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
                {customers.filter(c => c.balance > 0).length === 0 && (
                  <p className="text-gray-500 text-center py-8">No outstanding receivables</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'payables' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Supplier Payables</h3>
              <div className="space-y-3">
                {suppliers.filter(s => s.balance > 0).map((supplier) => (
                  <div key={supplier.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{supplier.name}</p>
                      <p className="text-sm text-gray-500">{supplier.contact}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-red-600">৳{supplier.balance.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
                {suppliers.filter(s => s.balance > 0).length === 0 && (
                  <p className="text-gray-500 text-center py-8">No outstanding payables</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Transaction Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Add Transaction</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'income' | 'expense', category: '' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Category</option>
                  {(formData.type === 'expense' ? expenseCategories : incomeCategories).map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
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
                  Reference (Optional)
                </label>
                <input
                  type="text"
                  value={formData.reference}
                  onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Invoice number, receipt, etc."
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
                  Add Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Inline chart component to keep file count low
const FinanceChart = ({ data }: { data: Array<{ date: string; income: number; expense: number }> }) => {
  // Import inside to avoid breaking build if recharts tree-shaking changes
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend } = require('recharts');
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="income" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#16a34a" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="expense" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#dc2626" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Legend />
        <Area type="monotone" dataKey="income" stroke="#16a34a" fillOpacity={1} fill="url(#income)" name="Income" />
        <Area type="monotone" dataKey="expense" stroke="#dc2626" fillOpacity={1} fill="url(#expense)" name="Expense" />
      </AreaChart>
    </ResponsiveContainer>
  );
};