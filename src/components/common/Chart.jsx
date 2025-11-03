import React from 'react';

// Simple Progress Bars Component
export const ProgressChart = ({ data = [], title = "Progress Overview" }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</h4>
      {data.map((item, index) => (
        <div key={index} className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">{item.label}</span>
            <span className="font-medium text-gray-900 dark:text-white">{item.value}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${item.value}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

// Simple Stats Grid Component
export const StatsGrid = ({ data = [] }) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-4">
      {data.map((item, index) => (
        <div key={index} className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{item.value}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.label}</div>
        </div>
      ))}
    </div>
  );
};

// Simple Donut Chart Component
export const DonutChart = ({ data = [], size = 120 }) => {
  if (!data || data.length === 0) return null;

  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulativePercentage = 0;
  const radius = (size - 20) / 2;
  const centerX = size / 2;
  const centerY = size / 2;

  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const startAngle = (cumulativePercentage / 100) * 360;
            const endAngle = ((cumulativePercentage + percentage) / 100) * 360;
            
            const startAngleRad = (startAngle * Math.PI) / 180;
            const endAngleRad = (endAngle * Math.PI) / 180;
            
            const x1 = centerX + radius * Math.cos(startAngleRad);
            const y1 = centerY + radius * Math.sin(startAngleRad);
            const x2 = centerX + radius * Math.cos(endAngleRad);
            const y2 = centerY + radius * Math.sin(endAngleRad);
            
            const largeArcFlag = percentage > 50 ? 1 : 0;
            const pathData = [
              `M ${centerX} ${centerY}`,
              `L ${x1} ${y1}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              'Z'
            ].join(' ');
            
            cumulativePercentage += percentage;
            
            return (
              <path
                key={index}
                d={pathData}
                fill={colors[index % colors.length]}
                className="opacity-80 hover:opacity-100 transition-opacity"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900 dark:text-white">{total}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Total</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modern Weekly Trend Component
export const SimpleLineChart = ({ data = [], color = '#3b82f6', title = "Trend" }) => {
  if (!data || data.length === 0) return null;

  const maxValue = Math.max(...data.map(d => d.y));
  const minValue = Math.min(...data.map(d => d.y));
  const range = maxValue - minValue;
  const avgValue = data.reduce((sum, d) => sum + d.y, 0) / data.length;

  return (
    <div className="space-y-6">
      {/* Header with stats */}
      <div className="flex justify-between items-start">
        <div>
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">Last 7 days performance</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{Math.round(avgValue)}%</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Average</div>
        </div>
      </div>

      {/* Trend visualization */}
      <div className="relative">
        <div className="flex items-end justify-between h-32 space-x-2">
          {data.map((point, index) => {
            const height = range > 0 ? ((point.y - minValue) / range) * 100 + 20 : 60;
            const isHighest = point.y === maxValue;
            const isLowest = point.y === minValue;
            
            return (
              <div key={index} className="flex flex-col items-center space-y-2 flex-1">
                {/* Bar */}
                <div className="relative w-full max-w-8">
                  <div
                    className="w-full rounded-t-lg transition-all duration-500 hover:opacity-80"
                    style={{
                      height: `${height}px`,
                      background: isHighest 
                        ? `linear-gradient(to top, ${color}, ${color}dd)`
                        : isLowest
                        ? `linear-gradient(to top, #ef4444, #ef4444dd)`
                        : `linear-gradient(to top, ${color}80, ${color}40)`,
                      minHeight: '8px'
                    }}
                  />
                  
                  {/* Value label */}
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700 dark:text-gray-300">
                    {point.y}%
                  </div>
                </div>
                
                {/* Day label */}
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Trend line overlay */}
        <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none">
          <svg width="100%" height="100%" className="overflow-visible">
            <defs>
              <linearGradient id={`trendGradient-${color}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={color} stopOpacity="0.8" />
                <stop offset="100%" stopColor={color} stopOpacity="0.4" />
              </linearGradient>
            </defs>
            <polyline
              points={data.map((point, index) => {
                const x = (index / (data.length - 1)) * 100;
                const y = 100 - ((point.y - minValue) / range) * 80 - 10;
                return `${x}%,${y}%`;
              }).join(' ')}
              fill="none"
              stroke={`url(#trendGradient-${color})`}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="drop-shadow-sm"
            />
          </svg>
        </div>
      </div>

      {/* Performance indicators */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Current</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Best: {maxValue}%</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Lowest: {minValue}%</span>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {data[data.length - 1].y > data[data.length - 2].y ? '↗' : '↘'} 
            {Math.abs(data[data.length - 1].y - data[data.length - 2].y)}%
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">vs yesterday</div>
        </div>
      </div>
    </div>
  );
};

export default { ProgressChart, StatsGrid, DonutChart, SimpleLineChart };


