import React from 'react';

interface GrowthRateAdjustmentProps {
  growthRate: number;
  onGrowthRateChange: (rate: number) => void;
}

export function GrowthRateAdjustment({ growthRate, onGrowthRateChange }: GrowthRateAdjustmentProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Growth Rate Adjustment</h2>
      <div className="flex items-center gap-4">
        <input
          type="range"
          min="-100"
          max="100"
          value={growthRate}
          onChange={(e) => onGrowthRateChange(Number(e.target.value))}
          className="flex-1"
        />
        <input
          type="number"
          value={growthRate}
          onChange={(e) => onGrowthRateChange(Number(e.target.value))}
          className="w-20 px-2 py-1 border rounded"
          min="-100"
          max="100"
        />
        <span className="text-gray-600">%</span>
      </div>
    </div>
  );
}