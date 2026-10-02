import React, { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const InputField = React.forwardRef(
  (
    {
      label,
      type = 'text',
      id,
      name,
      placeholder,
      error,
      icon: Icon,
      required = false,
      className = '',
      helperText,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className={`w-full ${className}`}>
        {label && (
          <label htmlFor={id || name} className="block text-sm font-medium text-slate-700 mb-1.5">
            {label} {required && <span className="text-rose-500">*</span>}
          </label>
        )}
        <div className="relative rounded-xl shadow-xs">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Icon className="w-5 h-5" />
            </div>
          )}
          <input
            ref={ref}
            id={id || name}
            name={name}
            type={inputType}
            placeholder={placeholder}
            className={`w-full text-sm rounded-xl py-2.5 transition-all duration-200 focus:outline-none focus:ring-2 ${
              Icon ? 'pl-11' : 'pl-3.5'
            } ${isPassword ? 'pr-11' : 'pr-3.5'} ${
              error
                ? 'border border-rose-300 text-rose-900 bg-rose-50/30 focus:border-rose-500 focus:ring-rose-200'
                : 'border border-slate-200 text-slate-900 bg-white hover:border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'
            }`}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
            </button>
          )}
        </div>
        {error && <p className="mt-1 text-xs text-rose-500 font-medium">{error}</p>}
        {helperText && !error && <p className="mt-1 text-xs text-slate-500">{helperText}</p>}
      </div>
    );
  }
);

InputField.displayName = 'InputField';

export default InputField;
