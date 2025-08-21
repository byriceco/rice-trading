import React, { useMemo, useState } from 'react';

export function ProductList() {
  const [searchTerm, setSearchTerm] = useState('');
  // Demo data
  const [products] = useState(() => [
    { id: 'p1', name: 'Basmati 1121', brand: 'Golden Harvest', category: 'Rice', sku: 'BAS-1121-50', unit: 'kg', price: 95 },
    { id: 'p2', name: 'Sona Masuri Premium', brand: 'ACI', category: 'Rice', sku: 'SON-PRE-25', unit: 'kg', price: 72 },
  ]);

  const filtered = useMemo(() => {
    const t = searchTerm.toLowerCase();
    return products.filter(p => p.name.toLowerCase().includes(t) || p.brand.toLowerCase().includes(t) || p.category.toLowerCase().includes(t) || p.sku.toLowerCase().includes(t));
  }, [products, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Add Product</button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <input className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Search by name, brand, category, SKU" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{p.brand}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{p.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{p.sku}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{p.unit}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">৳{p.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
