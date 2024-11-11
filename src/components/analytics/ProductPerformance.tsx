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

export function ProductPerformance({ data, selectedPeriods }: ProductPerformanceProps) {
  const period1Data = selectedPeriods.type === 'custom' && selectedPeriods.customRange
    ? filterDataByPeriod(data, 'custom', '', {
        start: selectedPeriods.customRange.start1,
        end: selectedPeriods.customRange.end1
      })
    : filterDataByPeriod(data, selectedPeriods.type, selectedPeriods.period1);

  const period2Data = selectedPeriods.type === 'custom' && selectedPeriods.customRange
    ? filterDataByPeriod(data, 'custom', '', {
        start: selectedPeriods.customRange.start2,
        end: selectedPeriods.customRange.end2
      })
    : filterDataByPeriod(data, selectedPeriods.type, selectedPeriods.period2);

  const period1Label = selectedPeriods.type === 'custom' && selectedPeriods.customRange
    ? `${selectedPeriods.customRange.start1} to ${selectedPeriods.customRange.end1}`
    : selectedPeriods.period1;

  const period2Label = selectedPeriods.type === 'custom' && selectedPeriods.customRange
    ? `${selectedPeriods.customRange.start2} to ${selectedPeriods.customRange.end2}`
    : selectedPeriods.period2;

  // Combine and process data for both periods
  const processData = (periodData: OrderData[]) => {
    return periodData.reduce((acc, order) => {
      if (!acc[order.sku]) {
        acc[order.sku] = { quantity: 0, orders: 0 };
      }
      acc[order.sku].quantity += order.quantity;
      acc[order.sku].orders++;
      return acc;
    }, {} as Record<string, { quantity: number; orders: number }>);
  };

  const period1Stats = processData(period1Data);
  const period2Stats = processData(period2Data);

  // Combine data for chart
  const allSkus = new Set([...Object.keys(period1Stats), ...Object.keys(period2Stats)]);
  const chartData = Array.from(allSkus)
    .map(sku => ({
      sku,
      [`${period1Label} Quantity`]: period1Stats[sku]?.quantity || 0,
      [`${period2Label} Quantity`]: period2Stats[sku]?.quantity || 0
    }))
    .sort((a, b) => 
      (b[`${period2Label} Quantity`] + b[`${period1Label} Quantity`]) -
      (a[`${period2Label} Quantity`] + a[`${period1Label} Quantity`])
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
              <XAxis 
                dataKey="sku" 
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar 
                dataKey={`${period1Label} Quantity`} 
                fill="#60a5fa" 
                name={period1Label}
              />
              <Bar 
                dataKey={`${period2Label} Quantity`} 
                fill="#34d399" 
                name={period2Label}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900">
            Top SKU in {period1Label}
          </h4>
          <p className="text-2xl font-bold text-blue-600">
            {Object.entries(period1Stats)
              .sort(([, a], [, b]) => b.quantity - a.quantity)[0]?.[0] || 'N/A'}
          </p>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-green-900">
            Top SKU in {period2Label}
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