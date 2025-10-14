import React from 'react';
import { Order, OrderItem } from '../types';
import { formatCurrency } from '../utils/helpers';
import { XMarkIcon, CreditCardIcon, PencilSquareIcon } from './icons';
import { TAX_RATE } from '../constants';

interface OrderSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onGoToPayment: (order: Order) => void;
  onAddToOrder: (order: Order) => void;
  t: (key: string) => string;
}

const OrderSummaryModal: React.FC<OrderSummaryModalProps> = ({ isOpen, onClose, order, onGoToPayment, onAddToOrder, t }) => {
  if (!isOpen || !order) return null;

  const subtotal = order.subtotal;
  const tax = order.tax;

  const renderCustomizations = (item: OrderItem) => {
    const customizations = Object.values(item.customizations).flat();
    const customizationText = customizations.map(opt => opt.name).join(', ');
    const removedText = item.removedIngredients.length > 0 ? `${t('without')} ${item.removedIngredients.join(', ')}` : '';
    if (!customizationText && !removedText) return null;
    return (
      <p className="text-xs text-gray-500 mt-1 truncate">
        {customizationText}{customizationText && removedText ? '; ' : ''}{removedText}
      </p>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col text-gray-800">
        {/* Header */}
        <div className="p-5 border-b flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{t('viewOrderSummary')}</h2>
            <p className="text-gray-600">{t('table')} {order.tableNumber} ({t(order.area.toLowerCase())})</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><XMarkIcon className="w-7 h-7"/></button>
        </div>

        {/* Body (Order Items) */}
        <div className="p-6 flex-grow overflow-y-auto space-y-3">
          {order.items.map(item => (
            <div key={item.id} className="pb-2 border-b last:border-0">
              <div className="flex justify-between items-start">
                <div className="flex-grow pr-4">
                  <p className="font-semibold">{item.quantity}x {item.menuItem.name}</p>
                  {renderCustomizations(item)}
                </div>
                <p className="font-semibold">{formatCurrency(item.totalPrice * (1 - (item.discount || 0) / 100))}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer (Totals & Actions) */}
        <div className="p-6 border-t mt-auto bg-gray-50 space-y-4">
            <div className="space-y-2 text-md">
                <div className="flex justify-between items-center text-gray-600">
                    <span>{t('subtotal')}:</span>
                    <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center text-gray-600">
                    <span>{t('tax')} ({(TAX_RATE * 100).toFixed(0)}%):</span>
                    <span className="font-medium">{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between items-center text-gray-800 text-2xl pt-2 border-t mt-2">
                    <span className="font-bold">{t('total')}:</span>
                    <span className="font-bold">{formatCurrency(order.total)}</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                    onClick={() => onAddToOrder(order)}
                    className="w-full bg-blue-100 text-blue-700 font-bold py-3 px-4 rounded-lg hover:bg-blue-200 transition duration-300 flex items-center justify-center gap-2"
                >
                    <PencilSquareIcon className="w-5 h-5" />
                    {t('addToExistingOrder')}
                </button>
                <button
                    onClick={() => onGoToPayment(order)}
                    className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition duration-300 flex items-center justify-center gap-2"
                >
                    <CreditCardIcon className="w-5 h-5" />
                    {t('proceedToPayment')}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummaryModal;