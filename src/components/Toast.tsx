import React, { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type = 'success', duration = 3000, onClose }) => {
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLeaving(true);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(onClose, 300);
  };

  const icons = {
    success: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  };

  const colors = {
    success: 'from-emerald-500 to-teal-500 shadow-emerald-500/30',
    error: 'from-rose-500 to-pink-500 shadow-rose-500/30',
    info: 'from-violet-500 to-indigo-500 shadow-violet-500/30'
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ${
        isLeaving ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
      }`}
    >
      <div className={`flex items-center gap-3 px-4 py-3 bg-gradient-to-r ${colors[type]} rounded-xl shadow-lg text-white min-w-[280px]`}>
        <div className="flex-shrink-0 p-1 bg-white/20 rounded-lg">
          {icons[type]}
        </div>
        <p className="flex-1 font-medium text-sm">{message}</p>
        <button
          onClick={handleClose}
          className="flex-shrink-0 p-1 hover:bg-white/20 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Toast;
