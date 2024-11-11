import React from 'react';
import { ComparisonMetrics } from '../ComparisonMetrics';
import { filterDataByPeriod, calculatePeriodMetrics } from '../../utils/timeComparison';
import { OrderData } from '../../types';

interface SeasonalTrendsProps {
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

export function SeasonalTrends({ data, selectedPeriods }: SeasonalTrendsProps) {
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

  const period1Metrics = calculatePeriodMetrics(period1Data);
  const period2Metrics = calculatePeriodMetrics(period2Data);

  const period1Label = selectedPeriods.type === 'custom' && selectedPeriods.customRange
    ? `${selectedPeriods.customRange.start1} to ${selectedPeriods.customRange.end1}`
    : selectedPeriods.period1;

  const period2Label = selectedPeriods.type === 'custom' && selectedPeriods.customRange
    ? `${selectedPeriods.customRange.start2} to ${selectedPeriods.customRange.end2}`
    : selectedPeriods.period2;

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
        period1={period1Label}
        period2={period2Label}
        metrics={comparisonMetrics}
      />
    </div>
  );
}