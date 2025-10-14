import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Order, OrderItem, MenuItem, Category, InventoryItem, Waiter, Language,
  CustomizationOption, ShiftReport, Transaction, PaymentDetails, UserRole, HeldOrder
} from './types';
import { mockMenuItems, INITIAL_CATEGORIES, mockInventory, mockWaiters } from './data/mockData';
import { TAX_RATE } from './constants';
import { useLocalStorage } from './utils/hooks';

// Components
import Header from './components/Header';
import Menu from './components/Menu';
import CurrentOrder from './components/CurrentOrder';
import OrderQueue from './components/OrderQueue';
import WaiterSelectionScreen from './components/WaiterSelectionScreen';
import TableSelectionScreen from './components/TableSelectionScreen';
import CustomizationModal from './components/CustomizationModal';
import PaymentModal from './components/PaymentModal';
import AdminView from './components/admin/AdminView';
import PinModal from './components/PinModal';
import Sidebar from './components/Sidebar';
import OpeningBalanceModal from './components/OpeningBalanceModal';
import ShiftSummaryModal from './components/admin/ShiftSummaryModal';
import ReceiptPreviewModal from './components/ReceiptPreviewModal';
import ConfirmationModal from './components/ConfirmationModal';
import CreditConfirmationModal from './components/admin/CreditConfirmationModal';
import Notification from './components/Notification';
import CategoryFormModal from './components/admin/CategoryFormModal';
import MenuItemFormModal from './components/admin/MenuItemFormModal';
import InventoryFormModal from './components/admin/InventoryFormModal';
import WaiterFormModal from './components/admin/WaiterFormModal';
import CreditManagement from './components/admin/CreditManagement';
import WaiterShiftSummaryModal from './components/WaiterShiftSummaryModal';
import TableActionsModal from './components/TableActionsModal';
import HeldOrderActionsModal from './components/HeldOrderActionsModal';
// Fix: Imported the missing 'SunIcon' to resolve a reference error.
import { SunIcon } from './components/icons';


