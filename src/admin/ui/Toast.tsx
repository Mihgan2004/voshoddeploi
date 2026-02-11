
import React, { createContext, useContext, useState, useCallback, ReactNode, PropsWithChildren } from 'react';

type ToastType = 'success' | 'error' | 'info';
interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  addToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: PropsWithChildren) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substring(7);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              px-4 py-3 min-w-[300px] border border-white/10 shadow-xl backdrop-blur-md text-sm font-medium
              transition-all duration-300 animate-in slide-in-from-bottom-2 fade-in
              ${toast.type === 'success' ? 'bg-[#1a2010] text-green-400' : ''}
              ${toast.type === 'error' ? 'bg-[#201010] text-red-400' : ''}
              ${toast.type === 'info' ? 'bg-[#141821] text-gray-200' : ''}
            `}
          >
            <div className="flex justify-between items-center">
              <span>{toast.message}</span>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};
