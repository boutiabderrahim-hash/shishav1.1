// Fix: Defined and exported all shared types to resolve circular dependency and module import errors.

export type Language = 'es' | 'ar';
export type UserRole = 'ADMIN' | 'MANAGER' | null;

export interface Category {
  id: string;
  name: string;
}

export interface Waiter {
  id: string;
  name: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  lowStockThreshold: number;
}

export interface CustomizationOption {
  id: string;
  name: string;
  priceModifier: number;
}

export interface CustomizationCategory {
  id: string;
  name: string;
  type: 'single' | 'multiple';
  options: CustomizationOption[];
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  categoryId: string;
  imageUrl: string;
  ingredients: string[];
  customizations?: CustomizationCategory[];
  stockItemId: string;
  stockConsumption: number;
}

export interface OrderItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  customizations: { [key: string]: CustomizationOption | CustomizationOption[] };
  removedIngredients: string[];
  totalPrice: number;
  discount?: number;
}

export type PaymentDetails = 
  | { method: 'cash' | 'card'; amount: number; }
  | { method: 'split'; cashAmount: number; cardAmount: number; };

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'paid' | 'cancelled' | 'on_credit';

export interface Order {
  id: number;
  tableNumber: number;
  area: 'Bar' | 'VIP' | 'Barra';
  waiterId: string;
  items: OrderItem[];
  status: OrderStatus;
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
  timestamp: Date;
  paymentDetails?: PaymentDetails;
  customerName?: string;
}

export interface HeldOrder {
  tableNumber: number;
  area: 'Bar' | 'VIP' | 'Barra';
  waiterId: string;
  items: OrderItem[];
  notes?: string;
  timestamp: Date;
}

export interface Transaction {
    id: string;
    type: 'sale' | 'manual';
    paymentMethod: 'cash' | 'card';
    orderId?: number;
    amount: number;
    tax: number | null;
    description: string;
    timestamp: Date;
    taxable: boolean;
}

export interface ShiftReport {
    id: string;
    status: 'OPEN' | 'CLOSED';
    dayOpenedTimestamp: string;
    dayClosedTimestamp: string | null;
    openingBalance: number;
    cashSales: number;
    cardSales: number;
    manualIncomeCash: number;
    manualIncomeCard: number;
    totalTax: number;
    finalCashSales?: number;
    finalCardSales?: number;
    finalManualIncomeCash?: number;
    finalManualIncomeCard?: number;
    finalTotalRevenue?: number;
    finalTotalTax?: number;
}