// Translations - simple i18n implementation
const translations = {
  es: {
    welcome: 'Bienvenido', selectWaiterToBegin: 'Seleccione un camarero para comenzar', newOrder: 'Nuevo Pedido',
    orders: 'Pedidos', admin: 'Admin', logout: 'Salir', search: 'Buscar', searchProducts: 'Buscar productos...',
    openCashDrawer: 'Abrir caja', currentOrder: 'Pedido Actual', orderIsEmpty: 'El pedido está vacío.',
    without: 'sin', quantity: 'Cant.', discount: 'Dto.', orderNotes: 'Notas del Pedido',
    orderNotesPlaceholder: 'Ej: Alergias, peticiones especiales...', subtotal: 'Subtotal', tax: 'IVA',
    payableAmount: 'Total a Pagar', holdOrder: 'En Espera', proceed: 'Proceder', 
    orderHeldSuccessfully: 'El pedido se ha puesto en espera correctamente.',
    heldOrderFound: 'Pedido en Espera Encontrado',
    heldOrderMessage: 'Esta mesa tiene un pedido en espera. ¿Qué te gustaría hacer?',
    resumeHeldOrder: 'Reanudar Pedido',
    startNewOrder: 'Empezar Nuevo (descarta el anterior)',
    outOfStock: 'Agotado',
    active: 'Activos', paid: 'Pagados', all: 'Todos', noOrdersFound: 'No se encontraron pedidos.',
    table: 'Mesa', waiter: 'Camarero', pending: 'Pendiente', preparing: 'Preparando',
    ready: 'Listo', on_credit: 'A crédito', startPreparing: 'Empezar a Preparar', markReady: 'Marcar como Listo',
    settlePayment: 'Saldar Pago', pay: 'Pagar', reprintReceipt: 'Reimprimir', creditedTo: 'A crédito de: {name}',
    total: 'Total', dashboard: 'Dashboard', totalRevenue: 'Ingresos Totales', totalOrders: 'Pedidos Totales',
    lowStockAlerts: 'Alertas de Stock Bajo', itemName: 'Artículo', quantityRemaining: 'Quedan',
    threshold: 'Umbral', noLowStockItems: 'No hay artículos con stock bajo.', customizeItem: 'Personalizar Artículo',
    removableIngredients: 'Ingredientes (quitar)', addToOrder: 'Añadir al Pedido', bar: 'Barra', vip: 'VIP',
    readyToPay: 'Listo para Pagar', payment: 'Pago', person: 'persona',
    viewOrderSummary: 'Ver Resumen del Pedido', paymentMethod: 'Método de Pago', cash: 'Efectivo', card: 'Tarjeta',
    split: 'Dividir',
    totalEntered: 'Total Ingresado',
    remaining: 'Restante',
    amountReceived: 'Cantidad Recibida', change: 'Cambio', cashAmount: 'Monto en Efectivo',
    cardAmount: 'Monto en Tarjeta', confirmPayment: 'Confirmar Pago', orderPaidSuccessfully: '¡Pedido pagado con éxito!',
    printReceipt: 'Imprimir Recibo', close: 'Cerrar', enterPin: 'Introducir PIN', incorrectPin: 'PIN incorrecto',
    delete: 'Borrar', cancel: 'Cancelar', openNewDay: 'Abrir Nuevo Día', enterOpeningBalance: 'Introducir saldo de apertura',
    openingBalance: 'Saldo de Apertura', confirm: 'Confirmar', adminPanel: 'Panel de Admin', creditManagement: 'Gestión de Crédito',
    menuManagement: 'Gestión de Menú', categoryManagement: 'Gestión de Categorías', inventoryManagement: 'Gestión de Inventario',
    waiterManagement: 'Gestión de Camareros', cashManagement: 'Gestión de Caja', dailyReport: 'Informe Diario',
    editCategory: 'Editar Categoría', addNewCategory: 'Añadir Categoría', name: 'Nombre', save: 'Guardar',
    addNewItem: 'Añadir Artículo', price: 'Precio', imageURL: 'URL de Imagen', stockItem: 'Artículo de Stock',
    consumption: 'Consumo', editItem: 'Editar Artículo', category: 'Categoría', lowStock: 'Stock bajo',
    editStock: 'Editar Stock', addNewStock: 'Añadir Stock', unit: 'Unidad', editWaiter: 'Editar Camarero',
    addNewWaiter: 'Añadir Camarero', addManualIncome: 'Añadir Ingreso Manual', add: 'Añadir', description: 'Descripción',
    taxable: 'Con impuestos', taxToBeAdded: 'IVA a añadir', taxIncluded: 'IVA incluido', transactionLog: 'Registro de Transacciones',
    dateTime: 'Fecha y Hora', type: 'Tipo', sale: 'Venta', manual: 'Manual', noDataAvailable: 'No hay datos disponibles',
    shiftReports: 'Informes de Turno', closeDay: 'Cerrar Día', financialSummary: 'Resumen Financiero',
    openingBalanceLabel: 'Saldo Apertura', cashSales: 'Ventas Efectivo', cardSales: 'Ventas Tarjeta',
    expectedClosingBalance: 'Cierre de Caja Estimado', salesByCategory: 'Ventas por Categoría', revenueByWaiter: 'Ingresos por Camarero',
    shiftHistory: 'Historial de Turnos', openedOn: 'Abierto el', closedOn: 'Cerrado el', dayIsClosed: 'El día está cerrado',
    shiftSummary: 'Resumen del Turno', dayClosedSuccessfully: 'Día cerrado con éxito', settle: 'Saldar',
    allCustomerNamesRequired: 'Se requieren los nombres de todos los clientes.', closeDayWithCreditTitle: 'Cerrar día con pedidos abiertos',
    closeDayWithCreditMessage: 'Hay {count} pedidos abiertos. Para cerrar el día, por favor, asigne un nombre de cliente a cada uno para moverlos a crédito.',
    customerName: 'Nombre del Cliente', confirmAndMoveToCredit: 'Confirmar y Mover a Crédito', addToExistingOrder: 'Añadir al Pedido',
    proceedToPayment: 'Proceder al Pago', cashDrawer: 'Caja',
    order: 'Pedido', orderStatusUpdated: 'Estado del pedido actualizado.', orderSubmitted: 'Pedido enviado a cocina.',
    paymentConfirmed: 'Pago confirmado.', dayOpened: 'Nuevo día abierto.', dayClosed: 'Día cerrado.', creditSettled: 'Crédito saldado.',
    areYouSure: '¿Estás seguro?', deleteItemConfirmation: 'Esto eliminará el artículo permanentemente.',
    deleteCategoryConfirmation: 'Esto eliminará la categoría permanentemente. Los artículos de esta categoría se quedarán sin categoría.',
    deleteWaiterConfirmation: 'Esto eliminará al camarero permanentemente.',
    creditAccounts: 'Cuentas a Crédito',
    managerMustOpenDay: 'Un gerente debe abrir un nuevo día desde el panel de administración para continuar.',
    openDay: 'Abrir Día',
    totalCashIncome: 'Ingresos Totales en Efectivo',
    tables: 'Mesas',
    today: 'Hoy',
    thisMonth: 'Este Mes',
    thisQuarter: 'Este Trimestre',
    thisYear: 'Esta Año',
    method: 'Método',
    totalSales: 'Ventas Totales',
    manualIncome: 'Ingresos Manuales',
    expectedCashInDrawer: 'Efectivo Esperado en Caja',
    manualCashIncome: 'Ingresos Manuales (Efectivo)',
    cancelOrder: 'Cancelar Pedido',
    cancelOrderConfirmation: 'Esto cancelará el pedido y devolverá los artículos al stock. ¿Estás seguro?',
    orderCancelled: 'Pedido cancelado.',
    categorySaved: 'Categoría guardada con éxito.',
    categoryDeleted: 'Categoría eliminada.',
    itemSaved: 'Artículo guardado con éxito.',
    itemDeleted: 'Artículo eliminado.',
    stockSaved: 'Artículo de stock guardado con éxito.',
    stockDeleted: 'Artículo de stock eliminado.',
    waiterSaved: 'Camarero guardado con éxito.',
    waiterDeleted: 'Camarero eliminado.',
    discountAmount: 'Monto de Descuento',
    free: 'Gratis',
    ok: 'Aceptar',
    clear: 'Limpiar',
    topSellingItems: 'Top Selling Items',
    quantitySold: 'Quantity Sold',
    quickCash: 'Efectivo Rápido',
    manager: 'Gerente',
    addToStock: 'Añadir al Stock',
    currentQuantity: 'Cantidad Actual',
    quantityToAdd: 'Cantidad a Añadir',
    enterCustomerName: 'Introducir Nombre del Cliente',
    language: 'Idioma',
    space: 'Espacio',
    paymentOnMobileDisabledTitle: 'Función no disponible',
    paymentOnMobileDisabledMessage: 'El pago no está permitido en dispositivos móviles por razones de seguridad.',
  },
  ar: { 
    welcome: 'أهلاً بك', selectWaiterToBegin: 'اختر نادلاً للبدء', newOrder: 'طلب جديد', orders: 'الطلبات',
    admin: 'الإدارة', logout: 'خروج', search: 'بحث', searchProducts: 'ابحث عن المنتجات...',
    openCashDrawer: 'فتح الصندوق', currentOrder: 'الطلب الحالي', orderIsEmpty: 'الطلب فارغ.', without: 'بدون',
    quantity: 'الكمية', discount: 'خصم', orderNotes: 'ملاحظات الطلب', orderNotesPlaceholder: 'مثال: حساسيات، طلبات خاصة...',
    subtotal: 'المجموع الفرعي', tax: 'الضريبة', payableAmount: 'المبلغ المستحق', holdOrder: 'تعليق',
    orderHeldSuccessfully: 'تم تعليق الطلب بنجاح.',
    heldOrderFound: 'تم العثور على طلب معلق',
    heldOrderMessage: 'هذه الطاولة لديها طلب معلق. ماذا تريد أن تفعل؟',
    resumeHeldOrder: 'استئناف الطلب المعلق',
    startNewOrder: 'بدء طلب جديد (يحذف القديم)',
    proceed: 'متابعة', outOfStock: 'نفذ من المخزون', active: 'نشطة', paid: 'مدفوعة', all: 'الكل',
    noOrdersFound: 'لا توجد طلبات.', table: 'طاولة', waiter: 'نادل', pending: 'قيد الانتظار',
    preparing: 'قيد التجهيز', ready: 'جاهز', on_credit: 'على الحساب', startPreparing: 'بدء التجهيز',
    markReady: 'تحديد كجاهز', settlePayment: 'تسوية الدفع', pay: 'دفع', reprintReceipt: 'إعادة طباعة',
    creditedTo: 'دين على: {name}', total: 'المجموع', dashboard: 'لوحة التحكم', totalRevenue: 'إجمالي الإيرادات', 
    totalOrders: 'إجمالي الطلبات', lowStockAlerts: 'تنبيهات انخفاض المخزون', itemName: 'اسم الصنف', quantityRemaining: 'الكمية المتبقية',
    threshold: 'الحد الأدنى', noLowStockItems: 'لا توجد أصناف منخفضة المخزون.', customizeItem: 'تخصيص الصنف',
    removableIngredients: 'مكونات (للإزالة)', addToOrder: 'إضافة إلى الطلب', bar: 'البار', vip: 'VIP',
    readyToPay: 'جاهز للدفع', payment: 'الدفع', person: 'شخص',
    viewOrderSummary: 'عرض ملخص الطلب', paymentMethod: 'طريقة الدفع', cash: 'نقداً', card: 'بطاقة',
    split: 'تقسيم',
    totalEntered: 'المجموع المدخل',
    remaining: 'المتبقي',
    amountReceived: 'المبلغ المستلم', change: 'الباقي', cashAmount: 'المبلغ النقدي',
    cardAmount: 'مبلغ البطاقة', confirmPayment: 'تأكيد الدفع', orderPaidSuccessfully: 'تم دفع الطلب بنجاح!',
    printReceipt: 'طباعة الإيصال', close: 'إغلاق', enterPin: 'أدخل الرقم السري', incorrectPin: 'رقم سري غير صحيح',
    delete: 'حذف', cancel: 'إلغاء', openNewDay: 'بدء يوم جديد', enterOpeningBalance: 'أدخل الرصيد الافتتاحي',
    openingBalance: 'الرصيد الافتتاحي', confirm: 'تأكيد', adminPanel: 'لوحة الإدارة', creditManagement: 'إدارة الديون',
    menuManagement: 'إدارة القائمة', categoryManagement: 'إدارة الأقسام', inventoryManagement: 'إدارة المخزون',
    waiterManagement: 'إدارة النوادل', cashManagement: 'إدارة الصندوق', dailyReport: 'التقرير اليومي',
    editCategory: 'تعديل القسم', addNewCategory: 'إضافة قسم جديد', name: 'الاسم', save: 'حفظ',
    addNewItem: 'إضافة صنف جديد', price: 'السعر', imageURL: 'رابط الصورة', stockItem: 'صنف المخزون',
    consumption: 'الاستهلاك', editItem: 'تعديل الصنف', category: 'القسم', lowStock: 'مخزون منخفض',
    editStock: 'تعديل المخزون', addNewStock: 'إضافة للمخزون', unit: 'وحدة', editWaiter: 'تعديل النادل',
    addNewWaiter: 'إضافة نادل جديد', addManualIncome: 'إضافة دخل يدوي', add: 'إضافة', description: 'الوصف',
    taxable: 'خاضع للضريبة', taxToBeAdded: 'ضريبة ستُضاف', taxIncluded: 'الضريبة متضمنة', transactionLog: 'سجل المعاملات',
    dateTime: 'التاريخ والوقت', type: 'النوع', sale: 'بيع', manual: 'يدوي', noDataAvailable: 'لا توجد بيانات متاحة',
    shiftReports: 'تقارير المناوبات', closeDay: 'إغلاق اليوم', financialSummary: 'ملخص مالي',
    openingBalanceLabel: 'الرصيد الافتتاحي', cashSales: 'مبيعات نقدية', cardSales: 'مبيعات بطاقة',
    expectedClosingBalance: 'الرصيد الختامي المتوقع', salesByCategory: 'المبيعات حسب القسم', revenueByWaiter: 'الإيرادات حسب النادل',
    shiftHistory: 'سجل المناوبات', openedOn: 'افتتح في', closedOn: 'أغلق في', dayIsClosed: 'اليوم مغلق',
    shiftSummary: 'ملخص المناوبة', dayClosedSuccessfully: 'تم إغلاق اليوم بنجاح', settle: 'تسوية',
    allCustomerNamesRequired: 'أسماء جميع العملاء مطلوبة.', closeDayWithCreditTitle: 'إغلاق اليوم مع وجود طلبات مفتوحة',
    closeDayWithCreditMessage: 'يوجد {count} طلبات مفتوحة. لإغلاق اليوم، يرجى تعيين اسم عميل لكل طلب لنقله إلى حساب دين.',
    customerName: 'اسم العميل', confirmAndMoveToCredit: 'تأكيد والنقل إلى الدين', addToExistingOrder: 'إضافة إلى طلب حالي',
    proceedToPayment: 'الانتقال للدفع', cashDrawer: 'صندوق النقد',
    order: 'الطلب', orderStatusUpdated: 'تم تحديث حالة الطلب.', orderSubmitted: 'تم إرسال الطلب للمطبخ.',
    paymentConfirmed: 'تم تأكيد الدفع.', dayOpened: 'تم بدء يوم جديد.', dayClosed: 'تم إغلاق اليوم.', creditSettled: 'تم تسوية الدين.',
    areYouSure: 'هل أنت متأكد؟', deleteItemConfirmation: 'سيؤدي هذا إلى حذف الصنف بشكل دائم.',
    deleteCategoryConfirmation: 'سيؤدي هذا إلى حذف القسم بشكل دائم. الأصناف الموجودة في هذا القسم ستصبح بدون قسم.',
    deleteWaiterConfirmation: 'سيؤدي هذا إلى حذف النادل بشكل دائم.',
    creditAccounts: 'حسابات الديون',
    managerMustOpenDay: 'يجب على المدير بدء يوم جديد من لوحة الإدارة للمتابعة.',
    openDay: 'بدء اليوم',
    totalCashIncome: 'إجمالي الدخل النقدي',
    tables: 'الطاولات',
    today: 'اليوم',
    thisMonth: 'هذا الشهر',
    thisQuarter: 'هذا الربع',
    thisYear: 'هذه السنة',
    method: 'الطريقة',
    totalSales: 'إجمالي المبيعات',
    manualIncome: 'الدخل اليدوي',
    expectedCashInDrawer: 'النقد المتوقع بالصندوق',
    manualCashIncome: 'الدخل اليدوي النقدي',
    cancelOrder: 'إلغاء الطلب',
    cancelOrderConfirmation: 'سيؤدي هذا إلى إلغاء الطلب وإعادة الأصناف إلى المخزون. هل أنت متأكد؟',
    orderCancelled: 'تم إلغاء الطلب.',
    categorySaved: 'تم حفظ القسم بنجاح.',
    categoryDeleted: 'تم حذف القسم.',
    itemSaved: 'تم حفظ الصنف بنجاح.',
    itemDeleted: 'تم حذف الصنف.',
    stockSaved: 'تم حفظ صنف المخزون بنجاح.',
    stockDeleted: 'تم حذف صنف المخزون.',
    waiterSaved: 'تم حفظ النادل بنجاح.',
    waiterDeleted: 'تم حذف النادل.',
    discountAmount: 'مبلغ الخصم',
    free: 'مجاني',
    ok: 'موافق',
    clear: 'مسح',
    topSellingItems: 'الأصناف الأكثر مبيعًا',
    quantitySold: 'الكمية المباعة',
    quickCash: 'مبالغ سريعة',
    manager: 'مدير',
    addToStock: 'إضافة للمخزون',
    currentQuantity: 'الكمية الحالية',
    quantityToAdd: 'الكمية المراد إضافتها',
    enterCustomerName: 'أدخل اسم العميل',
    language: 'لغة',
    space: 'مسافة',
    paymentOnMobileDisabledTitle: 'الوظيفة غير متاحة',
    paymentOnMobileDisabledMessage: 'الدفع غير مسموح به على الأجهزة المحمولة لأسباب أمنية.',
  }
};

