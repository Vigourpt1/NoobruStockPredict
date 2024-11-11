import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import { Label } from './ui/label';
import { Input } from './ui/input';

interface TimeComparisonSelectorProps {
  selectedPeriods: {
    type: string;
    period1?: string;
    period2?: string;
    customRange?: {
      start1: string;
      end1: string;
      start2: string;
      end2: string;
    };
  };
  onCustomRangeChange: (range: { start1: string; end1: string; start2: string; end2: string }) => void;
}

export function TimeComparisonSelector({
  selectedPeriods,
  onCustomRangeChange,
}: TimeComparisonSelectorProps) {
  const [customInput, setCustomInput] = useState({
    start1: selectedPeriods.customRange?.start1 || '',
    end1: selectedPeriods.customRange?.end1 || '',
    start2: selectedPeriods.customRange?.start2 || '',
    end2: selectedPeriods.customRange?.end2 || '',
  });

  const [errors, setErrors] = useState({
    start1: '',
    end1: '',
    start2: '',
    end2: '',
  });

  useEffect(() => {
    if (selectedPeriods.customRange) {
      setCustomInput({
        start1: selectedPeriods.customRange.start1 || '',
        end1: selectedPeriods.customRange.end1 || '',
        start2: selectedPeriods.customRange.start2 || '',
        end2: selectedPeriods.customRange.end2 || '',
      });
    }
  }, [selectedPeriods.customRange]);

  const validateDates = (newInput: typeof customInput): boolean => {
    const newErrors = {
      start1: '',
      end1: '',
      start2: '',
      end2: '',
    };

    // Validate required fields
    if (!newInput.start1) newErrors.start1 = 'Start date is required';
    if (!newInput.end1) newErrors.end1 = 'End date is required';
    if (!newInput.start2) newErrors.start2 = 'Start date is required';
    if (!newInput.end2) newErrors.end2 = 'End date is required';

    if (Object.values(newErrors).some(error => error)) {
      setErrors(newErrors);
      return false;
    }

    const start1Date = new Date(newInput.start1);
    const end1Date = new Date(newInput.end1);
    const start2Date = new Date(newInput.start2);
    const end2Date = new Date(newInput.end2);

    // Validate date order within periods
    if (start1Date > end1Date) {
      newErrors.end1 = 'End date must be after start date';
    }
    if (start2Date > end2Date) {
      newErrors.end2 = 'End date must be after start date';
    }

    // Validate period separation
    if (end1Date >= start2Date) {
      newErrors.start2 = 'Second period must start after first period ends';
    }

    setErrors(newErrors);
    return Object.values(newErrors).every(error => !error);
  };

  const handleCustomDateChange = (field: keyof typeof customInput, value: string) => {
    const newInput = { ...customInput, [field]: value };
    setCustomInput(newInput);

    if (newInput.start1 && newInput.end1 && newInput.start2 && newInput.end2) {
      if (validateDates(newInput)) {
        onCustomRangeChange(newInput);
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-500" />
            <h3 className="text-sm font-medium">Period 1</h3>
          </div>
          <div className="space-y-3">
            <div>
              <Label htmlFor="start1">Start Date</Label>
              <Input
                id="start1"
                type="date"
                value={customInput.start1}
                onChange={(e) => handleCustomDateChange('start1', e.target.value)}
                max={customInput.end1 || undefined}
                className={errors.start1 ? 'border-red-500' : ''}
              />
              {errors.start1 && <p className="text-red-500 text-sm mt-1">{errors.start1}</p>}
            </div>
            <div>
              <Label htmlFor="end1">End Date</Label>
              <Input
                id="end1"
                type="date"
                value={customInput.end1}
                onChange={(e) => handleCustomDateChange('end1', e.target.value)}
                min={customInput.start1 || undefined}
                max={customInput.start2 || undefined}
                className={errors.end1 ? 'border-red-500' : ''}
              />
              {errors.end1 && <p className="text-red-500 text-sm mt-1">{errors.end1}</p>}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-500" />
            <h3 className="text-sm font-medium">Period 2</h3>
          </div>
          <div className="space-y-3">
            <div>
              <Label htmlFor="start2">Start Date</Label>
              <Input
                id="start2"
                type="date"
                value={customInput.start2}
                onChange={(e) => handleCustomDateChange('start2', e.target.value)}
                min={customInput.end1 || undefined}
                max={customInput.end2 || undefined}
                className={errors.start2 ? 'border-red-500' : ''}
              />
              {errors.start2 && <p className="text-red-500 text-sm mt-1">{errors.start2}</p>}
            </div>
            <div>
              <Label htmlFor="end2">End Date</Label>
              <Input
                id="end2"
                type="date"
                value={customInput.end2}
                onChange={(e) => handleCustomDateChange('end2', e.target.value)}
                min={customInput.start2 || undefined}
                className={errors.end2 ? 'border-red-500' : ''}
              />
              {errors.end2 && <p className="text-red-500 text-sm mt-1">{errors.end2}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}