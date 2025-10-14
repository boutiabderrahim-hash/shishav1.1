// Fix: Created PaymentModal component to resolve module error.
import React, { useState, useEffect, useMemo } from 'react';
import { Order, Language, OrderItem, PaymentDetails } from '../types';
import { formatCurrency } from '../utils/helpers';
import { XMarkIcon, ChevronDownIcon, CalculatorIcon } from './icons';
import { TAX_RATE } from '../constants';
import NumpadModal from './NumpadModal';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onConfirmPayment: (orderId: number, details: PaymentDetails, finalTotal: number, finalTax: number) => void;
  onPrint: (order: Order) => void;
  t: (key: string) => string;
  lang: Language;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, order, onConfirmPayment, onPrint, t, lang }) => {
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [amountReceived, setAmountReceived] = useState('');
  const [change, setChange] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  const [isDiscountNumpadOpen, setDiscountNumpadOpen] = useState(false);
  const [isAmountReceivedNumpadOpen, setAmountReceivedNumpadOpen] = useState(false);

  
  const finalTotal = order ? Math.max(0, order.total - discountAmount) : 0;
  const finalTax = finalTotal - (finalTotal / (1 + TAX_RATE));


  useEffect(() => {
    if (order) {
        setDiscountAmount(0);
        setShowSummary(false);
        setPaymentMethod('cash');
    }
  },[order]);

  useEffect(() => {
    if (order) {
        setAmountReceived(finalTotal.toFixed(2));
    }
  }, [finalTotal, order]);
  
  useEffect(() => {
    if (order && paymentMethod === 'cash') {
      const received = parseFloat(amountReceived);
      const amountToPay = finalTotal;
      if (!isNaN(received) && received >= amountToPay) {
        setChange(received - amountToPay);
      } else {
        setChange(0);
      }
    } else {
      setChange(0);
    }
  }, [amountReceived, order, paymentMethod, finalTotal]);

  if (!isOpen || !order) return null;

  const handleConfirm = () => {
    let details: PaymentDetails;
    if (paymentMethod === 'cash') {
      details = { method: 'cash', amount: finalTotal };
    } else { // card
      details = { method: 'card', amount: finalTotal };
    }
    onConfirmPayment(order.id, details, finalTotal, finalTax);
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

  const isCashInvalid = paymentMethod === 'cash' && (amountReceived === '' || parseFloat(amountReceived) < finalTotal);
  const isConfirmDisabled = isCashInvalid;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col text-gray-800">
        <div className="p-5 border-b flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-indigo-700">{t('payment')}</h2>
            <p className="text-gray-600">{t('order')} #{order.id} - {t('table')} {order.tableNumber}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><XMarkIcon className="w-7 h-7"/></button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4">
            <div className="bg-indigo-50 p-4 rounded-lg text-center">
                <p className="text-lg text-indigo-800 font-medium">{t('payableAmount')}</p>
                <p className="text-5xl font-bold text-indigo-700">{formatCurrency(finalTotal)}</p>
            </div>

              <>
                <div className="border rounded-lg p-3 space-y-3">
                     <div>
                        <label htmlFor="discount-amount" className="font-medium">{t('discountAmount')}</label>
                        <button
                            type="button"
                            onClick={() => setDiscountNumpadOpen(true)}
                            className="w-full mt-1 p-2 border rounded-md text-center text-lg font-bold flex items-center justify-between hover:bg-gray-50"
                        >
                            <span>{formatCurrency(discountAmount)}</span>
                            <CalculatorIcon className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            type="button"
                            onClick={() => setDiscountAmount(order.total / 2)}
                            className="bg-orange-100 text-orange-700 font-semibold py-2 rounded-lg hover:bg-orange-200 transition"
                        >
                            50%
                        </button>
                        <button
                            type="button"
                            onClick={() => setDiscountAmount(order.total)}
                            className="bg-orange-100 text-orange-700 font-semibold py-2 rounded-lg hover:bg-orange-200 transition"
                        >
                            100% ({t('free')})
                        </button>
                    </div>
                </div>
                
                <div>
                  <button onClick={() => setShowSummary(!showSummary)} className="w-full text-left p-2 font-semibold text-gray-700 flex justify-between items-center">
                    {t('viewOrderSummary')}
                    <ChevronDownIcon className={`w-5 h-5 transition-transform ${showSummary ? 'rotate-180' : ''}`} />
                  </button>
                  {showSummary && (
                    <div className="border rounded-lg p-2 mt-1 max-h-32 overflow-y-auto bg-gray-50">
                      {order.items.map(item => (
                        <div key={item.id} className="py-1 border-b last:border-b-0">
                           <div className="flex justify-between text-sm">
                              <span className="font-semibold">{item.quantity}x {item.menuItem.name}</span>
                              <span className="font-mono">{formatCurrency(item.totalPrice)}</span>
                            </div>
                            {renderCustomizations(item)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                    <h3 className="font-bold text-lg mb-3">{t('paymentMethod')}</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => setPaymentMethod('cash')} className={`p-4 rounded-lg font-semibold text-center transition-colors ${paymentMethod === 'cash' ? 'bg-indigo-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>{t('cash')}</button>
                        <button onClick={() => setPaymentMethod('card')} className={`p-4 rounded-lg font-semibold text-center transition-colors ${paymentMethod === 'card' ? 'bg-indigo-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>{t('card')}</button>
                    </div>
                </div>
                
                {paymentMethod === 'cash' && (
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="amount-received" className="block text-sm font-medium text-gray-700">{t('amountReceived')}</label>
                             <button
                                type="button"
                                onClick={() => setAmountReceivedNumpadOpen(true)}
                                className="w-full mt-1 p-2 border rounded-md text-center text-lg font-bold flex items-center justify-between hover:bg-gray-50"
                            >
                                <span>{formatCurrency(parseFloat(amountReceived) || 0)}</span>
                                <CalculatorIcon className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        <div className="text-right text-lg font-semibold">
                            {t('change')}: <span className="text-green-600">{formatCurrency(change)}</span>
                        </div>
                    </div>
                )}
              </>
        </div>

        <div className="p-4 border-t mt-auto grid grid-cols-1 gap-3 bg-gray-50">
           <button
             onClick={handleConfirm}
             disabled={isConfirmDisabled}
             className="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 disabled:bg-gray-400"
           >
             {t('confirmPayment')}
           </button>
        </div>
      </div>

      <NumpadModal
        isOpen={isDiscountNumpadOpen}
        onClose={() => setDiscountNumpadOpen(false)}
        onConfirm={(value) => setDiscountAmount(value)}
        initialValue={discountAmount}
        title={t('discountAmount')}
        t={t}
        allowDecimal={true}
      />
      <NumpadModal
        isOpen={isAmountReceivedNumpadOpen}
        onClose={() => setAmountReceivedNumpadOpen(false)}
        onConfirm={(value) => setAmountReceived(String(value))}
        initialValue={parseFloat(amountReceived) || 0}
        title={t('amountReceived')}
        t={t}
        allowDecimal={true}
      />
    </div>
  );
};

export default PaymentModal;