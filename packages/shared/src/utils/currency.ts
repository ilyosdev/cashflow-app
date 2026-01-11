export interface ExchangeRate {
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  effectiveDate: Date;
}

export class CurrencyConverter {
  private exchangeRates: ExchangeRate[] = [];

  constructor(rates: ExchangeRate[] = []) {
    this.exchangeRates = rates;
  }

  setRates(rates: ExchangeRate[]): void {
    this.exchangeRates = rates;
  }

  addRate(rate: ExchangeRate): void {
    this.exchangeRates.push(rate);
  }

  getRate(fromCurrency: string, toCurrency: string, date?: Date): number {
    if (fromCurrency === toCurrency) {
      return 1;
    }

    const targetDate = date || new Date();

    const rate = this.exchangeRates
      .filter((r) => r.fromCurrency === fromCurrency && r.toCurrency === toCurrency)
      .sort((a, b) => {
        const aDiff = Math.abs(new Date(a.effectiveDate).getTime() - targetDate.getTime());
        const bDiff = Math.abs(new Date(b.effectiveDate).getTime() - targetDate.getTime());
        return aDiff - bDiff;
      })[0];

    if (rate) {
      return rate.rate;
    }

    return 0;
  }

  convert(amount: number, fromCurrency: string, toCurrency: string, date?: Date): number {
    const rate = this.getRate(fromCurrency, toCurrency, date);
    return amount * rate;
  }

  hasRate(fromCurrency: string, toCurrency: string): boolean {
    return (
      fromCurrency === toCurrency ||
      this.exchangeRates.some(
        (r) => r.fromCurrency === fromCurrency && r.toCurrency === toCurrency,
      )
    );
  }
}

export function calculateMRR(subscriptions: Array<{ amount: number; currency: string }>): number {
  return subscriptions.reduce((sum, sub) => sum + sub.amount, 0);
}

export function calculateTotalExpenses(
  expenses: Array<{ amount: number; currency: string }>,
): number {
  return expenses.reduce((sum, exp) => sum + exp.amount, 0);
}

export function calculateNetProfit(
  revenue: number,
  expenses: number,
  currency: string,
): number {
  return revenue - expenses;
}
