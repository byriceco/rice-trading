import React, { useMemo, useState } from 'react';

export function BrandList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [brands] = useState(() => [
    { id: 'b1', name: 'Golden Harvest', products: 12 },
    { id: 'b2', name: 'ACI', products: 8 },
  ]);

  const filtered = useMemo(() => {
    const t = searchTerm.toLowerCase();
    return brands.filter(b => b.name.toLowerCase().includes(t));
  }, [brands, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Brands</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Add Brand</button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <input className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Search brand" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.map(b => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{b.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{b.products}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
