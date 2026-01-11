import { mysqlTable, mysqlEnum, int, varchar, text, decimal, datetime, tinyint, timestamp } from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';

export const users = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement(),
  username: varchar('username', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  telegramChatId: varchar('telegram_chat_id', { length: 255 }),
  createdAt: timestamp('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const notificationSettings = mysqlTable('notification_settings', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').notNull().references(() => users.id),
  notifyOverduePayments: tinyint('notify_overdue_payments').notNull().default(1),
  notifyRenewals: tinyint('notify_renewals').notNull().default(1),
  notifyExpenses: tinyint('notify_expenses').notNull().default(1),
  dailySummary: tinyint('daily_summary').notNull().default(0),
  renewalReminderDays: int('renewal_reminder_days').notNull().default(7),
  createdAt: timestamp('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const clients = mysqlTable('clients', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 50 }),
  company: varchar('company', { length: 255 }),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const subscriptions = mysqlTable('subscriptions', {
  id: int('id').primaryKey().autoincrement(),
  clientId: int('client_id').notNull().references(() => clients.id, { onDelete: 'cascade' }),
  type: mysqlEnum('type', ['recurring', 'one_time', 'usage_based', 'trial']).notNull(),
  amount: decimal('amount', { precision: 15, scale: 2 }).notNull(),
  currency: mysqlEnum('currency', ['USD', 'UZS']).notNull(),
  status: mysqlEnum('status', ['active', 'paused', 'cancelled', 'expired', 'trial']).notNull(),
  billingCycle: mysqlEnum('billing_cycle', ['daily', 'weekly', 'monthly', 'quarterly', 'yearly']),
  startDate: datetime('start_date').notNull(),
  endDate: datetime('end_date'),
  trialEndDate: datetime('trial_end_date'),
  usageLimit: int('usage_limit'),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const payments = mysqlTable('payments', {
  id: int('id').primaryKey().autoincrement(),
  clientId: int('client_id').notNull().references(() => clients.id, { onDelete: 'cascade' }),
  subscriptionId: int('subscription_id').references(() => subscriptions.id, { onDelete: 'set null' }),
  amount: decimal('amount', { precision: 15, scale: 2 }).notNull(),
  currency: mysqlEnum('currency', ['USD', 'UZS']).notNull(),
  paymentDate: datetime('payment_date').notNull(),
  status: mysqlEnum('status', ['pending', 'completed', 'overdue', 'cancelled']).notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const expenses = mysqlTable('expenses', {
  id: int('id').primaryKey().autoincrement(),
  type: mysqlEnum('type', [
    'vendor',
    'contractor',
    'software_license',
    'infrastructure',
    'marketing',
    'office_supplies',
    'legal',
    'accounting',
    'other',
  ]).notNull(),
  description: varchar('description', { length: 500 }).notNull(),
  amount: decimal('amount', { precision: 15, scale: 2 }).notNull(),
  currency: mysqlEnum('currency', ['USD', 'UZS']).notNull(),
  dueDate: datetime('due_date'),
  paidDate: datetime('paid_date'),
  status: mysqlEnum('status', ['pending', 'paid', 'overdue', 'cancelled']).notNull(),
  recurring: tinyint('recurring').notNull().default(0),
  recurringInterval: mysqlEnum('recurring_interval', ['daily', 'weekly', 'monthly', 'quarterly', 'yearly']),
  vendor: varchar('vendor', { length: 255 }),
  category: varchar('category', { length: 255 }),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const exchangeRates = mysqlTable('exchange_rates', {
  id: int('id').primaryKey().autoincrement(),
  fromCurrency: mysqlEnum('from_currency', ['USD', 'UZS']).notNull(),
  toCurrency: mysqlEnum('to_currency', ['USD', 'UZS']).notNull(),
  rate: decimal('rate', { precision: 15, scale: 8 }).notNull(),
  effectiveDate: datetime('effective_date').notNull(),
  createdAt: timestamp('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});
