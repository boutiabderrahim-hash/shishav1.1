import React from 'react';
import { Order, InventoryItem } from '../types';
import { formatCurrency } from '../utils/helpers';

interface DashboardProps {
  orders: Order[];
  inventory: InventoryItem[];
  t: (key: string) => string;
}

const Dashboard: React.FC<DashboardProps> = ({ orders, inventory, t }) => {
  const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);
  const totalOrders = orders.length;
  const lowStockItems = inventory.filter(item => item.quantity <= item.lowStockThreshold);

  return (
    <div className="p-6 bg-gray-100 h-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">{t('dashboard')}</h2>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-600">{t('totalRevenue')}</h3>
                <p className="text-4xl font-bold text-green-600">{formatCurrency(totalRevenue)}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-600">{t('totalOrders')}</h3>
                <p className="text-4xl font-bold text-blue-600">{totalOrders}</p>
            </div>
        </div>

        {/* Low Stock Items */}
        <div>
            <h3 className="text-xl font-bold mb-4 text-gray-700">{t('lowStockAlerts')}</h3>
            {lowStockItems.length > 0 ? (
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full">
                <thead className="bg-gray-200">
                    <tr>
                    <th className="text-start py-3 px-4 font-semibold text-gray-600">{t('itemName')}</th>
                    <th className="text-start py-3 px-4 font-semibold text-gray-600">{t('quantityRemaining')}</th>
                    <th className="text-start py-3 px-4 font-semibold text-gray-600">{t('threshold')}</th>
                    </tr>
                </thead>
                <tbody>
                    {lowStockItems.map(item => (
                    <tr key={item.id} className="border-b hover:bg-red-50">
                        <td className="py-3 px-4">{item.name}</td>
                        <td className="py-3 px-4 text-red-600 font-bold">{item.quantity} {item.unit}</td>
                        <td className="py-3 px-4">{item.lowStockThreshold} {item.unit}</td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            ) : (
            <div className="bg-white p-6 rounded-lg shadow">
              <p className="text-gray-500">{t('noLowStockItems')}</p>
            </div>
            )}
        </div>
    </div>
  );
};

export default Dashboard;
