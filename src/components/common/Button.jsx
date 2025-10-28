import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  type = 'button',
  onClick,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-sky-600 text-white hover:bg-sky-700 focus:ring-sky-500 shadow-sm',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-400 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-sm',
    error: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-sm',
    warning: 'bg-amber-600 text-white hover:bg-amber-700 focus:ring-amber-500 shadow-sm',
    outline: 'border-2 border-sky-600 text-sky-600 hover:bg-sky-50 focus:ring-sky-500 dark:border-sky-400 dark:text-sky-400 dark:hover:bg-sky-950',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-400 dark:text-gray-300 dark:hover:bg-gray-800',
    link: 'text-sky-600 hover:text-sky-700 hover:underline focus:ring-sky-500 dark:text-sky-400',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const variantClass = variants[variant] || variants.primary;
  const sizeClass = sizes[size] || sizes.md;
  const widthClass = fullWidth ? 'w-full' : '';

  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      className={`${baseStyles} ${variantClass} ${sizeClass} ${widthClass} ${className}`}
      disabled={isDisabled}
      onClick={onClick}
      {...props}
    >
      {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
      {!loading && Icon && iconPosition === 'left' && <Icon className="mr-2 h-4 w-4" />}
      {children}
      {!loading && Icon && iconPosition === 'right' && <Icon className="ml-2 h-4 w-4" />}
    </button>
  );
};

export default Button;

