export interface Client {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subscription {
  id: number;
  clientId: number;
  type: string;
  amount: number;
  currency: string;
  status: string;
  billingCycle: string | null;
  startDate: Date;
  endDate: Date | null;
  trialEndDate: Date | null;
  usageLimit: number | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  client?: Client;
}

export interface Payment {
  id: number;
  clientId: number;
  subscriptionId: number | null;
  amount: number;
  currency: string;
  paymentDate: Date;
  status: string;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  client?: Client;
  subscription?: Subscription;
}

export interface Expense {
  id: number;
  type: string;
  description: string;
  amount: number;
  currency: string;
  dueDate: Date | null;
  paidDate: Date | null;
  status: string;
  recurring: boolean;
  recurringInterval: string | null;
  vendor: string | null;
  category: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExchangeRate {
  id: number;
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  effectiveDate: Date;
  createdAt: Date;
}

export interface User {
  id: number;
  username: string;
  telegramChatId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationSettings {
  id: number;
  userId: number;
  notifyOverduePayments: boolean;
  notifyRenewals: boolean;
  notifyExpenses: boolean;
  dailySummary: boolean;
  renewalReminderDays: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardMetrics {
  totalMRR: number;
  totalExpenses: number;
  netProfit: number;
  activeSubscriptions: number;
  overduePayments: number;
  upcomingExpenses: number;
  clientsCount: number;
  paymentsReceivedThisMonth: number;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
  type: string;
}
