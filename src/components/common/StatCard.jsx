import Card, { CardBody } from './Card';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  subtitle,
  color = 'primary',
  className = '',
}) => {
  const colors = {
    primary: 'text-sky-600 bg-sky-100 dark:text-sky-400 dark:bg-sky-900/50',
    success: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/50',
    warning: 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/50',
    error: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/50',
    info: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/50',
  };

  const colorClass = colors[color] || colors.primary;

  return (
    <Card className={className}>
      <CardBody>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
            {subtitle && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
            )}
            {trend && trendValue && (
              <div className="mt-2 flex items-center space-x-1">
                {trend === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <span className={`text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {trendValue}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">vs last period</span>
              </div>
            )}
          </div>
          {Icon && (
            <div className={`p-3 rounded-lg ${colorClass}`}>
              <Icon className="h-8 w-8" />
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default StatCard;

