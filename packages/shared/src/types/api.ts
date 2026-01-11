import { ZodType, z } from 'zod';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: {
    id: number;
    username: string;
    telegramChatId: string | null;
  };
}

export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export interface CreateClientRequest {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  notes?: string;
}

export const createClientSchema = z.object({
  name: z.string().min(1, 'Client name is required'),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  company: z.string().optional(),
  notes: z.string().optional(),
});

export interface UpdateClientRequest extends Partial<CreateClientRequest> {}

export const updateClientSchema = z.object({
  name: z.string().min(1, 'Client name is required').optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  company: z.string().optional(),
  notes: z.string().optional(),
});

export interface CreateSubscriptionRequest {
  clientId: number;
  type: string;
  amount: number;
  currency: string;
  billingCycle?: string;
  startDate: Date | string;
  endDate?: Date | string;
  trialEndDate?: Date | string;
  usageLimit?: number;
  notes?: string;
}

export const createSubscriptionSchema = z.object({
  clientId: z.number().min(1, 'Client is required'),
  type: z.enum(['recurring', 'one_time', 'usage_based', 'trial']),
  amount: z.number().min(0, 'Amount must be positive'),
  currency: z.enum(['USD', 'UZS']),
  billingCycle: z.enum(['daily', 'weekly', 'monthly', 'quarterly', 'yearly']).optional(),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()).optional(),
  trialEndDate: z.string().or(z.date()).optional(),
  usageLimit: z.number().optional(),
  notes: z.string().optional(),
});

export interface CreatePaymentRequest {
  clientId: number;
  subscriptionId?: number;
  amount: number;
  currency: string;
  paymentDate: Date | string;
  notes?: string;
}

export const createPaymentSchema = z.object({
  clientId: z.number().min(1, 'Client is required'),
  subscriptionId: z.number().optional(),
  amount: z.number().min(0, 'Amount must be positive'),
  currency: z.enum(['USD', 'UZS']),
  paymentDate: z.string().or(z.date()),
  notes: z.string().optional(),
});

export interface CreateExpenseRequest {
  type: string;
  description: string;
  amount: number;
  currency: string;
  dueDate?: Date | string;
  paidDate?: Date | string;
  recurring?: boolean;
  recurringInterval?: string;
  vendor?: string;
  category?: string;
  notes?: string;
}

export const createExpenseSchema = z.object({
  type: z.enum([
    'vendor',
    'contractor',
    'software_license',
    'infrastructure',
    'marketing',
    'office_supplies',
    'legal',
    'accounting',
    'other',
  ]),
  description: z.string().min(1, 'Description is required'),
  amount: z.number().min(0, 'Amount must be positive'),
  currency: z.enum(['USD', 'UZS']),
  dueDate: z.string().or(z.date()).optional(),
  paidDate: z.string().or(z.date()).optional(),
  recurring: z.boolean().optional(),
  recurringInterval: z.enum(['daily', 'weekly', 'monthly', 'quarterly', 'yearly']).optional(),
  vendor: z.string().optional(),
  category: z.string().optional(),
  notes: z.string().optional(),
});

export interface CreateExchangeRateRequest {
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  effectiveDate: Date | string;
}

export const createExchangeRateSchema = z.object({
  fromCurrency: z.enum(['USD', 'UZS']),
  toCurrency: z.enum(['USD', 'UZS']),
  rate: z.number().min(0, 'Rate must be positive'),
  effectiveDate: z.string().or(z.date()),
});

export interface UpdateNotificationSettingsRequest {
  notifyOverduePayments?: boolean;
  notifyRenewals?: boolean;
  notifyExpenses?: boolean;
  dailySummary?: boolean;
  renewalReminderDays?: number;
}

export const updateNotificationSettingsSchema = z.object({
  notifyOverduePayments: z.boolean().optional(),
  notifyRenewals: z.boolean().optional(),
  notifyExpenses: z.boolean().optional(),
  dailySummary: z.boolean().optional(),
  renewalReminderDays: z.number().min(1).max(30).optional(),
});

export interface ReportFilters {
  dateRange: {
    startDate: Date | string;
    endDate: Date | string;
    type: string;
  };
  currency?: string;
}

export interface TelegramConnectRequest {
  telegramUsername: string;
}

export const telegramConnectSchema = z.object({
  telegramUsername: z.string().min(1, 'Telegram username is required'),
});
