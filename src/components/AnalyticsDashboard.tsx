import React from 'react';
import { TrendingUp, Package, Users, Calendar } from 'lucide-react';

interface AnalyticsData {
  totalOrders: number;
  averageOrderSize: number;
  topSellingSkus: Array<{ sku: string; quantity: number }>;
  monthOverMonthGrowth: number;
}

interface AnalyticsDashboardProps {
  data: AnalyticsData;
}

export function AnalyticsDashboard({ data }: AnalyticsDashboardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <Package className="h-8 w-8 text-blue-500 mr-3" />
          <div>
            <p className="text-sm text-gray-600">Total Orders</p>
            <p className="text-2xl font-bold">{data.totalOrders.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <TrendingUp className="h-8 w-8 text-green-500 mr-3" />
          <div>
            <p className="text-sm text-gray-600">Month/Month Growth</p>
            <p className="text-2xl font-bold">
              {data.monthOverMonthGrowth > 0 ? '+' : ''}
              {data.monthOverMonthGrowth.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <Users className="h-8 w-8 text-purple-500 mr-3" />
          <div>
            <p className="text-sm text-gray-600">Avg Order Size</p>
            <p className="text-2xl font-bold">{data.averageOrderSize.toFixed(1)} items</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <Calendar className="h-8 w-8 text-red-500 mr-3" />
          <div>
            <p className="text-sm text-gray-600">Top SKU</p>
            <p className="text-2xl font-bold">
              {data.topSellingSkus[0]?.sku || 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}