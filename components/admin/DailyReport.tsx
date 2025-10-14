import React from 'react';
import { ShiftReport, Order, Category, Waiter, Language } from '../../types';
import { formatCurrency } from '../../utils/helpers';
import { MoonIcon, SunIcon } from '../icons';

interface ShiftReportsProps {
    activeShift: ShiftReport | undefined;
    allShifts: ShiftReport[];
    orders: Order[];
    categories: Category[];
    waiters: Waiter[];
    dayStatus: 'OPEN' | 'CLOSED';
    t: (key: string) => string;
    lang: Language;
}

// Fix: Passed translation function 't' as a prop to resolve scope error.
const SimpleBarChart = ({ title, data, t, labelKey = 'name', valueKey = 'total' }: { title: string, data: any[], t: (key: string) => string, labelKey?: string, valueKey?: string }) => {
    const maxValue = Math.max(...data.map(item => item[valueKey]), 1); // Avoid division by zero
    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold text-lg mb-4">{title}</h3>
            <div className="space-y-3">
                {data.length > 0 ? data.map((item, index) => (
                    <div key={index} className="grid grid-cols-3 items-center gap-2 text-sm">
                        <div className="truncate font-semibold">{item[labelKey]}</div>
                        <div className="col-span-2">
                             <div className="w-full bg-gray-200 rounded-full h-5 relative">
                                <div 
                                    className="bg-blue-500 h-5 rounded-full"
                                    style={{ width: `${(item[valueKey] / maxValue) * 100}%` }}
                                ></div>
                                <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white px-2">{formatCurrency(item[valueKey])}</span>
                            </div>
                        </div>
                    </div>
                )) : <p className="text-gray-500 text-sm">{t('noDataAvailable')}</p>}
            </div>
        </div>
    );
}


const ShiftReports: React.FC<ShiftReportsProps> = ({ activeShift, allShifts, orders, categories, waiters, dayStatus, t, lang }) => {
    
    if (!activeShift && dayStatus === 'CLOSED') {
        return (
            <div className="p-6 h-full flex flex-col items-center justify-center bg-gray-100">
                <div className="text-center bg-white p-8 rounded-lg shadow-md">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">{t('shiftReports')}</h2>
                    <p className="text-xl text-gray-600 mb-4">{t('dayIsClosed')}</p>
                </div>
            </div>
        );
    }
    
    const formatDateTime = (isoString: string | null) => {
        if (!isoString) return 'N/A';
        return new Date(isoString).toLocaleString(lang, { dateStyle: 'short', timeStyle: 'short' });
    }

    const paidOrders = activeShift
        ? orders.filter(o => 
            o.status === 'paid' && 
            new Date(o.timestamp) >= new Date(activeShift.dayOpenedTimestamp)
          )
        : [];

    // Prepare data for charts
    const salesByCategory = categories.map(cat => ({
        ...cat,
        total: paidOrders.reduce((acc, order) => acc + order.items.filter(item => item.menuItem.categoryId === cat.id).reduce((itemAcc, item) => itemAcc + item.totalPrice, 0), 0)
    })).filter(cat => cat.total > 0).sort((a,b) => b.total - a.total);

    const revenueByWaiter = waiters.map(waiter => ({
        ...waiter,
        total: paidOrders.filter(o => o.waiterId === waiter.id).reduce((acc, o) => acc + o.total, 0)
    })).filter(w => w.total > 0).sort((a,b) => b.total - a.total);

    const closedShifts = allShifts.filter(s => s.status === 'CLOSED').sort((a, b) => new Date(b.dayOpenedTimestamp).getTime() - new Date(a.dayOpenedTimestamp).getTime());

    const totalManualIncome = activeShift ? (activeShift.manualIncomeCash || 0) + (activeShift.manualIncomeCard || 0) : 0;
    const expectedCashInDrawer = activeShift ? activeShift.openingBalance + activeShift.cashSales + (activeShift.manualIncomeCash || 0) : 0;

    return (
        <div className="p-6 bg-gray-100 h-full overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">{t('shiftReports')}</h2>
            </div>
            
            {activeShift && (
                <>
                <div className="bg-white p-4 rounded-lg shadow mb-6">
                    <h3 className="font-bold text-lg mb-3">{t('financialSummary')} (Live)</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 text-center">
                        <div className="p-2 bg-gray-50 rounded-md"><div className="text-sm text-gray-600">{t('openingBalanceLabel')}</div><div className="font-bold text-lg">{formatCurrency(activeShift.openingBalance)}</div></div>
                        <div className="p-2 bg-green-50 rounded-md"><div className="text-sm text-gray-600">{t('cashSales')}</div><div className="font-bold text-lg">{formatCurrency(activeShift.cashSales)}</div></div>
                        <div className="p-2 bg-blue-50 rounded-md"><div className="text-sm text-gray-600">{t('cardSales')}</div><div className="font-bold text-lg">{formatCurrency(activeShift.cardSales)}</div></div>
                        <div className="p-2 bg-yellow-50 rounded-md"><div className="text-sm text-gray-600">{t('manualIncome')}</div><div className="font-bold text-lg">{formatCurrency(totalManualIncome)}</div></div>
                        <div className="p-2 bg-indigo-50 rounded-md text-indigo-800"><div className="text-sm ">{t('expectedCashInDrawer')}</div><div className="font-bold text-xl">{formatCurrency(expectedCashInDrawer)}</div></div>
                    </div>
                </div>
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                     <SimpleBarChart title={t('salesByCategory')} data={salesByCategory} t={t} />
                     <SimpleBarChart title={t('revenueByWaiter')} data={revenueByWaiter} t={t} />
                </div>
                </>
            )}

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <h3 className="p-4 font-bold text-lg">{t('shiftHistory')}</h3>
                <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="p-3 text-left text-sm font-semibold">{t('openedOn')}</th>
                        <th className="p-3 text-left text-sm font-semibold">{t('closedOn')}</th>
                        <th className="p-3 text-left text-sm font-semibold">{t('totalRevenue')}</th>
                        <th className="p-3 text-left text-sm font-semibold">{t('totalTax')}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {closedShifts.length > 0 ? (
                        closedShifts.map(shift => (
                        <tr key={shift.id} className="border-b">
                            <td className="p-3 text-sm">{formatDateTime(shift.dayOpenedTimestamp)}</td>
                            <td className="p-3 text-sm">{formatDateTime(shift.dayClosedTimestamp)}</td>
                            <td className="p-3 text-sm font-semibold">{formatCurrency(shift.finalTotalRevenue || 0)}</td>
                            <td className="p-3 text-sm font-mono">{formatCurrency(shift.finalTotalTax || 0)}</td>
                        </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4} className="text-center p-6 text-gray-500">{t('noDataAvailable')}</td>
                        </tr>
                    )}
                    </tbody>
                </table>
                </div>
            </div>

        </div>
    );
};

export default ShiftReports;