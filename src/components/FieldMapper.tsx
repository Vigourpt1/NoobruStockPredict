import React from 'react';

interface ColumnMapping {
  order_number: string;
  sku: string;
  quantity: string;
  date: string;
}

interface FieldMapperProps {
  headers: string[];
  mapping: ColumnMapping;
  onMappingChange: (mapping: ColumnMapping) => void;
  onConfirm: () => void;
}

export function FieldMapper({ headers, mapping, onMappingChange, onConfirm }: FieldMapperProps) {
  const requiredFields = {
    order_number: 'Order Number',
    sku: 'SKU',
    quantity: 'Quantity',
    date: 'Date'
  };

  const handleFieldChange = (key: keyof ColumnMapping, value: string) => {
    onMappingChange({
      ...mapping,
      [key]: value
    });
  };

  const isValid = Object.values(mapping).every(value => value !== '');

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {(Object.entries(requiredFields) as [keyof ColumnMapping, string][]).map(([key, label]) => (
          <div key={key} className="grid grid-cols-2 gap-4 items-center">
            <label htmlFor={key} className="text-sm font-medium text-gray-700">
              {label}:
            </label>
            <select
              id={key}
              value={mapping[key]}
              onChange={(e) => handleFieldChange(key, e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select field...</option>
              {headers.map((header) => (
                <option key={header} value={header}>
                  {header}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
      
      <button
        onClick={onConfirm}
        disabled={!isValid}
        className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
          ${isValid 
            ? 'bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500' 
            : 'bg-gray-300 cursor-not-allowed'}`}
      >
        Confirm Mapping
      </button>
    </div>
  );
}