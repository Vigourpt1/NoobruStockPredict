import React from 'react';
import { ComparisonMetrics } from '../ComparisonMetrics';
import { filterDataByPeriod, calculatePeriodMetrics } from '../../utils/timeComparison';
import { OrderData } from '../../types';

interface SeasonalTrendsProps {
  data: OrderData[];
  selectedPeriods: {
    type: 'week' | 'month' | 'quarter' | 'year';
    period1: string;
    period2: string;
  };
}

export function SeasonalTrends({ data, selectedPeriods }: SeasonalTrendsProps) {
  const period1Data = filterDataByPeriod(data, selectedPeriods.type, selectedPeriods.period1);
  const period2Data = filterDataByPeriod(data, selectedPeriods.type, selectedPeriods.period2);

  const period1Metrics = calculatePeriodMetrics(period1Data);
  const period2Metrics = calculatePeriodMetrics(period2Data);

  const comparisonMetrics = [
    {
      label: 'Total Orders',
      period1Value: period1Metrics.totalOrders,
      period2Value: period2Metrics.totalOrders
    },
    {
      label: 'Total Items',
      period1Value: period1Metrics.totalItems,
      period2Value: period2Metrics.totalItems
    },
    {
      label: 'Average Order Size',
      period1Value: period1Metrics.averageOrderSize,
      period2Value: period2Metrics.averageOrderSize,
      format: (value: number) => value.toFixed(1)
    },
    {
      label: 'Unique SKUs',
      period1Value: period1Metrics.uniqueSkus,
      period2Value: period2Metrics.uniqueSkus
    }
  ];

  return (
    <div className="space-y-6">
      <ComparisonMetrics
        period1={selectedPeriods.period1}
        period2={selectedPeriods.period2}
        metrics={comparisonMetrics}
      />
    </div>
  );
}