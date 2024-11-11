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

interface CustomerAnalysisProps {
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

export function CustomerAnalysis({ data, selectedPeriods }: CustomerAnalysisProps) {
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
    const customerOrders = periodData.reduce((acc, order) => {
      if (!acc[order.order_number]) {
        acc[order.order_number] = {
          totalItems: 0,
          orders: 0,
          lastOrderDate: new Date(order.date)
        };
      }

      acc[order.order_number].totalItems += order.quantity;
      acc[order.order_number].orders++;
      
      const orderDate = new Date(order.date);
      if (orderDate > acc[order.order_number].lastOrderDate) {
        acc[order.order_number].lastOrderDate = orderDate;
      }

      return acc;
    }, {} as Record<string, any>);

    const totalCustomers = Object.keys(customerOrders).length;
    const totalItems = Object.values(customerOrders)
      .reduce((sum: any, customer: any) => sum + customer.totalItems, 0);
    const averageOrderValue = totalCustomers > 0 ? totalItems / totalCustomers : 0;

    return {
      totalCustomers,
      averageOrderValue,
      totalItems
    };
  };

  const period1Metrics = calculateMetrics(period1Data);
  const period2Metrics = calculateMetrics(period2Data);

  const growthRate = period1Metrics.totalCustomers > 0
    ? ((period2Metrics.totalCustomers - period1Metrics.totalCustomers) / period1Metrics.totalCustomers * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900">Total Orders</h4>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div>
              <p className="text-xs text-blue-700">{period1Label}</p>
              <p className="text-xl font-bold text-blue-600">
                {period1Metrics.totalCustomers}
              </p>
            </div>
            <div>
              <p className="text-xs text-blue-700">{period2Label}</p>
              <p className="text-xl font-bold text-blue-600">
                {period2Metrics.totalCustomers}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-green-900">Average Items per Order</h4>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div>
              <p className="text-xs text-green-700">{period1Label}</p>
              <p className="text-xl font-bold text-green-600">
                {period1Metrics.averageOrderValue.toFixed(1)}
              </p>
            </div>
            <div>
              <p className="text-xs text-green-700">{period2Label}</p>
              <p className="text-xl font-bold text-green-600">
                {period2Metrics.averageOrderValue.toFixed(1)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-purple-900">Growth Rate</h4>
          <div className="text-center mt-2">
            <p className="text-xl font-bold text-purple-600">
              {growthRate.toFixed(1)}%
            </p>
            <p className="text-xs text-purple-700 mt-1">
              {growthRate > 0 ? 'Increase' : growthRate < 0 ? 'Decrease' : 'No Change'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h4 className="text-sm font-medium text-gray-900 mb-4">Total Items Comparison</h4>
        <div className="h-[200px]">
          <ResponsiveContainer>
            <BarChart data={[
              {
                name: 'Total Items',
                [period1Label]: period1Metrics.totalItems,
                [period2Label]: period2Metrics.totalItems
              }
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
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