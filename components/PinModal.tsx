// Fix: Created PinModal component to handle admin access verification.
import React, { useState } from 'react';
import { PINS, UserRole } from '../constants';

interface PinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (role: UserRole) => void;
  t: (key: string) => string;
  prompt?: string;
  showNumpad?: boolean;
}

const PinModal: React.FC<PinModalProps> = ({ isOpen, onClose, onSuccess, t, prompt }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handlePinChange = (value: string) => {
    if (error) setError('');
    if (pin.length < 4) {
      const newPin = pin + value;
      setPin(newPin);
       if (newPin.length === 4) {
        validatePin(newPin);
      }
    }
  };
  
  const handleDelete = () => {
    if (error) setError('');
    setPin(pin.slice(0, -1));
  }

  const validatePin = (finalPin: string) => {
    const role = PINS[finalPin];
    if (role) {
      onSuccess(role);
      setPin('');
    } else {
      setError(t('incorrectPin'));
      setTimeout(() => {
        setPin('');
        setError('');
      }, 1000);
    }
  };
  
  const handleClose = () => {
    setPin('');
    setError('');
    onClose();
  }

  const pinDisplay = '••••'.split('').map((char, index) => (
    <div key={index} className={`w-10 h-12 rounded-lg border-2 ${error ? 'border-red-500' : 'border-gray-500'} flex items-center justify-center`}>
      {pin.length > index && <div className={`w-4 h-4 rounded-full ${error ? 'bg-red-500' : 'bg-white'}`}></div>}
    </div>
  ));

  const keypadButtons = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'DEL'].map(val => (
    <button
      key={val}
      onClick={() => val === 'DEL' ? handleDelete() : (val !== '' && handlePinChange(val))}
      disabled={val === ''}
      className={`h-16 rounded-lg text-2xl font-semibold transition-colors ${val === '' ? 'cursor-default' : 'bg-gray-700 hover:bg-gray-600 focus:bg-indigo-600 text-white'}`}
    >
      {val === 'DEL' ? t('delete') : val}
    </button>
  ));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl text-center w-full max-w-sm animate-fade-in-up">
        <h2 className="text-2xl font-bold mb-4 text-white">{prompt || t('enterPin')}</h2>
        <div className="flex justify-center items-center gap-2 mb-6">
          {pinDisplay}
        </div>
        {error && <p className="text-red-400 mb-4 h-6">{error}</p>}
        {!error && <div className="h-6 mb-4"></div>}
        <div className="grid grid-cols-3 gap-4">
          {keypadButtons}
        </div>
        <button onClick={handleClose} className="mt-6 text-gray-400 hover:text-white">
          {t('cancel')}
        </button>
      </div>
    </div>
  );
};

export default PinModal;