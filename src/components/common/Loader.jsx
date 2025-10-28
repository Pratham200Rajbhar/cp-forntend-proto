import { Loader2 } from 'lucide-react';

const Loader = ({ size = 'md', text, className = '' }) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  const sizeClass = sizes[size] || sizes.md;

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <Loader2 className={`${sizeClass} animate-spin text-sky-600 dark:text-sky-400`} />
      {text && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{text}</p>
      )}
    </div>
  );
};

export const PageLoader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-50">
      <Loader size="xl" text="Loading..." />
    </div>
  );
};

export const SkeletonLoader = ({ className = '', count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={`skeleton h-4 ${className}`} />
      ))}
    </>
  );
};

export default Loader;

