// Fix: Created the TableSelectionScreen component to allow users to select a table.
import React from 'react';
import { Order, ShiftReport, InventoryItem } from '../types';
import { UserGroupIcon, StarIcon, ExclamationTriangleIcon, KeyIcon } from './icons';

type Area = 'Bar' | 'VIP' | 'Barra';

interface TableSelectionScreenProps {
  orders: Order[];
  activeShift: ShiftReport | undefined;
  onSelectTable: (tableId: number, area: Area) => void;
  onOpenTableActions: (order: Order) => void;
  selectedArea: Area;
  setSelectedArea: (area: Area) => void;
  t: (key: string) => string;
  inventory: InventoryItem[];
  onOpenDrawer: () => void;
}

const TableSelectionScreen: React.FC<TableSelectionScreenProps> = ({ orders, activeShift, onSelectTable, onOpenTableActions, selectedArea, setSelectedArea, t, inventory, onOpenDrawer }) => {
  const areas: { name: Area; tables: number; icon: React.FC<any>; startId: number }[] = [
    { name: 'Bar', tables: 20, icon: UserGroupIcon, startId: 1 },
    { name: 'VIP', tables: 20, icon: StarIcon, startId: 21 },
    { name: 'Barra', tables: 20, icon: UserGroupIcon, startId: 41 },
  ];
  
  const lowStockItemsCount = inventory.filter(item => item.quantity <= item.lowStockThreshold).length;

  const getTableStatus = (tableId: number, area: Area) => {
    const order = orders.find(o => 
        o.tableNumber === tableId && 
        o.area === area && 
        o.status !== 'paid' && 
        o.status !== 'cancelled' &&
        o.status !== 'on_credit' &&
        activeShift && new Date(o.timestamp) >= new Date(activeShift.dayOpenedTimestamp)
    );
    if (!order) return { status: 'available', order: null };
    return { status: order.status, order: order };
  };

  interface TableButtonProps {
    tableId: number;
    area: Area;
  }
  const TableButton: React.FC<TableButtonProps> = ({ tableId, area }) => {
    const { status, order } = getTableStatus(tableId, area);
    
    let bgColor = 'bg-green-600 hover:bg-green-700 focus:scale-105';
    let textColor = 'text-white';
    let statusText = null;

    switch (status) {
        case 'pending':
            bgColor = 'bg-yellow-500';
            statusText = t('pending');
            break;
        case 'preparing':
            bgColor = 'bg-blue-500';
            statusText = t('preparing');
            break;
        case 'ready':
            bgColor = 'bg-purple-500';
            statusText = t('readyToPay');
            break;
        case 'available':
        default:
           break;
    }
    
    const handleClick = () => {
        if (status === 'available') {
            onSelectTable(tableId, area);
        } else if (order) {
            onOpenTableActions(order);
        }
    }

    return (
      <button
        onClick={handleClick}
        className={`p-2 rounded-lg flex flex-col items-center justify-center transition-all duration-200 aspect-square ${textColor} ${bgColor} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-400 disabled:opacity-70 disabled:cursor-not-allowed`}
      >
        <span className="text-xl font-bold">{tableId}</span>
        {statusText && <span className="text-xs mt-1">{statusText}</span>}
      </button>
    );
  };

  return (
    <div className="h-full flex flex-col p-4 bg-gray-800 text-white">
        {/* Top Header: Alerts & Main Actions */}
        <div className="flex-shrink-0 flex justify-between items-center mb-4">
            <div className="flex-1">
                {lowStockItemsCount > 0 && (
                    <div className="inline-flex items-center gap-3 bg-yellow-500/20 text-yellow-300 px-5 py-3 rounded-full border border-yellow-500/30 shadow-md animate-pulse">
                        <ExclamationTriangleIcon className="w-7 h-7" />
                        <span className="font-semibold">{t('lowStockAlerts')}: {lowStockItemsCount}</span>
                    </div>
                )}
            </div>
            <div className="flex-1 flex justify-end">
                <button
                    onClick={onOpenDrawer}
                    className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-8 rounded-lg flex items-center gap-3 text-lg transition-transform duration-200 ease-in-out hover:scale-105 shadow-lg"
                    aria-label={t('openCashDrawer')}
                >
                    <KeyIcon className="w-8 h-8" />
                    <span>{t('openCashDrawer')}</span>
                </button>
            </div>
        </div>
        
        {/* Area Navigation */}
        <div className="flex-shrink-0 border-b border-gray-700 mb-4">
            <nav className="-mb-px flex space-x-4 rtl:space-x-reverse" aria-label="Tabs">
                {areas.map((area) => (
                <button
                    key={area.name}
                    onClick={() => setSelectedArea(area.name)}
                    className={`${
                    selectedArea === area.name
                        ? 'border-orange-500 text-orange-500'
                        : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                    } whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
                >
                    <area.icon className="w-5 h-5"/>
                    {t(area.name.toLowerCase())}
                </button>
                ))}
            </nav>
        </div>

        {/* Tables Grid */}
        <div className="flex-grow overflow-y-auto">
             <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-10 gap-3">
              {(() => {
                  const areaData = areas.find(a => a.name === selectedArea)!;
                  return Array.from({ length: areaData.tables }, (_, i) => areaData.startId + i).map(tableId => (
                      <TableButton key={tableId} tableId={tableId} area={selectedArea} />
                  ));
              })()}
            </div>
        </div>
    </div>
  );
};

export default TableSelectionScreen;