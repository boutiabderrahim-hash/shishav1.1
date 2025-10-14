import React from 'react';
import { ShiftReport, Language } from '../../types';
import { formatCurrency } from '../../utils/helpers';
import { CheckCircleIcon, XMarkIcon } from '../icons';

interface ShiftSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  shiftReport: ShiftReport | null;
  t: (key: string) => string;
  lang: Language;
}

const ShiftSummaryModal: React.FC<ShiftSummaryModalProps> = ({ isOpen, onClose, shiftReport, t, lang }) => {
  if (!isOpen || !shiftReport) return null;
  
  const formatDateTime = (isoString: string | null) => {
    if (!isoString) return 'N/A';
    return new Date(isoString).toLocaleString(lang, {
        dateStyle: 'medium',
        timeStyle: 'short'
    });
  }
  
  const totalManualIncome = (shiftReport.finalManualIncomeCash || 0) + (shiftReport.finalManualIncomeCard || 0);

  const summaryItems = [
    { label: t('openingBalance'), value: formatCurrency(shiftReport.openingBalance) },
    { label: t('cashSales'), value: formatCurrency(shiftReport.finalCashSales || 0) },
    { label: t('cardSales'), value: formatCurrency(shiftReport.finalCardSales || 0) },
    { label: t('manualIncome'), value: formatCurrency(totalManualIncome) },
    { label: t('totalRevenue'), value: formatCurrency(shiftReport.finalTotalRevenue || 0), isTotal: true },
    { label: t('totalTax'), value: formatCurrency(shiftReport.finalTotalTax || 0), isTotal: true },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col text-gray-800">
        <div className="p-5 border-b flex justify-between items-center">
            <div className="flex items-center gap-3">
                <CheckCircleIcon className="w-8 h-8 text-green-500" />
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">{t('shiftSummary')}</h2>
                    <p className="text-sm text-gray-500">{t('dayClosedSuccessfully')}</p>
                </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><XMarkIcon className="w-6 h-6"/></button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4">
            <div className="text-sm space-y-1 text-gray-600">
                <p><strong>{t('openedOn')}:</strong> {formatDateTime(shiftReport.dayOpenedTimestamp)}</p>
                <p><strong>{t('closedOn')}:</strong> {formatDateTime(shiftReport.dayClosedTimestamp)}</p>
            </div>
            
            <div className="border-t pt-4">
                 {summaryItems.map(item => (
                    <div key={item.label} className={`flex justify-between py-2 border-b ${item.isTotal ? 'font-bold text-lg text-indigo-700' : 'text-md'}`}>
                        <span>{item.label}:</span>
                        <span>{item.value}</span>
                    </div>
                 ))}
            </div>
        </div>

        <div className="p-4 border-t mt-auto bg-gray-50">
           <button onClick={onClose} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
                {t('close')}
           </button>
        </div>
      </div>
    </div>
  );
};

export default ShiftSummaryModal;