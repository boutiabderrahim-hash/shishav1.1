import React from 'react';
import { Waiter } from '../types';
import { UserCircleIcon } from './icons';

interface WaiterSelectionScreenProps {
  waiters: Waiter[];
  onStartOrder: (waiterId: string) => void;
  t: (key: string) => string;
}

const WaiterSelectionScreen: React.FC<WaiterSelectionScreenProps> = ({ waiters, onStartOrder, t }) => {

  return (
    <div className="flex items-center justify-center h-full">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl text-center w-full max-w-2xl animate-fade-in-up">
        <h2 className="text-3xl font-bold mb-2 text-white">{t('welcome')}</h2>
        <p className="text-gray-400 mb-8">{t('selectWaiterToBegin')}</p>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
            {waiters.map(waiter => (
                <button
                    key={waiter.id}
                    onClick={() => onStartOrder(waiter.id)}
                    className={`p-4 rounded-lg flex flex-col items-center justify-center transition-all duration-200 aspect-square bg-gray-700 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-400 focus:scale-105`}
                >
                    <UserCircleIcon className="w-16 h-16 mx-auto text-gray-400 mb-2" />
                    <span className="font-semibold text-white">{waiter.name}</span>
                </button>
            ))}
        </div>

      </div>
    </div>
  );
};

export default WaiterSelectionScreen;