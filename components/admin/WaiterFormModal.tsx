import React, { useState, useEffect } from 'react';
import { Waiter } from '../../types';

interface WaiterFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (waiter: Waiter) => void;
  waiter: Waiter | null;
  t: (key: string) => string;
}

const WaiterFormModal: React.FC<WaiterFormModalProps> = ({ isOpen, onClose, onSave, waiter, t }) => {
  const [name, setName] = useState('');

  useEffect(() => {
    setName(waiter?.name || '');
  }, [waiter]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ id: waiter?.id, name });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-4 border-b font-bold">{waiter ? t('editWaiter') : t('addNewWaiter')}</div>
        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm">{t('name')}</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="w-full border p-2 rounded-md"
              autoFocus
            />
          </div>
        </div>
        <div className="p-4 bg-gray-50 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">{t('cancel')}</button>
          <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md">{t('save')}</button>
        </div>
      </form>
    </div>
  );
};

export default WaiterFormModal;