import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { OrderData } from '../../types';
import { filterDataByPeriod } from '../../utils/timeComparison';

interface ProductPerformanceProps {
  data: OrderData[];
  selectedPeriods: {
    type: 'week' | 'month' | 'quarter' | 'year';
    period1: string;
    period2: string;
  };
}

export function ProductPerformance({ data, selectedPeriods }: ProductPerformanceProps) {
  const period1Data = filterDataByPeriod(data, selectedPeriods.type, selectedPeriods.period1);
  const period2Data = filterDataByPeriod(data, selectedPeriods.type, selectedPeriods.period2);

  // Combine and process data for both periods
  const processData = (periodData: OrderData[], periodLabel: string) => {
    return periodData.reduce((acc, order) => {
      if (!acc[order.sku]) {
        acc[order.sku] = { quantity: 0, orders: 0 };
      }
      acc[order.sku].quantity += order.quantity;
      acc[order.sku].orders++;
      return acc;
    }, {} as Record<string, { quantity: number; orders: number }>);
  };

  const period1Stats = processData(period1Data, selectedPeriods.period1);
  const period2Stats = processData(period2Data, selectedPeriods.period2);

  // Combine data for chart
  const allSkus = new Set([...Object.keys(period1Stats), ...Object.keys(period2Stats)]);
  const chartData = Array.from(allSkus)
    .map(sku => ({
      sku,
      [`${selectedPeriods.period1} Quantity`]: period1Stats[sku]?.quantity || 0,
      [`${selectedPeriods.period2} Quantity`]: period2Stats[sku]?.quantity || 0
    }))
    .sort((a, b) => 
      (b[`${selectedPeriods.period2} Quantity`] + b[`${selectedPeriods.period1} Quantity`]) -
      (a[`${selectedPeriods.period2} Quantity`] + a[`${selectedPeriods.period1} Quantity`])
    )
    .slice(0, 10);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Top 10 Products Comparison</h3>
        <div className="h-[400px]">
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="sku" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar 
                dataKey={`${selectedPeriods.period1} Quantity`} 
                fill="#60a5fa" 
                name={selectedPeriods.period1}
              />
              <Bar 
                dataKey={`${selectedPeriods.period2} Quantity`} 
                fill="#34d399" 
                name={selectedPeriods.period2}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900">
            Top SKU in {selectedPeriods.period1}
          </h4>
          <p className="text-2xl font-bold text-blue-600">
            {Object.entries(period1Stats)
              .sort(([, a], [, b]) => b.quantity - a.quantity)[0]?.[0] || 'N/A'}
          </p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-green-900">
            Top SKU in {selectedPeriods.period2}
          </h4>
          <p className="text-2xl font-bold text-green-600">
            {Object.entries(period2Stats)
              .sort(([, a], [, b]) => b.quantity - a.quantity)[0]?.[0] || 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
}