import React from 'react';
import { FiCheckCircle, FiAlertCircle, FiAlertTriangle, FiInfo, FiX } from 'react-icons/fi';

const Alert = ({
  type = 'info',
  title,
  message,
  onClose,
  className = '',
}) => {
  const styles = {
    info: {
      bg: 'bg-indigo-50 border-indigo-200 text-indigo-800',
      icon: <FiInfo className="w-5 h-5 text-indigo-600 flex-shrink-0" />,
    },
    success: {
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      icon: <FiCheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />,
    },
    warning: {
      bg: 'bg-amber-50 border-amber-200 text-amber-800',
      icon: <FiAlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />,
    },
    error: {
      bg: 'bg-rose-50 border-rose-200 text-rose-800',
      icon: <FiAlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />,
    },
  };

  const current = styles[type] || styles.info;

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl border text-sm transition-all duration-200 ${current.bg} ${className}`}
      role="alert"
    >
      <div className="pt-0.5">{current.icon}</div>
      <div className="flex-1">
        {title && <h5 className="font-semibold mb-0.5">{title}</h5>}
        {message && <div className="leading-relaxed">{message}</div>}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 p-1 -mr-1 rounded-lg focus:outline-none"
        >
          <FiX className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Alert;
