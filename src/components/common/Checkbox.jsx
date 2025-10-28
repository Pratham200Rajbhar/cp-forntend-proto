import { forwardRef } from 'react';

const Checkbox = forwardRef(({
  label,
  error,
  className = '',
  containerClassName = '',
  ...props
}, ref) => {
  return (
    <div className={`flex items-start ${containerClassName}`}>
      <div className="flex items-center h-5">
        <input
          ref={ref}
          type="checkbox"
          className={`h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 dark:border-gray-600 rounded dark:bg-gray-800 transition-colors duration-200 ${className}`}
          {...props}
        />
      </div>
      {label && (
        <div className="ml-3">
          <label className="text-sm text-gray-700 dark:text-gray-300">
            {label}
          </label>
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
        </div>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;

