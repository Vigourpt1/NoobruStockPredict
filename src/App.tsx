import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { Box, Download } from 'lucide-react';
import { AnalyticsTabs } from './components/AnalyticsTabs';
import { TimeComparisonSelector } from './components/TimeComparisonSelector';
import { OrderData, ColumnMapping } from './types';
import { parseCSVData } from './utils/parseData';
import { getAvailablePeriods, getInitialPeriods, filterDataByPeriod } from './utils/timeComparison';
import { generatePDF } from './utils/pdfExport';

export default function App() {
  const [data, setData] = useState<OrderData[]>([]);
  const [activeTab, setActiveTab] = useState('seasonal');
  const [selectedPeriods, setSelectedPeriods] = useState<{
    type: 'week' | 'month' | 'quarter' | 'year' | 'custom';
    period1: string;
    period2: string;
    customRange?: {
      start1: string;
      end1: string;
      start2: string;
      end2: string;
    };
  }>({
    type: 'month',
    period1: '',
    period2: '',
    customRange: {
      start1: '',
      end1: '',
      start2: '',
      end2: ''
    }
  });

  const handleFileUpload = (file: File, mapping: ColumnMapping) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsedData = parseCSVData(text, mapping);
        
        if (parsedData.length === 0) {
          throw new Error('No valid data found in file');
        }

        setData(parsedData);
        
        const initialPeriods = getInitialPeriods(parsedData);
        if (initialPeriods) {
          setSelectedPeriods(initialPeriods);
        }
      } catch (error) {
        console.error('Error processing data:', error);
        alert('Error processing file. Please check the format and try again.');
      }
    };
    reader.readAsText(file);
  };

  const handleExportPDF = () => {
    let period1Data: OrderData[] = [];
    let period2Data: OrderData[] = [];

    if (selectedPeriods.type === 'custom' && selectedPeriods.customRange) {
      period1Data = filterDataByPeriod(data, 'custom', '', {
        start: selectedPeriods.customRange.start1,
        end: selectedPeriods.customRange.end1
      });
      period2Data = filterDataByPeriod(data, 'custom', '', {
        start: selectedPeriods.customRange.start2,
        end: selectedPeriods.customRange.end2
      });
    } else {
      period1Data = filterDataByPeriod(data, selectedPeriods.type, selectedPeriods.period1);
      period2Data = filterDataByPeriod(data, selectedPeriods.type, selectedPeriods.period2);
    }

    generatePDF({
      data: [...period1Data, ...period2Data],
      selectedPeriods,
      activeTab,
      tabsData: {
        seasonal: document.getElementById('seasonal-trends'),
        products: document.getElementById('product-performance'),
        orders: document.getElementById('order-analysis'),
        customers: document.getElementById('customer-insights')
      }
    });
  };

  const handlePeriodTypeChange = (type: 'week' | 'month' | 'quarter' | 'year' | 'custom') => {
    if (type === 'custom') {
      setSelectedPeriods({
        ...selectedPeriods,
        type,
        customRange: {
          start1: '',
          end1: '',
          start2: '',
          end2: ''
        }
      });
    } else {
      const availablePeriods = getAvailablePeriods(data);
      const periods = availablePeriods[`${type}s`];
      if (periods.length >= 2) {
        setSelectedPeriods({
          type,
          period1: periods[periods.length - 2],
          period2: periods[periods.length - 1],
          customRange: undefined
        });
      }
    }
  };

  const handlePeriodChange = (period1: string, period2: string) => {
    setSelectedPeriods({
      ...selectedPeriods,
      period1,
      period2
    });
  };

  const handleCustomRangeChange = (customRange: {
    start1: string;
    end1: string;
    start2: string;
    end2: string;
  }) => {
    setSelectedPeriods({
      ...selectedPeriods,
      type: 'custom',
      customRange
    });
  };

  const availablePeriods = getAvailablePeriods(data);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Box className="h-8 w-8 text-blue-500 mr-2" />
            <h1 className="text-2xl font-bold text-gray-900">Sales Analytics Dashboard</h1>
          </div>
          {data.length > 0 && (
            <button
              onClick={handleExportPDF}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </button>
          )}
        </div>

        {data.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6">
            <FileUpload onFileUpload={handleFileUpload} />
          </div>
        ) : (
          <div className="space-y-6">
            <TimeComparisonSelector
              availablePeriods={availablePeriods}
              selectedPeriods={selectedPeriods}
              onPeriodTypeChange={handlePeriodTypeChange}
              onPeriodChange={handlePeriodChange}
              onCustomRangeChange={handleCustomRangeChange}
            />

            <AnalyticsTabs 
              data={data}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              selectedPeriods={selectedPeriods}
            />
          </div>
        )}
      </div>
    </div>
  );
}