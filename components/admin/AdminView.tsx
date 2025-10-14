import React, { useMemo, useEffect, useState } from 'react';
import { Language, Order, Waiter, InventoryItem, Category, MenuItem, Transaction, ShiftReport, UserRole } from '../../types';
import { useLocalStorage } from '../../utils/hooks';
import Dashboard from '../Dashboard';
import ManagerDashboard from './ManagerDashboard';
import OrderQueue from '../OrderQueue';
import CategoryManagement from './CategoryManagement';
import MenuManagement from './MenuManagement';
import InventoryManagement from './InventoryManagement';
import WaiterManagement from './WaiterManagement';
import CashManagement from './CashManagement';
import ShiftReports from './DailyReport';
import CreditManagement from './CreditManagement';
import { ChartBarIcon, ClipboardDocumentListIcon, BookOpenIcon, TagIcon, ArchiveBoxIcon, UsersIcon, CurrencyEuroIcon, DocumentTextIcon, TicketIcon, Bars3Icon, XMarkIcon } from '../icons';

interface AdminViewProps {
    lang: Language;
    t: (key: string, params?: any) => string;
    toggleLang: () => void;
    orders: Order[];
    waiters: Waiter[];
    inventory: InventoryItem[];
    categories: Category[];
    menuItems: MenuItem[];
    transactions: Transaction[];
    activeShift: ShiftReport | undefined;
    allShifts: ShiftReport[];
    dayStatus: 'OPEN' | 'CLOSED';
    onUpdateOrderStatus: (id: number, status: Order['status']) => void;
    onPayOrder: (order: Order) => void;
    onReprintReceipt: (order: Order) => void;
    onAddCategory: () => void;
    onEditCategory: (category: Category) => void;
    onDeleteCategory: (id: string) => void;
    onAddMenuItem: () => void;
    onEditMenuItem: (item: MenuItem) => void;
    onDeleteMenuItem: (id: string) => void;
    onAddInventoryItem: () => void;
    onEditInventoryItem: (item: InventoryItem) => void;
    onDeleteInventoryItem: (id: string) => void;
    onAddWaiter: () => void;
    onEditWaiter: (waiter: Waiter) => void;
    onDeleteWaiter: (id: string) => void;
    onAddManualIncome: (amount: number, description: string, method: 'cash' | 'card') => void;
    onSettleCredit: (order: Order) => void;
    currentUserRole: UserRole;
}

