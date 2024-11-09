import React, { useState, useCallback } from 'react';
import { Upload } from 'lucide-react';
import { FieldMapper } from './FieldMapper';
import { ColumnMapping } from '../types';
import { DataInstructions } from './DataInstructions';

interface FileUploadProps {
  onFileUpload: (file: File, mapping: ColumnMapping) => void;
}

export function FileUpload({ onFileUpload }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<ColumnMapping>({
    order_number: '',
    sku: '',
    quantity: '',
    date: ''
  });

  const processFile = (file: File) => {
    if (!file.type && !file.name.toLowerCase().endsWith('.csv')) {
      alert('Please upload a CSV file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') {
          throw new Error('Invalid file content');
        }

        const lines = text.trim().split(/\r\n|\n/);
        if (lines.length < 2) {
          throw new Error('File must contain headers and at least one data row');
        }

        const csvHeaders = lines[0].split(',').map(h => h.trim());
        setHeaders(csvHeaders);
        setSelectedFile(file);

        // Try to auto-map columns
        const autoMapping: ColumnMapping = {
          order_number: csvHeaders.find(h => h.toLowerCase().includes('order')) || '',
          sku: csvHeaders.find(h => h.toLowerCase().includes('sku')) || '',
          quantity: csvHeaders.find(h => h.toLowerCase().includes('quantity')) || '',
          date: csvHeaders.find(h => h.toLowerCase().includes('date')) || ''
        };
        setMapping(autoMapping);
      } catch (error) {
        console.error('Error processing file:', error);
        alert(error instanceof Error ? error.message : 'Error processing file');
        setSelectedFile(null);
        setHeaders([]);
      }
    };
    reader.readAsText(file);
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(e.type === "dragenter" || e.type === "dragover");
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files?.[0]) {
      processFile(files[0]);
    }
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files?.[0]) {
      processFile(files[0]);
    }
  }, []);

  const handleConfirmMapping = () => {
    if (selectedFile && Object.values(mapping).every(Boolean)) {
      onFileUpload(selectedFile, mapping);
    } else {
      alert('Please map all required columns before proceeding');
    }
  };

  if (selectedFile && headers.length > 0) {
    return (
      <>
        <DataInstructions />
        <FieldMapper
          headers={headers}
          mapping={mapping}
          onMappingChange={setMapping}
          onConfirm={handleConfirmMapping}
        />
      </>
    );
  }

  return (
    <div
      className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
        ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => document.getElementById('fileInput')?.click()}
    >
      <input
        id="fileInput"
        type="file"
        className="hidden"
        accept=".csv"
        onChange={handleFileInput}
      />
      <Upload className="mx-auto h-12 w-12 text-gray-400" />
      <p className="mt-2 text-sm text-gray-600">
        Drag and drop your CSV file here, or click to select
      </p>
      <p className="mt-1 text-xs text-gray-500">
        Only CSV files are supported
      </p>
    </div>
  );
}