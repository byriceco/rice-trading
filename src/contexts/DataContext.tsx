import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  address: string;
  phone: string;
  email: string;
  balance: number;
  status: 'active' | 'inactive';
  openingBalance: number;
  creditLimit: number;
  supplierCode?: string;
  binVat?: string; // Bangladesh VAT/BIN
  tin?: string;    // Tax Identification Number
  paymentTerms?: string;
  city?: string;
  district?: string;
  postalCode?: string;
  notes?: string;
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  supplierName: string;
  date: string;
  riceType: string;
  grade: string;
  bagSize: number;
  quantity: number;
  weightKg: number;
  pricePerKg: number;
  totalAmount: number;
  status: 'pending' | 'received' | 'cancelled';
  paymentStatus: 'pending' | 'partial' | 'paid';
  paidAmount: number;
}

export interface Customer {
  id: string;
  name: string;
  contact: string;
  address: string;
  phone: string;
  email: string;
  balance: number;
  creditLimit: number;
  status: 'active' | 'inactive';
}

export interface SalesOrder {
  id: string;
  customerId: string;
  customerName: string;
  date: string;
  riceType: string;
  grade: string;
  bagSize: number;
  quantity: number;
  weightKg: number;
  pricePerKg: number;
  totalAmount: number;
  status: 'pending' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'partial' | 'paid';
  receivedAmount: number;
}

export interface InventoryItem {
  id: string;
  riceType: string;
  grade: string;
  bagSize: number;
  quantity: number;
  weightKg: number;
  warehouse: string;
  costPerKg: number;
  lastUpdated: string;
}

export interface StockTransfer {
  id: string;
  from: string;
  to: string;
  riceType: string;
  grade: string;
  bagSize: number;
  quantity: number;
  weightKg: number;
  date: string;
  status: 'pending' | 'completed';
  reason: string;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  description: string;
  amount: number;
  date: string;
  reference?: string;
}

interface DataContextType {
  suppliers: Supplier[];
  addSupplier: (supplier: Omit<Supplier, 'id'>) => void;
  updateSupplier: (id: string, supplier: Partial<Supplier>) => void;
  
  purchaseOrders: PurchaseOrder[];
  addPurchaseOrder: (po: Omit<PurchaseOrder, 'id'>) => void;
  updatePurchaseOrder: (id: string, po: Partial<PurchaseOrder>) => void;
  
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id'>) => void;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  
  salesOrders: SalesOrder[];
  addSalesOrder: (so: Omit<SalesOrder, 'id'>) => void;
  updateSalesOrder: (id: string, so: Partial<SalesOrder>) => void;
  
  inventory: InventoryItem[];
  updateInventory: (id: string, item: Partial<InventoryItem>) => void;
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
  
