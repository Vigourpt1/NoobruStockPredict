import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
}

export function Select({ children, className = '', ...props }: SelectProps) {
  return (
    <select
      className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

export function SelectTrigger({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <div className="relative" id={id}>
      {children}
    </div>
  );
}

export function SelectContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg">
      <div className="py-1">
        {children}
      </div>
    </div>
  );
}

export function SelectItem({ children, value }: { children: React.ReactNode; value: string }) {
  return (
    <option value={value} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
      {children}
    </option>
  );
}

export function SelectValue({ placeholder }: { placeholder?: string }) {
  return <span className="block truncate">{placeholder}</span>;
}