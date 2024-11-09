import React from 'react';
import { FileText } from 'lucide-react';

export function UploadInstructions() {
  return (
    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
      <div className="flex items-start">
        <FileText className="h-6 w-6 text-blue-500 mr-3 mt-1" />
        <div>
          <h3 className="text-lg font-semibold text-blue-900 mb-2">CSV File Requirements</h3>
          <p className="text-sm text-blue-800 mb-3">Required columns in your CSV file:</p>
          <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
            <li>Order Number (unique identifier for each order)</li>
            <li>SKU (product identifier)</li>
            <li>Quantity (number of items)</li>
            <li>Date (in DD/MM/YYYY format)</li>
          </ul>
          <div className="mt-4 p-3 bg-blue-100 rounded">
            <h4 className="font-semibold text-blue-900 mb-2">Sample Data Format:</h4>
            <code className="text-xs text-blue-800">
              Order Number,SKU,Quantity,Date<br/>
              ORD001,NB-BTL-01,2,25/03/2024<br/>
              ORD002,NB-ADV_3,1,25/03/2024
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}