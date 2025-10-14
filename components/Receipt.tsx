import React from 'react';
import { Order, OrderItem, Waiter } from '../types';
import { formatCurrency } from '../utils/helpers';
import { TAX_RATE } from '../constants';

interface ReceiptProps {
  order: Order | null;
  waiters: Waiter[];
  t: (key: string) => string;
}

const Receipt: React.FC<ReceiptProps> = ({ order, waiters, t }) => {
  if (!order) return null;

  const renderCustomizations = (item: OrderItem) => {
    const customizations = Object.values(item.customizations).flat();
    const customizationText = customizations.map(opt => opt.name).join(', ');
    const removedText = item.removedIngredients.length > 0 ? `${t('without')} ${item.removedIngredients.join(', ')}` : '';
    if (!customizationText && !removedText) return null;
    return (
      <div className="flex">
        <div className="w-[12.5%]"></div> {/* Spacer */}
        <div className="flex-grow text-gray-600" style={{fontSize: '10px', paddingLeft: '4px'}}>
            - {customizationText}{customizationText && removedText ? '; ' : ''}{removedText}
        </div>
      </div>
    );
  };

  const subtotal = order.subtotal;
  const tax = order.tax;
  const waiterName = waiters.find(w => w.id === order.waiterId)?.name || 'N/A';
  
  let paymentDetailsText = 'N/A';
  if (order.paymentDetails) {
      switch (order.paymentDetails.method) {
          case 'cash':
              paymentDetailsText = t('cash');
              break;
          case 'card':
              paymentDetailsText = t('card');
              break;
          case 'split':
              paymentDetailsText = `${t('cash')}: ${formatCurrency(order.paymentDetails.cashAmount)} / ${t('card')}: ${formatCurrency(order.paymentDetails.cardAmount)}`;
              break;
      }
  }

  return (
    <div id="receipt-container" className="bg-white text-black font-mono" style={{ width: '288px', padding: '8px', fontSize: '12px' }}>
      {/* Header */}
      <div className="text-center mb-3">
        <h1 className="text-xl font-bold uppercase">Sisha Marrakech</h1>
        <p className="text-xs">123 Oasis Lane, Marrakech</p>
        <p className="text-xs">Tel: +212 123 456789</p>
      </div>

      {/* Order Info */}
      <div className="text-xs space-y-1 mb-3">
        <p><strong>{t('order')}:</strong> #{order.id}</p>
        <p><strong>{t('table')}:</strong> {order.tableNumber} ({t(order.area.toLowerCase())})</p>
        <p><strong>{t('waiter')}:</strong> {waiterName}</p>
        <p><strong>{t('dateTime')}:</strong> {new Date(order.timestamp).toLocaleString()}</p>
      </div>

      {order.notes && (
        <>
          <div className="border-t border-dashed border-black my-2"></div>
          <div className="text-xs mb-2">
            <p className="font-bold uppercase">{t('notes')}:</p>
            <p>{order.notes}</p>
          </div>
        </>
      )}

      {/* Separator */}
      <div className="border-t border-black my-2"></div>

      {/* Items Header */}
      <div className="flex font-bold text-xs">
        <div className="w-[12.5%]">Q.</div>
        <div className="flex-grow">Item</div>
        <div className="w-[37.5%] text-right">Price</div>
      </div>
      
      {/* Items */}
      <div className="border-b border-black pb-2">
        {order.items.map(item => (
          <div key={item.id} className="mt-2 text-xs">
            <div className="flex">
              <div className="w-[12.5%] align-top">{item.quantity}</div>
              <div className="flex-grow">{item.menuItem.name}</div>
              <div className="w-[37.5%] text-right">{formatCurrency(item.totalPrice * (1 - (item.discount || 0) / 100))}</div>
            </div>
            {renderCustomizations(item)}
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="mt-3 space-y-1 text-xs">
        <div className="flex justify-between">
          <span>{t('subtotal')}:</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>{t('tax')} ({(TAX_RATE * 100).toFixed(0)}%):</span>
          <span>{formatCurrency(tax)}</span>
        </div>
      </div>
      
      <div className="border-t border-black my-2"></div>
      
      <div className="flex justify-between font-bold text-base mb-2">
        <span>TOTAL:</span>
        <span>{formatCurrency(order.total)}</span>
      </div>

       <div className="border-t border-black my-2"></div>

      {/* Payment Info */}
      <div className="text-center text-xs">
        <p>{t('paymentMethod')}: {paymentDetailsText}</p>
      </div>
      
      {/* Footer */}
      <div className="text-center mt-4 text-xs">
        <p className="font-bold">Thank you for your visit!</p>
        <p>¡Gracias por su visita!</p>
      </div>
    </div>
  );
};

export default Receipt;