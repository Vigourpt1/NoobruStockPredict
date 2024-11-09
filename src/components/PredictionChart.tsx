import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Prediction } from '../types';

interface PredictionChartProps {
  predictions: Prediction[];
  historicalDataCount: number;
}

export function PredictionChart({ predictions, historicalDataCount }: PredictionChartProps) {
  const data = predictions.map(pred => ({
    month: pred.month,
    Envelopes: pred.packaging.envelopes,
    'Six Month Boxes': pred.packaging.sixMonthBoxes,
    'Twelve Month Boxes': pred.packaging.twelveMonthBoxes
  }));

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <ReferenceLine
            x={data[historicalDataCount - 1]?.month}
            stroke="#666"
            strokeDasharray="3 3"
            label={{ value: 'Historical | Forecast', position: 'top' }}
          />
          <Bar dataKey="Envelopes" fill="#60a5fa" />
          <Bar dataKey="Six Month Boxes" fill="#34d399" />
          <Bar dataKey="Twelve Month Boxes" fill="#f87171" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}