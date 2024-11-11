import React from 'react';
import { BarChart2, Calendar, Package, Users } from 'lucide-react';
import { SeasonalTrends } from './analytics/SeasonalTrends';
import { ProductPerformance } from './analytics/ProductPerformance';
import { OrderAnalysis } from './analytics/OrderAnalysis';
import { CustomerAnalysis } from './analytics/CustomerAnalysis';
import { OrderData } from '../types';

interface AnalyticsTabsProps {
  data: OrderData[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  selectedPeriods: {
    type: 'week' | 'month' | 'quarter' | 'year' | 'custom';
    period1: string;
    period2: string;
    customRange?: {
      start1: string;
      end1: string;
      start2: string;
      end2: string;
    };
  };
}

export function AnalyticsTabs({ data, activeTab, onTabChange, selectedPeriods }: AnalyticsTabsProps) {
  const tabs = [
    { id: 'seasonal', label: 'Seasonal Trends', icon: Calendar },
    { id: 'products', label: 'Product Performance', icon: Package },
    { id: 'orders', label: 'Order Analysis', icon: BarChart2 },
    { id: 'customers', label: 'Customer Insights', icon: Users }
  ];

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="border-b">
        <div className="flex overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center px-4 py-3 text-sm font-medium whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-5 w-5 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'seasonal' && <SeasonalTrends data={data} selectedPeriods={selectedPeriods} />}
        {activeTab === 'products' && <ProductPerformance data={data} selectedPeriods={selectedPeriods} />}
        {activeTab === 'orders' && <OrderAnalysis data={data} selectedPeriods={selectedPeriods} />}
        {activeTab === 'customers' && <CustomerAnalysis data={data} selectedPeriods={selectedPeriods} />}
      </div>
    </div>
  );
}