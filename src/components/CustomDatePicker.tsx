import React from 'react';
import { Calendar } from 'lucide-react';

interface DatePickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  min?: string;
  max?: string;
  className?: string;
}

export function CustomDatePicker({
  label,
  value,
  onChange,
  min,
  max,
  className = ''
}: DatePickerProps) {
  return (
    <div className={`relative ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min={min}
          max={max}
          className="block w-full rounded-md border-gray-300 pl-3 pr-10 py-2 text-sm 
                   shadow-sm focus:border-blue-500 focus:ring-blue-500 
                   bg-white cursor-pointer"
        />
        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
}