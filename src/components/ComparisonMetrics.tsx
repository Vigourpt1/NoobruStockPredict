import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus, AlertTriangle } from 'lucide-react';

interface MetricComparison {
  label: string;
  period1Value: number;
  period2Value: number;
  period2Predicted?: boolean;
  format?: (value: number) => string;
  inverse?: boolean;
}

interface ComparisonMetricsProps {
  period1: string;
  period2: string;
  metrics: MetricComparison[];
}

export function ComparisonMetrics({ period1, period2, metrics }: ComparisonMetricsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {metrics.map((metric, index) => {
        const difference = metric.period2Value - metric.period1Value;
        const percentChange = ((difference / metric.period1Value) * 100) || 0;
        const isPositive = metric.inverse ? percentChange < 0 : percentChange > 0;
        const isNeutral = percentChange === 0;

        const formatter = metric.format || ((value: number) => value.toLocaleString());

        return (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-4">{metric.label}</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">{period1}</div>
                <div className="text-2xl font-bold">{formatter(metric.period1Value)}</div>
              </div>
              
              <div>
                <div className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                  {period2}
                  {metric.period2Predicted && (
                    <span className="inline-flex items-center text-amber-600" title="Predicted value">
                      <AlertTriangle className="h-4 w-4" />
                    </span>
                  )}
                </div>
                <div className="text-2xl font-bold">{formatter(metric.period2Value)}</div>
              </div>
            </div>

            <div className={`mt-4 flex items-center gap-1 text-sm ${
              isPositive ? 'text-green-600' : isNeutral ? 'text-gray-600' : 'text-red-600'
            }`}>
              {isNeutral ? (
                <Minus className="h-4 w-4" />
              ) : isPositive ? (
                <ArrowUpRight className="h-4 w-4" />
              ) : (
                <ArrowDownRight className="h-4 w-4" />
              )}
              <span>
                {Math.abs(percentChange).toFixed(1)}% 
                {isNeutral ? ' No change' : isPositive ? ' Increase' : ' Decrease'}
                {metric.period2Predicted && ' (Predicted)'}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}