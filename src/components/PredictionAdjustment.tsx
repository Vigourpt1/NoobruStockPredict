import React from 'react';
import { Sliders } from 'lucide-react';

interface PredictionAdjustmentProps {
  growthRate: number;
  onGrowthRateChange: (rate: number) => void;
}

export function PredictionAdjustment({ growthRate, onGrowthRateChange }: PredictionAdjustmentProps) {
  const percentage = Math.round((growthRate - 1) * 100);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <Sliders className="h-5 w-5 text-indigo-600" />
        <h3 className="text-lg font-semibold">Adjust Predictions</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="growth-rate" className="block text-sm font-medium text-gray-700">
            Growth Rate Adjustment: {percentage > 0 ? '+' : ''}{percentage}%
          </label>
          <input
            type="range"
            id="growth-rate"
            min="-50"
            max="50"
            value={percentage}
            onChange={(e) => onGrowthRateChange(1 + (parseInt(e.target.value) / 100))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2"
          />
        </div>

        <div className="grid grid-cols-3 gap-2 text-center text-sm">
          <div className="text-gray-500">-50%</div>
          <div className="text-gray-500">0%</div>
          <div className="text-gray-500">+50%</div>
        </div>
      </div>
    </div>
  );
}