  stockTransfers: StockTransfer[];
  addStockTransfer: (transfer: Omit<StockTransfer, 'id'>) => void;
  updateStockTransfer: (id: string, transfer: Partial<StockTransfer>) => void;
  
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Demo data
const DEMO_SUPPLIERS: Supplier[] = [
  {
    id: '1',
    name: 'Narayanganj Rice Mills',
    contact: 'Md. Rahman',
    address: 'Narayanganj, Dhaka',
    phone: '+8801712345678',
    email: 'rahman@nricemills.com',
    balance: 125000,
    status: 'active',
    openingBalance: 125000,
    creditLimit: 500000,
    binVat: '001234567-0101',
    tin: '1234567890',
    paymentTerms: 'Net 15',
    city: 'Narayanganj',
    district: 'Dhaka',
    postalCode: '1400'
  },
  {
    id: '2',
    name: 'Chattogram Grains',
    contact: 'Abdul Karim',
    address: 'Agrabad, Chattogram',
    phone: '+8801812345678',
    email: 'karim@ctggrains.com',
    balance: 85000,
    status: 'active',
    openingBalance: 85000,
    creditLimit: 350000,
    binVat: '009876543-0202',
    tin: '9876543210',
    paymentTerms: 'Net 30',
    city: 'Chattogram',
    district: 'Chattogram',
    postalCode: '4000'
  },
  {
    id: '3',
    name: 'Sylhet Rice Traders',
    contact: 'Shahidul Islam',
    address: 'Zindabazar, Sylhet',
    phone: '+8801912345678',
    email: 'shahidul@sylhetrice.com',
    balance: 45000,
    status: 'active',
    openingBalance: 45000,
    creditLimit: 250000,
    paymentTerms: 'Advance',
    city: 'Sylhet',
    district: 'Sylhet',
    postalCode: '3100'
  },
];

const DEMO_CUSTOMERS: Customer[] = [
  { id: '1', name: 'Delhi Wholesale Market', contact: 'Ramesh Gupta', address: 'Azadpur, Delhi', phone: '+91-9876543220', email: 'ramesh@delhiwholesale.com', balance: 75000, creditLimit: 200000, status: 'active' },
  { id: '2', name: 'Mumbai Rice Distributors', contact: 'Prakash Patel', address: 'Vashi, Mumbai', phone: '+91-9876543221', email: 'prakash@mumbairice.com', balance: 125000, creditLimit: 300000, status: 'active' },
  { id: '3', name: 'Bangalore Supermarkets', contact: 'Venkat Rao', address: 'Whitefield, Bangalore', phone: '+91-9876543222', email: 'venkat@blrsuper.com', balance: 50000, creditLimit: 150000, status: 'active' },
];

const DEMO_INVENTORY: InventoryItem[] = [
  { id: '1', riceType: 'Basmati', grade: '1121', bagSize: 50, quantity: 200, weightKg: 10000, warehouse: 'Main Warehouse', costPerKg: 85, lastUpdated: '2025-01-18' },
  { id: '2', riceType: 'Basmati', grade: 'Pusa', bagSize: 25, quantity: 150, weightKg: 3750, warehouse: 'Main Warehouse', costPerKg: 72, lastUpdated: '2025-01-17' },
  { id: '3', riceType: 'Sona Masuri', grade: 'Premium', bagSize: 50, quantity: 300, weightKg: 15000, warehouse: 'Secondary Warehouse', costPerKg: 65, lastUpdated: '2025-01-18' },
  { id: '4', riceType: 'IR64', grade: 'Standard', bagSize: 50, quantity: 400, weightKg: 20000, warehouse: 'Main Warehouse', costPerKg: 45, lastUpdated: '2025-01-16' },
];

export function DataProvider({ children }: { children: ReactNode }) {
  const [suppliers, setSuppliers] = useState<Supplier[]>(DEMO_SUPPLIERS);
  const [customers, setCustomers] = useState<Customer[]>(DEMO_CUSTOMERS);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>(DEMO_INVENTORY);
  const [stockTransfers, setStockTransfers] = useState<StockTransfer[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addSupplier = (supplier: Omit<Supplier, 'id'>) => {
    setSuppliers(prev => [...prev, { ...supplier, id: generateId() }]);
  };

  const updateSupplier = (id: string, supplier: Partial<Supplier>) => {
    setSuppliers(prev => prev.map(s => s.id === id ? { ...s, ...supplier } : s));
  };

  const addCustomer = (customer: Omit<Customer, 'id'>) => {
    setCustomers(prev => [...prev, { ...customer, id: generateId() }]);
  };

  const updateCustomer = (id: string, customer: Partial<Customer>) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...customer } : c));
  };

  const addPurchaseOrder = (po: Omit<PurchaseOrder, 'id'>) => {
    setPurchaseOrders(prev => [...prev, { ...po, id: generateId() }]);
  };

  const updatePurchaseOrder = (id: string, po: Partial<PurchaseOrder>) => {
    setPurchaseOrders(prev => prev.map(p => p.id === id ? { ...p, ...po } : p));
  };

  const addSalesOrder = (so: Omit<SalesOrder, 'id'>) => {
    setSalesOrders(prev => [...prev, { ...so, id: generateId() }]);
  };

  const updateSalesOrder = (id: string, so: Partial<SalesOrder>) => {
    setSalesOrders(prev => prev.map(s => s.id === id ? { ...s, ...so } : s));
  };

  const updateInventory = (id: string, item: Partial<InventoryItem>) => {
    setInventory(prev => prev.map(i => i.id === id ? { ...i, ...item } : i));
  };

  const addInventoryItem = (item: Omit<InventoryItem, 'id'>) => {
    setInventory(prev => [...prev, { ...item, id: generateId() }]);
  };

  const addStockTransfer = (transfer: Omit<StockTransfer, 'id'>) => {
    setStockTransfers(prev => [...prev, { ...transfer, id: generateId() }]);
  };

  const updateStockTransfer = (id: string, transfer: Partial<StockTransfer>) => {
    setStockTransfers(prev => prev.map(t => t.id === id ? { ...t, ...transfer } : t));
  };

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    setTransactions(prev => [...prev, { ...transaction, id: generateId() }]);
  };

  return (
    <DataContext.Provider value={{
      suppliers,
      addSupplier,
      updateSupplier,
      purchaseOrders,
      addPurchaseOrder,
      updatePurchaseOrder,
      customers,
      addCustomer,
      updateCustomer,
      salesOrders,
      addSalesOrder,
      updateSalesOrder,
      inventory,
      updateInventory,
      addInventoryItem,
      stockTransfers,
      addStockTransfer,
      updateStockTransfer,
      transactions,
      addTransaction,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}