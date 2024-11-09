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
    type: 'week' | 'month' | 'quarter' | 'year';
    period1: string;
    period2: string;
  };
}

export function CustomerAnalysis({ data, selectedPeriods }: CustomerAnalysisProps) {
  const period1Data = filterDataByPeriod(data, selectedPeriods.type, selectedPeriods.period1);
  const period2Data = filterDataByPeriod(data, selectedPeriods.type, selectedPeriods.period2);

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
    const averageOrderValue = Object.values(customerOrders)
      .reduce((sum: any, customer: any) => sum + customer.totalItems, 0) / totalCustomers;

    return {
      totalCustomers,
      averageOrderValue,
      customerOrders
    };
  };

  const period1Metrics = calculateMetrics(period1Data);
  const period2Metrics = calculateMetrics(period2Data);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900">Total Orders</h4>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div>
              <p className="text-xs text-blue-700">{selectedPeriods.period1}</p>
              <p className="text-xl font-bold text-blue-600">
                {period1Metrics.totalCustomers}
              </p>
            </div>
            <div>
              <p className="text-xs text-blue-700">{selectedPeriods.period2}</p>
              <p className="text-xl font-bold text-blue-600">
                {period2Metrics.totalCustomers}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-green-900">Average Order Value</h4>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div>
              <p className="text-xs text-green-700">{selectedPeriods.period1}</p>
              <p className="text-xl font-bold text-green-600">
                {period1Metrics.averageOrderValue.toFixed(1)}
              </p>
            </div>
            <div>
              <p className="text-xs text-green-700">{selectedPeriods.period2}</p>
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
              {((period2Metrics.totalCustomers - period1Metrics.totalCustomers) / 
                period1Metrics.totalCustomers * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}