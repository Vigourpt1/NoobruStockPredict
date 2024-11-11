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

interface OrderAnalysisProps {
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

export function OrderAnalysis({ data, selectedPeriods }: OrderAnalysisProps) {
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

  const calculateMetrics = (periodData: OrderData[]) => {
    const orderSizes = new Map<string, number>();
    periodData.forEach(order => {
      const current = orderSizes.get(order.order_number) || 0;
      orderSizes.set(order.order_number, current + order.quantity);
    });

    const sizes = Array.from(orderSizes.values());
    return {
      averageSize: sizes.length > 0 ? sizes.reduce((sum, size) => sum + size, 0) / sizes.length : 0,
      maxSize: sizes.length > 0 ? Math.max(...sizes) : 0,
      totalOrders: orderSizes.size,
      sizeRanges: {
        '1-2 items': sizes.filter(s => s <= 2).length,
        '3-5 items': sizes.filter(s => s > 2 && s <= 5).length,
        '6-10 items': sizes.filter(s => s > 5 && s <= 10).length,
        '11+ items': sizes.filter(s => s > 10).length
      }
    };
  };

  const period1Metrics = calculateMetrics(period1Data);
  const period2Metrics = calculateMetrics(period2Data);

  const chartData = Object.keys(period1Metrics.sizeRanges).map(range => ({
    range,
    [period1Label]: period1Metrics.sizeRanges[range as keyof typeof period1Metrics.sizeRanges],
    [period2Label]: period2Metrics.sizeRanges[range as keyof typeof period2Metrics.sizeRanges]
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900">Average Order Size</h4>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div>
              <p className="text-xs text-blue-700">{period1Label}</p>
              <p className="text-xl font-bold text-blue-600">
                {period1Metrics.averageSize.toFixed(1)}
              </p>
            </div>
            <div>
              <p className="text-xs text-blue-700">{period2Label}</p>
              <p className="text-xl font-bold text-blue-600">
                {period2Metrics.averageSize.toFixed(1)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-green-900">Largest Order</h4>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div>
              <p className="text-xs text-green-700">{period1Label}</p>
              <p className="text-xl font-bold text-green-600">
                {period1Metrics.maxSize}
              </p>
            </div>
            <div>
              <p className="text-xs text-green-700">{period2Label}</p>
              <p className="text-xl font-bold text-green-600">
                {period2Metrics.maxSize}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-purple-900">Total Orders</h4>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div>
              <p className="text-xs text-purple-700">{period1Label}</p>
              <p className="text-xl font-bold text-purple-600">
                {period1Metrics.totalOrders}
              </p>
            </div>
            <div>
              <p className="text-xs text-purple-700">{period2Label}</p>
              <p className="text-xl font-bold text-purple-600">
                {period2Metrics.totalOrders}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Order Size Distribution</h3>
        <div className="h-[300px]">
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={period1Label} fill="#60a5fa" />
              <Bar dataKey={period2Label} fill="#34d399" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}