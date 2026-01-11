import { format, parseISO, isDate } from 'date-fns';

export function formatDate(date: Date | string, formatStr = 'yyyy-MM-dd'): string {
  if (isDate(date)) {
    return format(date as Date, formatStr);
  }
  return format(parseISO(date as string), formatStr);
}

export function formatDateTime(date: Date | string): string {
  return formatDate(date, 'yyyy-MM-dd HH:mm:ss');
}

export function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(num: number, decimals = 2): string {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function getDateRange(rangeType: string): { startDate: Date; endDate: Date } {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  switch (rangeType) {
    case 'today':
      return { startDate: startOfDay, endDate: endOfDay };

    case 'yesterday': {
      const yesterday = new Date(startOfDay);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayEnd = new Date(yesterday);
      yesterdayEnd.setHours(23, 59, 59, 999);
      return { startDate: yesterday, endDate: yesterdayEnd };
    }

    case 'last_7_days': {
      const sevenDaysAgo = new Date(startOfDay);
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return { startDate: sevenDaysAgo, endDate: endOfDay };
    }

    case 'last_30_days': {
      const thirtyDaysAgo = new Date(startOfDay);
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return { startDate: thirtyDaysAgo, endDate: endOfDay };
    }

    case 'this_month': {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      return { startDate: startOfMonth, endDate: endOfDay };
    }

    case 'last_month': {
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
      return { startDate: startOfLastMonth, endDate: endOfLastMonth };
    }

    case 'this_year': {
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      return { startDate: startOfYear, endDate: endOfDay };
    }

    case 'last_year': {
      const startOfLastYear = new Date(now.getFullYear() - 1, 0, 1);
      const endOfLastYear = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59, 999);
      return { startDate: startOfLastYear, endDate: endOfLastYear };
    }

    default:
      return { startDate: startOfDay, endDate: endOfDay };
  }
}

export function addDays(date: Date | string, days: number): Date {
  const d = isDate(date) ? (date as Date) : parseISO(date as string);
  const result = new Date(d);
  result.setDate(result.getDate() + days);
  return result;
}

export function addMonths(date: Date | string, months: number): Date {
  const d = isDate(date) ? (date as Date) : parseISO(date as string);
  const result = new Date(d);
  result.setMonth(result.getMonth() + months);
  return result;
}

export function isOverdue(dueDate: Date | string): boolean {
  const now = new Date();
  const due = isDate(dueDate) ? (dueDate as Date) : parseISO(dueDate as string);
  return due < now;
}

export function getDaysUntil(date: Date | string): number {
  const now = new Date();
  const target = isDate(date) ? (date as Date) : parseISO(date as string);
  const diffInMs = target.getTime() - now.getTime();
  return Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
}
