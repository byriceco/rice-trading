import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  Users, 
  ShoppingCart, 
  Package, 
  ArrowRightLeft,
  UserCheck,
  Receipt,
  DollarSign,
  Truck,
  BarChart3,
  Settings,
  Tags,
  LayoutGrid,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  collapsed: boolean;
}

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  permission?: string;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', path: '/dashboard', icon: Home },
  { name: 'Suppliers', path: '/suppliers', icon: Users, permission: 'suppliers' },
  { name: 'Purchase Orders', path: '/purchase-orders', icon: ShoppingCart, permission: 'purchase_orders' },
  { name: 'Inventory', path: '/inventory', icon: Package, permission: 'inventory' },
  { name: 'Stock Transfers', path: '/stock-transfers', icon: ArrowRightLeft, permission: 'stock_transfers' },
  { name: 'Customers', path: '/customers', icon: UserCheck, permission: 'customers' },
  { name: 'Sales Orders', path: '/sales-orders', icon: Receipt, permission: 'sales_orders' },
  { name: 'Finance', path: '/finance', icon: DollarSign, permission: 'finance' },
  { name: 'Products', path: '/products', icon: Package, permission: 'inventory' },
  { name: 'Brands', path: '/brands', icon: Tags, permission: 'inventory' },
  { name: 'Categories', path: '/categories', icon: LayoutGrid, permission: 'inventory' },
  { name: 'Logistics', path: '/logistics', icon: Truck, permission: 'logistics' },
  { name: 'Reports', path: '/reports', icon: BarChart3, permission: 'reports' },
  { name: 'User Management', path: '/users', icon: Settings, permission: 'all' },
];

export function Sidebar({ collapsed }: SidebarProps) {
  const { hasPermission, user } = useAuth();

  const filteredNavItems = navItems.filter(item => {
    if (!item.permission) return true;
    return hasPermission(item.permission) || hasPermission('all') || hasPermission(`${item.permission}_read`);
  });

  return (
    <div className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
      {/* Logo */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Package className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="ml-3">
              <h1 className="text-lg font-semibold text-gray-900">Rice Trade ERP</h1>
              <p className="text-xs text-gray-500">Trading Management</p>
            </div>
          )}
        </div>
      </div>

      {/* User Info */}
      {!collapsed && user && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-700">
                {user.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && <span className="ml-3">{item.name}</span>}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}