const AdminView: React.FC<AdminViewProps> = (props) => {
    const [adminTab, setAdminTab] = useLocalStorage('pos-admin-tab','dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { lang, t, toggleLang, currentUserRole, ...rest } = props;

    const adminTabs = useMemo(() => [
        { id: 'dashboard', label: t('dashboard'), icon: ChartBarIcon },
        { id: 'orders', label: t('orders'), icon: ClipboardDocumentListIcon},
        { id: 'creditManagement', label: t('creditManagement'), icon: TicketIcon },
        { id: 'menuManagement', label: t('menuManagement'), icon: BookOpenIcon },
        { id: 'categoryManagement', label: t('categoryManagement'), icon: TagIcon },
        { id: 'inventoryManagement', label: t('inventoryManagement'), icon: ArchiveBoxIcon },
        { id: 'waiterManagement', label: t('waiterManagement'), icon: UsersIcon },
        { id: 'cashManagement', label: t('cashManagement'), icon: CurrencyEuroIcon },
        { id: 'dailyReport', label: t('dailyReport'), icon: DocumentTextIcon },
    ], [t]);
    
    const availableTabs = useMemo(() => {
        if (currentUserRole === 'ADMIN') {
            return adminTabs;
        }
        if (currentUserRole === 'MANAGER') {
            const managerTabs = ['dashboard', 'creditManagement', 'inventoryManagement'];
            return adminTabs.filter(tab => managerTabs.includes(tab.id));
        }
        return [];
    }, [currentUserRole, adminTabs]);

    useEffect(() => {
        if (availableTabs.length > 0 && !availableTabs.find(t => t.id === adminTab)) {
            setAdminTab(availableTabs[0].id);
        }
    }, [availableTabs, adminTab, setAdminTab]);

    const handleTabClick = (tabId: string) => {
        setAdminTab(tabId);
        if (window.innerWidth < 1024) { // lg breakpoint in Tailwind
            setIsSidebarOpen(false);
        }
    };

    const renderAdminContent = () => {
        const creditOrders = rest.orders.filter(o => o.status === 'on_credit');
        switch(adminTab) {
            case 'dashboard':
                if (currentUserRole === 'MANAGER') {
                    return <ManagerDashboard
                        inventory={rest.inventory}
                        orders={rest.orders}
                        onNavigate={handleTabClick}
                        onEditInventoryItem={rest.onEditInventoryItem}
                        t={t}
                    />;
                }
                return <Dashboard orders={rest.orders} inventory={rest.inventory} t={t} activeShift={rest.activeShift} categories={rest.categories} />;
            case 'orders': return <OrderQueue orders={rest.orders} waiters={rest.waiters} onUpdateStatus={rest.onUpdateOrderStatus} onPayOrder={rest.onPayOrder} onReprintReceipt={rest.onReprintReceipt} t={t} lang={lang} activeShift={rest.activeShift} />;
            case 'creditManagement': return <CreditManagement creditOrders={creditOrders} onSettle={rest.onSettleCredit} t={t} />;
            case 'menuManagement': return <MenuManagement menuItems={rest.menuItems} categories={rest.categories} inventory={rest.inventory} onAdd={rest.onAddMenuItem} onEdit={rest.onEditMenuItem} onDelete={rest.onDeleteMenuItem} t={t} />;
            case 'categoryManagement': return <CategoryManagement categories={rest.categories} onAdd={rest.onAddCategory} onEdit={rest.onEditCategory} onDelete={rest.onDeleteCategory} t={t} />;
            case 'inventoryManagement': return <InventoryManagement inventory={rest.inventory} onAdd={rest.onAddInventoryItem} onEdit={rest.onEditInventoryItem} onDelete={rest.onDeleteInventoryItem} t={t} currentUserRole={currentUserRole} />;
            case 'waiterManagement': return <WaiterManagement waiters={rest.waiters} onAdd={rest.onAddWaiter} onEdit={rest.onEditWaiter} onDelete={rest.onDeleteWaiter} t={t} />;
            case 'cashManagement': return <CashManagement transactions={rest.transactions} activeShift={rest.activeShift} onAddManualIncome={rest.onAddManualIncome} t={t} />;
            case 'dailyReport': return <ShiftReports activeShift={rest.activeShift} allShifts={rest.allShifts} orders={rest.orders} categories={rest.categories} waiters={rest.waiters} dayStatus={rest.dayStatus} t={t} lang={lang} />;
            default: return null;
        }
    }

    return (
         <div className="flex h-full bg-gray-100">
            {/* Sidebar */}
            <div id="admin-sidebar" className={`fixed inset-y-0 z-30 w-64 bg-white border-r transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${lang === 'ar' ? 'right-0' : 'left-0'} ${isSidebarOpen ? 'translate-x-0' : (lang === 'ar' ? 'translate-x-full' : '-translate-x-full')}`}>
                <div className="p-4 font-bold text-lg flex justify-between items-center">
                    <span>{t('adminPanel')}</span>
                    <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-500 hover:text-gray-600">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                <nav>
                    {availableTabs.map(tab => (
                        <button key={tab.id} onClick={() => handleTabClick(tab.id)} className={`w-full flex items-center gap-3 px-4 py-3 text-left ${adminTab === tab.id ? 'bg-orange-100 text-orange-700' : 'hover:bg-gray-100'}`}>
                            <tab.icon className="w-6 h-6"/> {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white shadow-sm sticky top-0 z-10">
                    <div className="mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className={`lg:hidden text-gray-500 hover:text-gray-700 p-2 ${lang === 'ar' ? '-mr-2' : '-ml-2'}`}
                            >
                                <span className="sr-only">Open sidebar</span>
                                <Bars3Icon className="h-6 w-6" />
                            </button>
                            
                            <div className="flex-1"></div>

                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                                <button
                                    onClick={toggleLang}
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg transition duration-300 text-sm"
                                >
                                    {lang === 'ar' ? 'Español' : 'العربية'}
                                </button>
                            </div>
                        </div>
                    </div>
                </header>
                
                <main className="flex-1 bg-gray-50 overflow-y-auto">
                    {renderAdminContent()}
                </main>
            </div>
        </div>
    );
};

export default AdminView;