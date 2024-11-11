import { OrderData } from '../types';
import { parseDate, getMonthKey, getQuarterKey, getWeekKey, getYearKey } from './dateUtils';

export function filterDataByPeriod(
  data: OrderData[],
  periodType: 'week' | 'month' | 'quarter' | 'year' | 'custom',
  period: string,
  customRange?: { start: string; end: string }
): OrderData[] {
  if (!Array.isArray(data) || data.length === 0) {
    return [];
  }

  return data.filter(order => {
    try {
      const orderDate = parseDate(order.date);
      
      if (periodType === 'custom' && customRange) {
        const start = parseDate(customRange.start);
        const end = parseDate(customRange.end);
        return orderDate >= start && orderDate <= end;
      }

      switch (periodType) {
        case 'week':
          return getWeekKey(orderDate) === period;
        case 'month':
          return getMonthKey(orderDate) === period;
        case 'quarter':
          return getQuarterKey(orderDate) === period;
        case 'year':
          return getYearKey(orderDate) === period;
        default:
          return false;
      }
    } catch (error) {
      console.error('Error filtering data:', error);
      return false;
    }
  });
}

export function calculatePeriodMetrics(data: OrderData[]) {
  if (!Array.isArray(data) || data.length === 0) {
    return {
      totalOrders: 0,
      totalItems: 0,
      averageOrderSize: 0,
      uniqueSkus: 0
    };
  }

  const uniqueOrders = new Set(data.map(order => order.order_number));
  const uniqueSkus = new Set(data.map(order => order.sku));
  const totalItems = data.reduce((sum, order) => sum + order.quantity, 0);

  return {
    totalOrders: uniqueOrders.size,
    totalItems,
    averageOrderSize: totalItems / uniqueOrders.size || 0,
    uniqueSkus: uniqueSkus.size
  };
}

export function getAvailablePeriods(data: OrderData[]) {
  if (!Array.isArray(data) || data.length === 0) {
    return {
      weeks: [],
      months: [],
      quarters: [],
      years: []
    };
  }

  const periods = data.reduce((acc, order) => {
    try {
      const date = parseDate(order.date);
      acc.weeks.add(getWeekKey(date));
      acc.months.add(getMonthKey(date));
      acc.quarters.add(getQuarterKey(date));
      acc.years.add(getYearKey(date));
    } catch (error) {
      console.error('Error processing date:', error);
    }
    return acc;
  }, {
    weeks: new Set<string>(),
    months: new Set<string>(),
    quarters: new Set<string>(),
    years: new Set<string>()
  });

  return {
    weeks: Array.from(periods.weeks).sort(),
    months: Array.from(periods.months).sort(),
    quarters: Array.from(periods.quarters).sort(),
    years: Array.from(periods.years).sort()
  };
}

export function getInitialPeriods(data: OrderData[]) {
  if (!Array.isArray(data) || data.length === 0) {
    return null;
  }

  const periods = getAvailablePeriods(data);
  const monthsArray = periods.months;
  
  if (monthsArray.length < 2) {
    return null;
  }

  return {
    type: 'month' as const,
    period1: monthsArray[monthsArray.length - 2],
    period2: monthsArray[monthsArray.length - 1],
    customRange: {
      start1: '',
      end1: '',
      start2: '',
      end2: ''
    }
  };
}