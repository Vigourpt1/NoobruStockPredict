import { OrderData, ColumnMapping } from '../types';
import { parseDate } from './dateUtils';

export function parseCSVData(csvText: string, mapping: ColumnMapping): OrderData[] {
  try {
    const lines = csvText.trim().split(/\r\n|\n/);
    if (lines.length < 2) {
      throw new Error('CSV file must contain headers and at least one data row');
    }

    const headers = lines[0].split(',').map(h => h.trim());
    const mappedIndexes = {
      order_number: headers.indexOf(mapping.order_number),
      sku: headers.indexOf(mapping.sku),
      quantity: headers.indexOf(mapping.quantity),
      date: headers.indexOf(mapping.date)
    };

    // Validate all required columns are found
    Object.entries(mappedIndexes).forEach(([key, index]) => {
      if (index === -1) {
        throw new Error(`Required column '${key}' not found in CSV`);
      }
    });

    const parsedData = lines.slice(1)
      .map((line, lineIndex) => {
        try {
          const values = line.split(',').map(v => v.trim());
          if (values.length !== headers.length) {
            console.warn(`Line ${lineIndex + 2} has incorrect number of columns`);
            return null;
          }

          const quantity = parseInt(values[mappedIndexes.quantity], 10);
          if (isNaN(quantity) || quantity < 0) {
            console.warn(`Invalid quantity on line ${lineIndex + 2}`);
            return null;
          }

          const dateStr = values[mappedIndexes.date];
          const parsedDate = parseDate(dateStr);
          if (!parsedDate) {
            console.warn(`Invalid date format on line ${lineIndex + 2}`);
            return null;
          }

          const orderData: OrderData = {
            order_number: values[mappedIndexes.order_number],
            sku: values[mappedIndexes.sku],
            quantity,
            date: formatDate(parsedDate)
          };

          if (!orderData.order_number || !orderData.sku) {
            console.warn(`Missing required data on line ${lineIndex + 2}`);
            return null;
          }

          return orderData;
        } catch (error) {
          console.warn(`Error parsing line ${lineIndex + 2}:`, error);
          return null;
        }
      })
      .filter((order): order is OrderData => order !== null);

    if (parsedData.length === 0) {
      throw new Error('No valid data rows found in CSV');
    }

    return parsedData;
  } catch (error) {
    console.error('Error parsing CSV:', error);
    throw error instanceof Error ? error : new Error('Failed to parse CSV file');
  }
}

function formatDate(date: Date): string {
  try {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
}