export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  UZS: "so'm",
};

export const CURRENCY_NAMES: Record<string, string> = {
  USD: 'US Dollar',
  UZS: 'Uzbekistan Som',
};

export const SUBSCRIPTION_TYPE_LABELS: Record<string, string> = {
  recurring: 'Recurring',
  one_time: 'One-Time',
  usage_based: 'Usage-Based',
  trial: 'Trial',
};

export const BILLING_CYCLE_LABELS: Record<string, string> = {
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
  quarterly: 'Quarterly',
  yearly: 'Yearly',
};

export const SUBSCRIPTION_STATUS_LABELS: Record<string, string> = {
  active: 'Active',
  paused: 'Paused',
  cancelled: 'Cancelled',
  expired: 'Expired',
  trial: 'Trial',
};

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  completed: 'Completed',
  overdue: 'Overdue',
  cancelled: 'Cancelled',
};

export const EXPENSE_TYPE_LABELS: Record<string, string> = {
  vendor: 'Vendor',
  contractor: 'Contractor',
  software_license: 'Software License',
  infrastructure: 'Infrastructure',
  marketing: 'Marketing',
  office_supplies: 'Office Supplies',
  legal: 'Legal',
  accounting: 'Accounting',
  other: 'Other',
};

export const EXPENSE_STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  paid: 'Paid',
  overdue: 'Overdue',
  cancelled: 'Cancelled',
};

export const DATE_RANGE_LABELS: Record<string, string> = {
  today: 'Today',
  yesterday: 'Yesterday',
  last_7_days: 'Last 7 Days',
  last_30_days: 'Last 30 Days',
  this_month: 'This Month',
  last_month: 'Last Month',
  this_year: 'This Year',
  last_year: 'Last Year',
  custom: 'Custom',
};

export const TELEGRAM_BOT_COMMANDS = {
  START: '/start',
  HELP: '/help',
  CONNECT: '/connect',
  DISCONNECT: '/disconnect',
  SETTINGS: '/settings',
  NOTIFICATIONS: '/notifications',
};

export const TELEGRAM_MESSAGE_TEMPLATES = {
  OVERDUE_PAYMENT: (data: {
    client: string;
    subscription: string;
    amount: string;
    overdueDays: number;
  }) =>
    `⚠️ <b>Overdue Payment Alert!</b>\n\n` +
    `Client: ${data.client}\n` +
    `Subscription: ${data.subscription}\n` +
    `Amount Due: ${data.amount}\n` +
    `Overdue by: ${data.overdueDays} days`,

  SUBSCRIPTION_RENEWAL: (data: {
    client: string;
    plan: string;
    amount: string;
    renewalDate: string;
    daysLeft: number;
  }) =>
    `📋 <b>Subscription Renewing Soon!</b>\n\n` +
    `Client: ${data.client}\n` +
    `Plan: ${data.plan}\n` +
    `Amount: ${data.amount}\n` +
    `Renewal Date: ${data.renewalDate} (${data.daysLeft} days)`,

  EXPENSE_DUE: (data: {
    type: string;
    description: string;
    amount: string;
    dueDate: string;
  }) =>
    `💳 <b>Expense Payment Due</b>\n\n` +
    `Type: ${data.type}\n` +
    `Description: ${data.description}\n` +
    `Amount: ${data.amount}\n` +
    `Due Date: ${data.dueDate}`,

  DAILY_SUMMARY: (data: {
    paymentsReceived: string;
    expenses: string;
    net: string;
    date: string;
  }) =>
    `📊 <b>Daily Summary</b>\n\n` +
    `Date: ${data.date}\n` +
    `✅ Payments Received: ${data.paymentsReceived}\n` +
    `💸 Expenses: ${data.expenses}\n` +
    `📈 Net: ${data.net}`,

  TELEGRAM_LINKED: (username: string) =>
    `✅ <b>Telegram Account Linked!</b>\n\n` +
    `Hello, ${username}!\n` +
    `Your Telegram account is now linked to the Subscriptions App.\n\n` +
    `Use /settings to configure notifications.`,
};

export const DEFAULT_NOTIFICATION_SETTINGS = {
  notifyOverduePayments: true,
  notifyRenewals: true,
  notifyExpenses: true,
  dailySummary: false,
  renewalReminderDays: 7,
};

export const API_ROUTES = {
  AUTH: {
    LOGIN: '/api/auth/login',
    ME: '/api/auth/me',
  },
  CLIENTS: {
    LIST: '/api/clients',
    CREATE: '/api/clients',
    UPDATE: '/api/clients/:id',
    DELETE: '/api/clients/:id',
    DETAIL: '/api/clients/:id',
  },
  SUBSCRIPTIONS: {
    LIST: '/api/subscriptions',
    CREATE: '/api/subscriptions',
    UPDATE: '/api/subscriptions/:id',
    DELETE: '/api/subscriptions/:id',
    DETAIL: '/api/subscriptions/:id',
  },
  PAYMENTS: {
    LIST: '/api/payments',
    CREATE: '/api/payments',
    UPDATE: '/api/payments/:id',
    DELETE: '/api/payments/:id',
    DETAIL: '/api/payments/:id',
  },
  EXPENSES: {
    LIST: '/api/expenses',
    CREATE: '/api/expenses',
    UPDATE: '/api/expenses/:id',
    DELETE: '/api/expenses/:id',
    DETAIL: '/api/expenses/:id',
  },
  EXCHANGE_RATES: {
    LIST: '/api/exchange-rates',
    CREATE: '/api/exchange-rates',
    UPDATE: '/api/exchange-rates/:id',
    DELETE: '/api/exchange-rates/:id',
  },
  DASHBOARD: {
    METRICS: '/api/dashboard/metrics',
  },
  REPORTS: {
    REVENUE: '/api/reports/revenue',
    EXPENSES: '/api/reports/expenses',
    CASH_FLOW: '/api/reports/cash-flow',
  },
  TELEGRAM: {
    CONNECT: '/api/telegram/connect',
    DISCONNECT: '/api/telegram/disconnect',
    SETTINGS: '/api/telegram/settings',
  },
  NOTIFICATIONS: {
    UPDATE_SETTINGS: '/api/notifications/settings',
  },
};
