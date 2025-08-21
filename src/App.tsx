import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Dashboard } from './components/dashboard/Dashboard';
import { Suppliers } from './components/procurement/Suppliers';
import { SupplierFormPage } from './components/procurement/SupplierFormPage';
import { PurchaseOrders } from './components/procurement/PurchaseOrders';
import { PurchaseOrderFormPage } from './components/procurement/PurchaseOrderFormPage';
import { Inventory } from './components/inventory/Inventory';
import { StockTransfers } from './components/inventory/StockTransfers';
import { Customers } from './components/sales/Customers';
import { SalesOrders } from './components/sales/SalesOrders';
import { Finance } from './components/finance/Finance';
import { Logistics } from './components/logistics/Logistics';
import { Reports } from './components/reports/Reports';
import { UserManagement } from './components/admin/UserManagement';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { LoginPage } from './components/auth/LoginPage';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <Router>
      <div className="flex h-screen bg-gray-50">
        <Sidebar collapsed={sidebarCollapsed} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header 
            onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} 
            sidebarCollapsed={sidebarCollapsed}
          />
          <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/suppliers" element={<Suppliers />} />
              <Route path="/suppliers/new" element={<SupplierFormPage />} />
              <Route path="/purchase-orders" element={<PurchaseOrders />} />
              <Route path="/purchase-orders/new" element={<PurchaseOrderFormPage />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/stock-transfers" element={<StockTransfers />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/sales-orders" element={<SalesOrders />} />
              <Route path="/finance" element={<Finance />} />
              <Route path="/logistics" element={<Logistics />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/users" element={<UserManagement />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}

export default App;