type Area = 'Bar' | 'VIP' | 'Barra';

const App: React.FC = () => {
  // --- STATE MANAGEMENT ---
  const [lang, setLang] = useLocalStorage<Language>('pos-lang', 'es');
  
  // Data State
  const [orders, setOrders] = useLocalStorage<Order[]>('pos-orders', []);
  const [inventory, setInventory] = useLocalStorage<InventoryItem[]>('pos-inventory', mockInventory);
  const [menuItems, setMenuItems] = useLocalStorage<MenuItem[]>('pos-menu-items', mockMenuItems);
  const [categories, setCategories] = useLocalStorage<Category[]>('pos-categories', INITIAL_CATEGORIES);
  const [waiters, setWaiters] = useLocalStorage<Waiter[]>('pos-waiters', mockWaiters);
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('pos-transactions', []);
  const [shifts, setShifts] = useLocalStorage<ShiftReport[]>('pos-shifts', []);
  const [heldOrders, setHeldOrders] = useLocalStorage<HeldOrder[]>('pos-held-orders', []);
  
  // UI & Flow State
  const [view, setView] = useState<'waiter' | 'table' | 'pos' | 'credit' | 'admin' | 'day_closed' | 'manager_dashboard'>('waiter');
  const [posView, setPosView] = useState<'order' | 'queue'>('order');
  const [currentWaiterId, setCurrentWaiterId] = useLocalStorage<string | null>('pos-current-waiter', null);
  const [currentTable, setCurrentTable] = useLocalStorage<{ id: number; area: Area } | null>('pos-current-table', null);
  const [currentUserRole, setCurrentUserRole] = useLocalStorage<UserRole>('pos-current-user-role', null);
  
  // Current Order State
  const [currentOrderItems, setCurrentOrderItems] = useState<OrderItem[]>([]);
  const [currentOrderNotes, setCurrentOrderNotes] = useState('');
  
  // Modal State
  const [isCustomizationModalOpen, setCustomizationModalOpen] = useState(false);
  const [itemToCustomize, setItemToCustomize] = useState<MenuItem | null>(null);
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
  const [orderToPay, setOrderToPay] = useState<Order | null>(null);
  const [isPinModalOpen, setPinModalOpen] = useState(false);
  const [pinSuccessCallback, setPinSuccessCallback] = useState<((role: UserRole) => void) | null>(null);
  const [isOpeningBalanceModalOpen, setOpeningBalanceModalOpen] = useState(false);
  const [isShiftSummaryModalOpen, setShiftSummaryModalOpen] = useState(false);
  const [shiftToSummarize, setShiftToSummarize] = useState<ShiftReport | null>(null);
  const [isReceiptModalOpen, setReceiptModalOpen] = useState(false);
  const [orderToPrint, setOrderToPrint] = useState<Order | null>(null);
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [confirmationProps, setConfirmationProps] = useState({ title: '', message: '', onConfirm: () => {} });
  const [isCreditConfirmationModalOpen, setCreditConfirmationModalOpen] = useState(false);
  const [isWaiterShiftSummaryModalOpen, setWaiterShiftSummaryModalOpen] = useState(false);
  const [shiftForWaiterSummary, setShiftForWaiterSummary] = useState<ShiftReport | null>(null);
  const [isTableActionsModalOpen, setTableActionsModalOpen] = useState(false);
  const [orderForTableActions, setOrderForTableActions] = useState<Order | null>(null);
  const [isHeldOrderModalOpen, setHeldOrderModalOpen] = useState(false);
  const [heldOrderForTable, setHeldOrderForTable] = useState<HeldOrder | null>(null);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(INITIAL_CATEGORIES[0]?.id || '');
  const [selectedArea, setSelectedArea] = useState<Area>('Bar');
  
  // Admin Modals State
  const [isCategoryFormOpen, setCategoryFormOpen] = useState(false);
  const [isMenuItemFormOpen, setMenuItemFormOpen] = useState(false);
  const [isInventoryFormOpen, setInventoryFormOpen] = useState(false);
  const [isWaiterFormOpen, setWaiterFormOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<any>(null);
  
  // Notification State
  const [notification, setNotification] = useState<{ title: string; message: string } | null>(null);

  // --- DERIVED STATE ---
  const activeShift = useMemo(() => shifts.find(s => s.status === 'OPEN'), [shifts]);
  const dayStatus = activeShift ? 'OPEN' : 'CLOSED';
  const currentWaiter = useMemo(() => waiters.find(w => w.id === currentWaiterId), [waiters, currentWaiterId]);

  // Calculations for current order (tax-inclusive model)
  const { subtotal, tax, total } = useMemo(() => {
    const totalAmount = currentOrderItems.reduce((acc, item) => acc + item.totalPrice * (1 - (item.discount || 0) / 100), 0);
    const preTaxTotal = totalAmount / (1 + TAX_RATE);
    const taxAmount = totalAmount - preTaxTotal;
    return { subtotal: preTaxTotal, tax: taxAmount, total: totalAmount };
  }, [currentOrderItems]);
  
  // --- EFFECTS ---

  // Auto-hide notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Effect to handle view redirection logic.
  useEffect(() => {
    if (!currentWaiterId && !['waiter', 'admin', 'manager_dashboard'].includes(view)) {
      setView('waiter');
      return;
    }
    if (currentWaiterId && !currentTable && view === 'pos') {
      setView('table');
      return;
    }
  }, [currentWaiterId, currentTable, view]);

  // Effect to automatically navigate from 'day_closed' to 'table' view when a new shift is opened.
  useEffect(() => {
    if (activeShift && view === 'day_closed') {
        setView('table');
    }
  }, [activeShift, view]);


  // --- I18N FUNCTION ---
  const t = useCallback((key: string, params?: any) => {
    let translation = translations[lang][key as keyof typeof translations.es] || key;
    if (params) {
        Object.keys(params).forEach(pKey => {
            translation = translation.replace(`{${pKey}}`, params[pKey]);
        });
    }
    return translation;
  }, [lang]);
  
  const toggleLang = () => setLang(prev => (prev === 'es' ? 'ar' : 'es'));

  // --- HANDLERS ---
  const handleStartOrder = (waiterId: string) => {
    setCurrentWaiterId(waiterId);
    if (dayStatus === 'CLOSED') {
      setView('day_closed');
    } else {
      setView('table');
    }
  };

  const handleSelectTable = (tableId: number, area: Area) => {
    const heldOrder = heldOrders.find(o => o.tableNumber === tableId && o.area === area);
    if (heldOrder) {
      setHeldOrderForTable(heldOrder);
      setHeldOrderModalOpen(true);
    } else {
      setCurrentTable({ id: tableId, area });
      setView('pos');
      setPosView('order');
    }
  };
  
  const handleOpenTableActions = (order: Order) => {
    setOrderForTableActions(order);
    setTableActionsModalOpen(true);
  };

  const handleGoToPaymentFromActions = (order: Order) => {
    setTableActionsModalOpen(false);
    handlePayOrder(order);
  };
  
  const handleAddToExistingOrder = (order: Order) => {
      setCurrentOrderItems(order.items);
      setCurrentOrderNotes(order.notes || '');
      setOrders(prev => prev.filter(o => o.id !== order.id));
      setCurrentTable({ id: order.tableNumber, area: order.area });
      setTableActionsModalOpen(false);
      setView('pos');
      setPosView('order');
  };

  const handleLogout = () => {
    if (currentOrderItems.length > 0) {
        if (!window.confirm("You have an unsaved order. Are you sure you want to log out?")) {
            return;
        }
    }
    setCurrentWaiterId(null);
    setCurrentTable(null);
    setCurrentOrderItems([]);
    setCurrentOrderNotes('');
    setCurrentUserRole(null);
    setView('waiter');
  };

  const handleAdminAccess = (callback: (role: UserRole) => void) => {
    setPinSuccessCallback(() => (role: UserRole) => callback(role));
    setPinModalOpen(true);
  };
  
  const handleOpenDrawer = () => {
    handleAdminAccess(() => {
        setNotification({ title: t('cashDrawer'), message: t('cashDrawer') });
    });
  };

  const handleNavigation = (targetView: 'tables' | 'queue' | 'credit' | 'admin') => {
    if ((view === 'admin' || view === 'manager_dashboard') && targetView !== 'admin') {
      setCurrentUserRole(null);
    }
    
    if (targetView === 'admin') {
      handleAdminAccess((role) => {
        setCurrentUserRole(role);
        if (role === 'MANAGER') {
          setView('manager_dashboard');
        } else { // ADMIN
          setView('admin');
        }
      });
      return;
    }
    
    if (dayStatus === 'CLOSED') {
      setView('day_closed');
      return;
    }

    if (targetView === 'tables') {
        setCurrentTable(null);
        setCurrentOrderItems([]);
        setCurrentOrderNotes('');
        setView('table');
        setPosView('order'); 
    } else if (targetView === 'queue') {
        setView('pos');
        setPosView('queue');
    } else if (targetView === 'credit') {
        setView('credit');
    }
};


  // Menu & Current Order Handlers
  const handleSelectItem = (item: MenuItem) => {
    if(item.customizations) {
        handleCustomizeItem(item);
    } else {
        handleAddToCart({
            menuItem: item,
            quantity: 1,
            customizations: {},
            removedIngredients: [],
            totalPrice: item.price
        } as OrderItem);
    }
  };
  
  const handleCustomizeItem = (item: MenuItem) => {
    setItemToCustomize(item);
    setCustomizationModalOpen(true);
  };

  const handleAddToCart = (item: OrderItem) => {
    const newItem = { ...item, id: `${item.menuItem.id}-${Date.now()}`};
    setCurrentOrderItems(prev => [...prev, newItem]);
  };
  
  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCurrentOrderItems(prev => prev.map(item => {
        if (item.id === itemId) {
            const pricePerUnit = item.totalPrice / item.quantity;
            return { ...item, quantity: newQuantity, totalPrice: pricePerUnit * newQuantity };
        }
        return item;
    }));
  };
  
  const handleRemoveItem = (itemId: string) => {
    setCurrentOrderItems(prev => prev.filter(item => item.id !== itemId));
  };
  
  const handleUpdateItemDiscount = (itemId: string, discount: number) => {
    setCurrentOrderItems(prev => prev.map(item =>
      item.id === itemId ? { ...item, discount: Math.max(0, Math.min(100, discount)) } : item
    ));
  };

  const handleHoldOrder = () => {
    if (!currentTable || !currentWaiterId || currentOrderItems.length === 0) return;
    const newHeldOrder: HeldOrder = {
      tableNumber: currentTable.id,
      area: currentTable.area,
      waiterId: currentWaiterId,
      items: currentOrderItems,
      notes: currentOrderNotes,
      timestamp: new Date(),
    };
    setHeldOrders(prev => [...prev.filter(o => o.tableNumber !== currentTable!.id || o.area !== currentTable!.area), newHeldOrder]);
    setCurrentOrderItems([]);
    setCurrentOrderNotes('');
    setView('table');
    setNotification({ title: t('holdOrder'), message: t('orderHeldSuccessfully') });
  };

  const handleResumeOrder = (heldOrder: HeldOrder) => {
    setCurrentTable({ id: heldOrder.tableNumber, area: heldOrder.area });
    setCurrentOrderItems(heldOrder.items);
    setCurrentOrderNotes(heldOrder.notes || '');
    setCurrentWaiterId(heldOrder.waiterId);
    setHeldOrders(prev => prev.filter(o => o.tableNumber !== heldOrder.tableNumber || o.area !== heldOrder.area));
    setHeldOrderModalOpen(false);
    setHeldOrderForTable(null);
    setView('pos');
    setPosView('order');
  };

  const handleStartNewOverHeld = (heldOrder: HeldOrder) => {
    setHeldOrders(prev => prev.filter(o => o.tableNumber !== heldOrder.tableNumber || o.area !== heldOrder.area));
    setCurrentTable({ id: heldOrder.tableNumber, area: heldOrder.area });
    setCurrentOrderItems([]);
    setCurrentOrderNotes('');
    setHeldOrderModalOpen(false);
    setHeldOrderForTable(null);
    setView('pos');
    setPosView('order');
  };

  const handleSubmitOrder = () => {
    if (!currentTable || !currentWaiterId || currentOrderItems.length === 0) return;

    const newOrder: Order = {
      id: Date.now(),
      tableNumber: currentTable.id,
      area: currentTable.area,
      waiterId: currentWaiterId,
      items: currentOrderItems,
      status: 'pending',
      subtotal: subtotal,
      tax: tax,
      total: total,
      notes: currentOrderNotes,
      timestamp: new Date(),
    };

    setOrders(prev => [...prev, newOrder]);
    
    setInventory(prevInv => {
        const newInv = [...prevInv];
        newOrder.items.forEach(orderItem => {
            const stockItem = newInv.find(i => i.id === orderItem.menuItem.stockItemId);
            if (stockItem) {
                stockItem.quantity -= (orderItem.menuItem.stockConsumption * orderItem.quantity);
            }
        });
        return newInv;
    });

    setCurrentOrderItems([]);
    setCurrentOrderNotes('');
    setView('table');
    setNotification({ title: t('order'), message: t('orderSubmitted') });
  };
  
  // Order Queue Handlers
  const handleUpdateStatus = (orderId: number, newStatus: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    setNotification({ title: t('order'), message: t('orderStatusUpdated') });
  };
  
  const handlePayOrder = (order: Order) => {
    if (window.innerWidth < 768) { // 768px is a common tablet breakpoint
      setNotification({
        title: t('paymentOnMobileDisabledTitle'),
        message: t('paymentOnMobileDisabledMessage'),
      });
      return;
    }
    setOrderToPay(order);
    setPaymentModalOpen(true);
  };

  const handleConfirmPayment = (orderId: number, details: PaymentDetails, finalTotal: number, finalTax: number) => {
     let updatedOrder: Order | null = null;
     const finalSubtotal = finalTotal / (1 + TAX_RATE);
     
     setOrders(prev => prev.map(o => {
        if (o.id === orderId) {
            updatedOrder = { ...o, status: 'paid', paymentDetails: details, total: finalTotal, tax: finalTax, subtotal: finalSubtotal };
            return updatedOrder;
        }
        return o;
     }));
     
     if (activeShift) {
        let cashSale = 0;
        let cardSale = 0;
        const paymentTransactions: Transaction[] = [];

        if (details.method === 'card') {
          cardSale = finalTotal;
        } else if (details.method === 'split') {
            cashSale = details.cashAmount;
            cardSale = details.cardAmount;
        } else { // cash
            cashSale = finalTotal;
        }
        
        if (cardSale > 0) {
            const taxOnCardPortion = cardSale - (cardSale / (1 + TAX_RATE));
            paymentTransactions.push({
                id: `tx-${Date.now()}-card`, type: 'sale', paymentMethod: 'card', orderId,
                amount: cardSale, tax: taxOnCardPortion, description: `Order #${orderId} (Card)`,
                timestamp: new Date(), taxable: true
            });
        }
        
        if (cashSale > 0) {
            const taxOnCashPortion = cashSale - (cashSale / (1 + TAX_RATE));
            paymentTransactions.push({
                id: `tx-${Date.now()}-cash`, type: 'sale', paymentMethod: 'cash', orderId,
                amount: cashSale, tax: taxOnCashPortion, description: `Order #${orderId} (Cash)`,
                timestamp: new Date(), taxable: true
            });
        }
        
        if(paymentTransactions.length > 0) {
            setTransactions(prev => [...prev, ...paymentTransactions]);
        }

        setShifts(prev => prev.map(s => s.id === activeShift.id ? {
            ...s,
            cashSales: s.cashSales + cashSale,
            cardSales: s.cardSales + cardSale,
            totalTax: s.totalTax + finalTax,
        } : s));
     }
     
     setPaymentModalOpen(false);
     setNotification({ title: t('payment'), message: t('paymentConfirmed') });
     if (updatedOrder) {
        handlePrintReceipt(updatedOrder);
     }
  };

  const handlePrintReceipt = (order: Order) => {
    setOrderToPrint(order);
    setReceiptModalOpen(true);
  };
  
  const handleReprintReceipt = (order: Order) => {
    if(order.status === 'paid') {
      handlePrintReceipt(order);
    }
  }

  // Shift Management Handlers
  const handleOpenDay = (balance: number) => {
    const newShift: ShiftReport = {
        id: `shift-${Date.now()}`, status: 'OPEN', dayOpenedTimestamp: new Date().toISOString(), dayClosedTimestamp: null,
        openingBalance: balance, cashSales: 0, cardSales: 0, manualIncomeCash: 0, manualIncomeCard: 0, totalTax: 0,
    };
    setShifts(prev => [...prev, newShift]);
    setOpeningBalanceModalOpen(false);
    setNotification({ title: t('dayOpened'), message: t('dayOpened') });
  };

  const handleCloseDay = () => {
    if (!activeShift) return;
    const openOrders = orders.filter(o => o.status !== 'paid' && o.status !== 'cancelled' && new Date(o.timestamp) >= new Date(activeShift.dayOpenedTimestamp));
    if (openOrders.length > 0) {
        setCreditConfirmationModalOpen(true);
        return;
    }
    
    const finalShift: ShiftReport = {
        ...activeShift,
        status: 'CLOSED', dayClosedTimestamp: new Date().toISOString(),
        finalCashSales: activeShift.cashSales,
        finalCardSales: activeShift.cardSales,
        finalManualIncomeCash: activeShift.manualIncomeCash,
        finalManualIncomeCard: activeShift.manualIncomeCard,
        finalTotalRevenue: activeShift.cashSales + activeShift.cardSales + activeShift.manualIncomeCash + activeShift.manualIncomeCard,
        finalTotalTax: activeShift.totalTax,
    };

    setShifts(prev => prev.map(s => s.id === activeShift.id ? finalShift : s));
    setShiftForWaiterSummary(finalShift);
    setWaiterShiftSummaryModalOpen(true);
    setCurrentTable(null);
    setView('day_closed');
    setNotification({ title: t('dayClosed'), message: t('dayClosed') });
  };
  
  const handleCreditAndClose = (ordersToCredit: (Order & { customerName: string })[]) => {
      setOrders(prev => {
          const updatedOrders = [...prev];
          ordersToCredit.forEach(oc => {
              const index = updatedOrders.findIndex(o => o.id === oc.id);
              if (index !== -1) {
                  updatedOrders[index] = { ...updatedOrders[index], status: 'on_credit', customerName: oc.customerName };
              }
          });
          return updatedOrders;
      });
      setCreditConfirmationModalOpen(false);
      handleCloseDay();
  };
  
  const handleSettleCredit = (order: Order) => {
    handlePayOrder(order);
  };
  
  // Admin CRUD Handlers
  const handleAddCategory = () => { setItemToEdit(null); setCategoryFormOpen(true); }
  const handleEditCategory = (cat: Category) => { setItemToEdit(cat); setCategoryFormOpen(true); }
  const handleSaveCategory = (cat: Partial<Category>) => {
    if(cat.id) {
        setCategories(prev => prev.map(c => c.id === cat.id ? {...c, name: cat.name!} : c));
    } else {
        setCategories(prev => [...prev, {id: `cat-${Date.now()}`, name: cat.name!}]);
    }
    setCategoryFormOpen(false);
    setNotification({ title: t('categoryManagement'), message: t('categorySaved') });
  }
  const handleDeleteCategory = (id: string) => {
    setConfirmationProps({
        title: t('areYouSure'), message: t('deleteCategoryConfirmation'), onConfirm: () => {
            setCategories(prev => prev.filter(c => c.id !== id));
            setConfirmationModalOpen(false);
            setNotification({ title: t('categoryManagement'), message: t('categoryDeleted') });
        }
    });
    setConfirmationModalOpen(true);
  }
  
  const handleAddMenuItem = () => { setItemToEdit(null); setMenuItemFormOpen(true); }
  const handleEditMenuItem = (item: MenuItem) => { setItemToEdit(item); setMenuItemFormOpen(true); }
  const handleSaveMenuItem = (item: Partial<MenuItem>) => {
    const fullItem = {
        ...item,
        ingredients: item.id ? menuItems.find(mi => mi.id === item.id)?.ingredients || [] : [],
        customizations: item.id ? menuItems.find(mi => mi.id === item.id)?.customizations : undefined
    } as MenuItem;
    if(item.id) {
        setMenuItems(prev => prev.map(m => m.id === item.id ? fullItem : m));
    } else {
        setMenuItems(prev => [...prev, {...fullItem, id: `item-${Date.now()}`}]);
    }
    setMenuItemFormOpen(false);
    setNotification({ title: t('menuManagement'), message: t('itemSaved') });
  }
  const handleDeleteMenuItem = (id: string) => {
    setConfirmationProps({
        title: t('areYouSure'), message: t('deleteItemConfirmation'), onConfirm: () => {
            setMenuItems(prev => prev.filter(m => m.id !== id));
            setConfirmationModalOpen(false);
            setNotification({ title: t('menuManagement'), message: t('itemDeleted') });
        }
    });
    setConfirmationModalOpen(true);
  }

  const handleAddInventoryItem = () => { setItemToEdit(null); setInventoryFormOpen(true); }
  const handleEditInventoryItem = (item: InventoryItem) => { setItemToEdit(item); setInventoryFormOpen(true); }
  const handleSaveInventoryItem = (item: Partial<InventoryItem>) => {
    if (item.id) {
        setInventory(prev => prev.map(i => i.id === item.id ? {...i, ...item} as InventoryItem : i));
    } else {
        setInventory(prev => [...prev, {...item, id: `inv-${Date.now()}`} as InventoryItem]);
    }
    setInventoryFormOpen(false);
    setNotification({ title: t('inventoryManagement'), message: t('stockSaved') });
  }
  const handleDeleteInventoryItem = (id: string) => {
     setConfirmationProps({
        title: t('areYouSure'), message: t('deleteItemConfirmation'), onConfirm: () => {
            setInventory(prev => prev.filter(i => i.id !== id));
            setConfirmationModalOpen(false);
            setNotification({ title: t('inventoryManagement'), message: t('stockDeleted') });
        }
    });
    setConfirmationModalOpen(true);
  }

  const handleAddWaiter = () => { setItemToEdit(null); setWaiterFormOpen(true); }
  const handleEditWaiter = (waiter: Waiter) => { setItemToEdit(waiter); setWaiterFormOpen(true); }
  const handleSaveWaiter = (waiter: Partial<Waiter>) => {
    if (waiter.id) {
        setWaiters(prev => prev.map(w => w.id === waiter.id ? {...w, name: waiter.name!} : w));
    } else {
        setWaiters(prev => [...prev, {id: `waiter-${Date.now()}`, name: waiter.name!}]);
    }
    setWaiterFormOpen(false);
    setNotification({ title: t('waiterManagement'), message: t('waiterSaved') });
  }
  const handleDeleteWaiter = (id: string) => {
    setConfirmationProps({
        title: t('areYouSure'), message: t('deleteWaiterConfirmation'), onConfirm: () => {
            setWaiters(prev => prev.filter(w => w.id !== id));
            setConfirmationModalOpen(false);
            setNotification({ title: t('waiterManagement'), message: t('waiterDeleted') });
        }
    });
    setConfirmationModalOpen(true);
  }

  const handleAddManualIncome = (amount: number, description: string, method: 'cash' | 'card') => {
      const totalAmount = amount;
      const taxAmount = totalAmount - (totalAmount / (1 + TAX_RATE));
      
      if(activeShift) {
        setShifts(prev => prev.map(s => {
            if (s.id === activeShift.id) {
                const updatedShift = { ...s };
                if (method === 'cash') {
                    updatedShift.manualIncomeCash += totalAmount;
                } else {
                    updatedShift.manualIncomeCard += totalAmount;
                }
                updatedShift.totalTax += taxAmount;
                return updatedShift;
            }
            return s;
        }));
      }
      
      setTransactions(prev => [...prev, {
        id: `tx-${Date.now()}`, type: 'manual', amount: totalAmount, tax: taxAmount,
        description: description, timestamp: new Date(), taxable: true,
        paymentMethod: method
      }]);
  };

  // --- RENDER LOGIC ---

  const renderMainContent = () => {
    switch(view) {
        case 'table':
            return <TableSelectionScreen orders={orders} onSelectTable={handleSelectTable} onOpenTableActions={handleOpenTableActions} selectedArea={selectedArea} setSelectedArea={setSelectedArea} t={t} activeShift={activeShift} inventory={inventory} onOpenDrawer={handleOpenDrawer} heldOrders={heldOrders} />;
        case 'pos':
            if (posView === 'order') {
                return (
                    <>
                        <Header lang={lang} toggleLang={toggleLang} searchTerm={searchTerm} setSearchTerm={setSearchTerm} onOpenDrawer={handleOpenDrawer} t={t} />
                        <div className="flex-1 flex overflow-hidden">
                            <div className="w-2/3 flex flex-col">
                                <Menu menuItems={menuItems} categories={categories} inventory={inventory} selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} onSelectItem={handleSelectItem} onCustomizeItem={handleCustomizeItem} searchTerm={searchTerm} t={t} />
                            </div>
                            <div className="w-1/3 h-full border-l border-gray-200">
                                <CurrentOrder currentOrderItems={currentOrderItems} subtotal={subtotal} tax={tax} total={total} notes={currentOrderNotes} onUpdateNotes={setCurrentOrderNotes} onUpdateQuantity={handleUpdateQuantity} onRemoveItem={handleRemoveItem} onSubmitOrder={handleSubmitOrder} onUpdateItemDiscount={handleUpdateItemDiscount} onHoldOrder={handleHoldOrder} t={t} />
                            </div>
                        </div>
                    </>
                );
            } else { // 'queue'
                return (
                    <div className="w-full h-full p-4">
                        <OrderQueue orders={orders} waiters={waiters} onUpdateStatus={handleUpdateStatus} onPayOrder={handlePayOrder} onReprintReceipt={handleReprintReceipt} t={t} lang={lang} activeShift={activeShift} />
                    </div>
                );
            }
        case 'credit':
            const creditOrders = orders.filter(o => o.status === 'on_credit');
            return (
                <>
                   <Header lang={lang} toggleLang={toggleLang} searchTerm={""} setSearchTerm={() => {}} onOpenDrawer={handleOpenDrawer} t={t} />
                   <div className="flex-1 overflow-y-auto">
                     <CreditManagement creditOrders={creditOrders} onSettle={handleSettleCredit} t={t} />
                   </div>
                </>
            );
        case 'day_closed':
            return (
                <div className="flex-1 flex flex-col h-full overflow-hidden items-center justify-center text-center">
                    <div className="bg-white p-10 rounded-lg shadow-md">
                         <button onClick={() => setOpeningBalanceModalOpen(true)} className="bg-green-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-green-700 transition-colors text-xl">
                            <SunIcon className="w-8 h-8"/>
                            <span className="font-bold">{t('openNewDay')}</span>
                        </button>
                    </div>
                </div>
            );
        case 'admin':
        case 'manager_dashboard': // Let AdminView handle rendering for both roles
            return <AdminView 
              lang={lang} t={t} toggleLang={toggleLang} orders={orders} waiters={waiters} inventory={inventory} categories={categories}
              menuItems={menuItems} transactions={transactions} activeShift={activeShift} allShifts={shifts} dayStatus={dayStatus}
              onUpdateOrderStatus={handleUpdateStatus} onPayOrder={handlePayOrder} onReprintReceipt={handleReprintReceipt}
              onAddCategory={handleAddCategory} onEditCategory={handleEditCategory} onDeleteCategory={handleDeleteCategory}
              onAddMenuItem={handleAddMenuItem} onEditMenuItem={handleEditMenuItem} onDeleteMenuItem={handleDeleteMenuItem}
              onAddInventoryItem={handleAddInventoryItem} onEditInventoryItem={handleEditInventoryItem} onDeleteInventoryItem={handleDeleteInventoryItem}
              onAddWaiter={handleAddWaiter} onEditWaiter={handleEditWaiter} onDeleteWaiter={handleDeleteWaiter}
              onAddManualIncome={handleAddManualIncome} onSettleCredit={handleSettleCredit}
              currentUserRole={currentUserRole}
            />;
        default:
            return <TableSelectionScreen orders={orders} onSelectTable={handleSelectTable} onOpenTableActions={handleOpenTableActions} selectedArea={selectedArea} setSelectedArea={setSelectedArea} t={t} activeShift={activeShift} inventory={inventory} onOpenDrawer={handleOpenDrawer} heldOrders={heldOrders} />;
    }
  };

  const renderView = () => {
    if (view === 'waiter' || !currentWaiterId) {
      return <WaiterSelectionScreen waiters={waiters} onStartOrder={handleStartOrder} t={t} />;
    }

    let activeSidebarView: string = view;
    if (view === 'pos') {
        activeSidebarView = posView === 'queue' ? 'queue' : 'tables';
    } else if (view === 'table') {
        activeSidebarView = 'tables';
    } else if (view === 'manager_dashboard') {
        activeSidebarView = 'admin'; // Highlight the admin icon for manager dashboard
    }

    return (
        <div className="flex h-full">
            <Sidebar 
                activeView={activeSidebarView}
                onNavigate={handleNavigation}
                onLogout={handleLogout}
                waiterName={currentUserRole ? t(currentUserRole.toLowerCase()) : (currentWaiter?.name || '')}
                t={t}
                dayStatus={dayStatus}
                onOpenDay={() => setOpeningBalanceModalOpen(true)}
                onCloseDay={handleCloseDay}
            />
            <main className="flex-1 flex flex-col h-full overflow-hidden bg-gray-100">
              {renderMainContent()}
            </main>
        </div>
    );
  };

  return (
    <div className="h-screen w-screen font-sans" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {renderView()}

      {/* Modals */}
      <CustomizationModal isOpen={isCustomizationModalOpen} onClose={() => setCustomizationModalOpen(false)} item={itemToCustomize} onAddToCart={handleAddToCart} t={t} lang={lang} />
      <PaymentModal isOpen={isPaymentModalOpen} onClose={() => setPaymentModalOpen(false)} order={orderToPay} onConfirmPayment={handleConfirmPayment} onPrint={handlePrintReceipt} t={t} lang={lang} />
      <PinModal isOpen={isPinModalOpen} onClose={() => setPinModalOpen(false)} onSuccess={(role) => { if(pinSuccessCallback) pinSuccessCallback(role) ; setPinModalOpen(false); }} t={t} prompt={t('enterPin')} />
      <OpeningBalanceModal isOpen={isOpeningBalanceModalOpen} onClose={() => setOpeningBalanceModalOpen(false)} onConfirm={handleOpenDay} t={t} lang={lang} />
      <ShiftSummaryModal isOpen={isShiftSummaryModalOpen} onClose={() => setShiftSummaryModalOpen(false)} shiftReport={shiftToSummarize} t={t} lang={lang} />
      <ReceiptPreviewModal isOpen={isReceiptModalOpen} onClose={() => setReceiptModalOpen(false)} order={orderToPrint} waiters={waiters} t={t} />
      <TableActionsModal
        isOpen={isTableActionsModalOpen}
        onClose={() => setTableActionsModalOpen(false)}
        order={orderForTableActions}
        onAddToOrder={handleAddToExistingOrder}
        onGoToPayment={handleGoToPaymentFromActions}
        t={t}
      />
      <HeldOrderActionsModal
        isOpen={isHeldOrderModalOpen}
        onClose={() => setHeldOrderModalOpen(false)}
        heldOrder={heldOrderForTable}
        onResume={handleResumeOrder}
        onStartNew={handleStartNewOverHeld}
        t={t}
      />
      <ConfirmationModal isOpen={isConfirmationModalOpen} onClose={() => setConfirmationModalOpen(false)} {...confirmationProps} t={t} lang={lang} />
      <CreditConfirmationModal isOpen={isCreditConfirmationModalOpen} onClose={() => setCreditConfirmationModalOpen(false)} onConfirm={handleCreditAndClose} openOrders={orders.filter(o => o.status !== 'paid' && o.status !== 'cancelled' && activeShift && new Date(o.timestamp) >= new Date(activeShift.dayOpenedTimestamp))} t={t} lang={lang} />
      <WaiterShiftSummaryModal isOpen={isWaiterShiftSummaryModalOpen} onClose={() => setWaiterShiftSummaryModalOpen(false)} shiftReport={shiftForWaiterSummary} t={t} lang={lang} />
      
      {/* Admin Form Modals */}
      <CategoryFormModal isOpen={isCategoryFormOpen} onClose={() => setCategoryFormOpen(false)} onSave={handleSaveCategory} category={itemToEdit} t={t} />
      <MenuItemFormModal isOpen={isMenuItemFormOpen} onClose={() => setMenuItemFormOpen(false)} onSave={handleSaveMenuItem} item={itemToEdit} categories={categories} inventory={inventory} t={t} />
      <InventoryFormModal isOpen={isInventoryFormOpen} onClose={() => setInventoryFormOpen(false)} onSave={handleSaveInventoryItem} item={itemToEdit} t={t} currentUserRole={currentUserRole} />
      <WaiterFormModal isOpen={isWaiterFormOpen} onClose={() => setWaiterFormOpen(false)} onSave={handleSaveWaiter} waiter={itemToEdit} t={t} />

      {/* Notification */}
      {notification && <Notification title={notification.title} message={notification.message} onClose={() => setNotification(null)} />}
    </div>
  );
};

export default App;