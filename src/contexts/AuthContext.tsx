import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'procurement' | 'sales' | 'accountant' | 'warehouse' | 'manager';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USERS: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@ricetrade.com', role: 'admin' },
  { id: '2', name: 'Procurement Officer', email: 'procurement@ricetrade.com', role: 'procurement' },
  { id: '3', name: 'Sales Manager', email: 'sales@ricetrade.com', role: 'sales' },
  { id: '4', name: 'Accountant', email: 'finance@ricetrade.com', role: 'accountant' },
  { id: '5', name: 'Warehouse Manager', email: 'warehouse@ricetrade.com', role: 'warehouse' },
];

const ROLE_PERMISSIONS = {
  admin: ['all'],
  procurement: ['suppliers', 'purchase_orders', 'inventory_read'],
  sales: ['customers', 'sales_orders', 'inventory_read'],
  accountant: ['finance', 'reports', 'customers_read', 'suppliers_read'],
  warehouse: ['inventory', 'stock_transfers', 'logistics'],
  manager: ['reports', 'dashboard', 'all_read']
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Demo login - accept any password for demo users
    const foundUser = DEMO_USERS.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    const userPermissions = ROLE_PERMISSIONS[user.role] || [];
    return userPermissions.includes('all') || userPermissions.includes(permission);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      logout,
      hasPermission
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}