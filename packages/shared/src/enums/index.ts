/**
 * Subscription types supported by the application
 */
export enum SubscriptionType {
  RECURRING = 'recurring',
  ONE_TIME = 'one_time',
  USAGE_BASED = 'usage_based',
  TRIAL = 'trial',
}

/**
 * Billing cycle for recurring subscriptions
 */
export enum BillingCycle {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
}

/**
 * Status of a subscription
 */
export enum SubscriptionStatus {
  ACTIVE = 'active',
  PAUSED = 'paused',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
  TRIAL = 'trial',
}

/**
 * Payment status
 */
export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled',
}

/**
 * Expense types for a software company
 */
export enum ExpenseType {
  VENDOR = 'vendor',
  CONTRACTOR = 'contractor',
  SOFTWARE_LICENSE = 'software_license',
  INFRASTRUCTURE = 'infrastructure',
  MARKETING = 'marketing',
  OFFICE_SUPPLIES = 'office_supplies',
  LEGAL = 'legal',
  ACCOUNTING = 'accounting',
  OTHER = 'other',
}

/**
 * Expense payment status
 */
export enum ExpenseStatus {
  PENDING = 'pending',
  PAID = 'paid',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled',
}

/**
 * Supported currencies
 */
export enum Currency {
  USD = 'USD',
  UZS = 'UZS',
}

/**
 * User roles
 */
export enum UserRole {
  ADMIN = 'admin',
  VIEWER = 'viewer',
}

/**
 * Notification types
 */
export enum NotificationType {
  OVERDUE_PAYMENT = 'overdue_payment',
  SUBSCRIPTION_RENEWAL = 'subscription_renewal',
  EXPENSE_DUE = 'expense_due',
  DAILY_SUMMARY = 'daily_summary',
}

/**
 * Date range types for reports
 */
export enum DateRangeType {
  TODAY = 'today',
  YESTERDAY = 'yesterday',
  LAST_7_DAYS = 'last_7_days',
  LAST_30_DAYS = 'last_30_days',
  THIS_MONTH = 'this_month',
  LAST_MONTH = 'last_month',
  THIS_YEAR = 'this_year',
  LAST_YEAR = 'last_year',
  CUSTOM = 'custom',
}
