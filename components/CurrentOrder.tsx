import React, { useState } from 'react';
import { OrderItem } from '../types';
import { formatCurrency } from '../utils/helpers';
import { TrashIcon, ChevronDownIcon, PlusIcon, MinusIcon, CalculatorIcon } from './icons';
// Fix: Import TAX_RATE to resolve reference error.
import { TAX_RATE } from '../constants';
import NumpadModal from './NumpadModal';

interface CurrentOrderProps {
  currentOrderItems: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  notes: string;
  onUpdateNotes: (notes: string) => void;
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onSubmitOrder: () => void;
  onUpdateItemDiscount: (itemId: string, discount: number) => void;
  onHoldOrder: () => void;
  t: (key: string) => string;
}

const CurrentOrder: React.FC<CurrentOrderProps> = ({
  currentOrderItems,
  subtotal,
  tax,
  total,
  notes,
  onUpdateNotes,
  onUpdateQuantity,
  onRemoveItem,
  onSubmitOrder,
  onUpdateItemDiscount,
  onHoldOrder,
  t,
}) => {
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
  const [numpadConfig, setNumpadConfig] = useState<{
    isOpen: boolean;
    itemId: string | null;
    initialValue: number;
  }>({ isOpen: false, itemId: null, initialValue: 0 });


  const openNumpad = (itemId: string, initialValue: number) => {
    setNumpadConfig({
      isOpen: true,
      itemId: itemId,
      initialValue: initialValue,
    });
  };

  const closeNumpad = () => {
    setNumpadConfig({ isOpen: false, itemId: null, initialValue: 0 });
  };

  const handleNumpadConfirm = (value: number) => {
    if (numpadConfig.itemId) {
      onUpdateItemDiscount(numpadConfig.itemId, value);
    }
    closeNumpad();
  };

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
    <div className="bg-white rounded-lg shadow-md flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold text-gray-800">{t('currentOrder')}</h2>
      </div>

      <div className="flex-grow overflow-y-auto p-2 space-y-1">
        {currentOrderItems.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">{t('orderIsEmpty')}</p>
          </div>
        ) : (
          currentOrderItems.map((item, index) => (
            <div key={item.id} className="rounded-lg bg-gray-50 p-3">
              <div className="flex items-center">
                <span className="text-sm font-semibold text-gray-500 mr-2">{index + 1}</span>
                <div className="flex-grow">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-800">{item.menuItem.name}</p>
                    {item.discount && item.discount > 0 && (
                        <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-0.5 rounded-full">
                            -{item.discount}%
                        </span>
                    )}
                  </div>
                   {renderCustomizations(item)}
                </div>
                <div className="flex items-center">
                  <p className="font-bold text-gray-800 mx-4">{formatCurrency(item.totalPrice * (1-(item.discount || 0)/100))}</p>
                  <button onClick={() => onRemoveItem(item.id)} className="text-gray-400 hover:text-red-500 mx-2">
                    <TrashIcon className="w-5 h-5" />
                  </button>
                  <button onClick={() => setExpandedItemId(expandedItemId === item.id ? null : item.id)} className="text-gray-500 hover:text-gray-800">
                    <ChevronDownIcon className={`w-5 h-5 transition-transform ${expandedItemId === item.id ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>
              {expandedItemId === item.id && (
                <div className="mt-4 flex justify-between items-center bg-white p-3 rounded-md">
                   <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-700">{t('quantity')}</label>
                      <div className="flex items-center border rounded-md">
                        <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="p-1 disabled:opacity-50" disabled={item.quantity <= 1}><MinusIcon className="w-4 h-4" /></button>
                        <span className="font-bold w-6 text-center text-sm">{item.quantity}</span>
                        <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="p-1"><PlusIcon className="w-4 h-4" /></button>
                      </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">{t('discount')}(%)</label>
                    <button
                        type="button"
                        onClick={() => openNumpad(item.id, item.discount || 0)}
                        className="w-24 p-2 border rounded-md text-center text-lg font-bold flex items-center justify-between hover:bg-gray-50"
                        aria-label="Enter discount percentage"
                    >
                        <span>{item.discount || 0}</span>
                        <CalculatorIcon className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {currentOrderItems.length > 0 && (
        <>
        <div className="p-4 border-t">
          <label htmlFor="order-notes" className="text-sm font-semibold text-gray-700">{t('orderNotes')}</label>
          <textarea
            id="order-notes"
            rows={2}
            className="w-full mt-1 p-2 border rounded-md text-sm"
            placeholder={t('orderNotesPlaceholder')}
            value={notes}
            onChange={(e) => onUpdateNotes(e.target.value)}
          />
        </div>
        <div className="p-4 border-t mt-auto bg-white rounded-b-lg">
          <div className="space-y-2 mb-4 text-sm">
            <div className="flex justify-between items-center text-gray-600">
              <span>{t('subtotal')}:</span>
              <span className="font-medium">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between items-center text-gray-600">
              <span>{t('tax')} ({(TAX_RATE * 100).toFixed(0)}%):</span>
              <span className="font-medium">{formatCurrency(tax)}</span>
            </div>
            <div className="flex justify-between items-center text-gray-800 text-lg">
              <span className="font-bold">{t('payableAmount')}:</span>
              <span className="font-bold">{formatCurrency(total)}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
             <button
              onClick={onHoldOrder}
              className="w-full bg-orange-100 text-orange-700 font-bold py-3 px-4 rounded-lg hover:bg-orange-200 transition duration-300"
            >
              {t('holdOrder')}
            </button>
            <button
              onClick={onSubmitOrder}
              className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition duration-300"
            >
              {t('proceed')}
            </button>
          </div>
        </div>
        </>
      )}
      <NumpadModal
        isOpen={numpadConfig.isOpen}
        onClose={closeNumpad}
        onConfirm={handleNumpadConfirm}
        initialValue={numpadConfig.initialValue}
        title={`${t('discount')} (%)`}
        t={t}
        allowDecimal={false}
      />
    </div>
  );
};

export default CurrentOrder;