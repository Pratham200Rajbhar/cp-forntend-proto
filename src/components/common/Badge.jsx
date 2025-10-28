const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  rounded = true,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center font-medium';

  const variants = {
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    primary: 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200',
    success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    warning: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
    error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    pink: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base',
  };

  const variantClass = variants[variant] || variants.default;
  const sizeClass = sizes[size] || sizes.md;
  const roundedClass = rounded ? 'rounded-full' : 'rounded';

  return (
    <span
      className={`${baseStyles} ${variantClass} ${sizeClass} ${roundedClass} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;

