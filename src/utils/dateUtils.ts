import { format, parse, startOfWeek, endOfWeek, addDays } from 'date-fns';

export function parseDate(dateStr: string): Date {
  try {
    // Handle DD/MM/YYYY format
    if (dateStr.includes('/')) {
      const [day, month, year] = dateStr.split('/').map(Number);
      const parsedDate = new Date(year, month - 1, day);
      if (isNaN(parsedDate.getTime())) {
        throw new Error('Invalid date');
      }
      return parsedDate;
    }
    // Handle YYYY-MM-DD format
    const parsedDate = new Date(dateStr);
    if (isNaN(parsedDate.getTime())) {
      throw new Error('Invalid date');
    }
    return parsedDate;
  } catch (error) {
    console.error('Error parsing date:', dateStr, error);
    throw new Error(`Invalid date format: ${dateStr}`);
  }
}

export function formatDate(date: Date): string {
  try {
    return format(date, 'yyyy-MM-dd');
  } catch (error) {
    console.error('Error formatting date:', date, error);
    return 'Invalid Date';
  }
}

export function formatWeekRange(date: Date): string {
  try {
    const start = startOfWeek(date, { weekStartsOn: 1 });
    const end = endOfWeek(date, { weekStartsOn: 1 });
    return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
  } catch (error) {
    console.error('Error formatting week range:', date, error);
    return 'Invalid Week Range';
  }
}

export function getMonthKey(date: Date): string {
  try {
    return format(date, 'yyyy-MM');
  } catch (error) {
    console.error('Error getting month key:', date, error);
    return 'Invalid Month';
  }
}

export function getQuarterKey(date: Date): string {
  try {
    const month = date.getMonth();
    const quarter = Math.floor(month / 3) + 1;
    return `${date.getFullYear()}-Q${quarter}`;
  } catch (error) {
    console.error('Error getting quarter key:', date, error);
    return 'Invalid Quarter';
  }
}

export function getYearKey(date: Date): string {
  try {
    return format(date, 'yyyy');
  } catch (error) {
    console.error('Error getting year key:', date, error);
    return 'Invalid Year';
  }
}

export function getWeekKey(date: Date): string {
  try {
    const start = startOfWeek(date, { weekStartsOn: 1 });
    return format(start, 'yyyy-MM-dd');
  } catch (error) {
    console.error('Error getting week key:', date, error);
    return 'Invalid Week';
  }
}

export function formatPeriod(type: string, value: string): string {
  try {
    switch (type) {
      case 'week': {
        const date = new Date(value);
        return formatWeekRange(date);
      }
      case 'month': {
        const [year, month] = value.split('-');
        return format(new Date(Number(year), Number(month) - 1), 'MMMM yyyy');
      }
      case 'quarter': {
        const [year, quarter] = value.split('-Q');
        return `Q${quarter} ${year}`;
      }
      case 'year':
        return value;
      default:
        return value;
    }
  } catch (error) {
    console.error('Error formatting period:', type, value, error);
    return 'Invalid Period';
  }
}

export function getWeekRange(weekKey: string): { start: Date; end: Date } {
  try {
    const start = new Date(weekKey);
    const end = addDays(start, 6);
    return { start, end };
  } catch (error) {
    console.error('Error getting week range:', weekKey, error);
    throw new Error(`Invalid week key: ${weekKey}`);
  }
}