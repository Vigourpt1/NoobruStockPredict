import React from 'react';

interface PredictionData {
  month: string;
  skuPredictions: string;
  packaging: {
    envelopes: number;
    sixMonthBoxes: number;
    twelveMonthBoxes: number;
  };
}

interface PredictionTableProps {
  data: PredictionData[];
  totalOrders: number;
}

export function PredictionTable({ data, totalOrders }: PredictionTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Month
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              SKU Predictions
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Packaging Requirements
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row) => (
            <tr key={row.month}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {row.month}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {row.skuPredictions}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                    Envelopes: {row.packaging.envelopes}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                    6-Month Boxes: {row.packaging.sixMonthBoxes}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                    12-Month Boxes: {row.packaging.twelveMonthBoxes}
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot className="bg-gray-50">
          <tr>
            <td colSpan={3} className="px-6 py-3 text-sm text-gray-500">
              Total Orders: {totalOrders}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}