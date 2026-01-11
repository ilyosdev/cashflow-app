import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { eq, and, gte, lte, sql } from 'drizzle-orm';
import { getDatabase, payments, expenses, subscriptions, clients, users, notificationSettings } from '../database';
import { TelegramService } from '../telegram/telegram.service';
import { formatDate, getDaysUntil, formatCurrency } from '@subscriptions/shared';

@Injectable()
export class NotificationsService {
  constructor(private telegramService: TelegramService) {}

  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async checkOverduePayments() {
    const db = getDatabase();

    const overduePayments = await db
      .select({
        id: payments.id,
        amount: payments.amount,
        currency: payments.currency,
        paymentDate: payments.paymentDate,
        client: {
          id: clients.id,
          name: clients.name,
        },
        subscription: {
          type: subscriptions.type,
        },
        user: {
          id: users.id,
          telegramChatId: users.telegramChatId,
        },
        settings: {
          notifyOverduePayments: notificationSettings.notifyOverduePayments,
        },
      })
      .from(payments)
      .leftJoin(clients, eq(payments.clientId, clients.id))
      .leftJoin(subscriptions, eq(payments.subscriptionId, subscriptions.id))
      .leftJoin(users, eq(users.id, sql`1`))
      .leftJoin(notificationSettings, eq(notificationSettings.userId, users.id))
      .where(eq(payments.status, 'overdue'));

    for (const payment of overduePayments) {
      if (payment.user?.telegramChatId && payment.settings?.notifyOverduePayments) {
        const overdueDays = Math.floor(
          (Date.now() - new Date(payment.paymentDate).getTime()) / (1000 * 60 * 60 * 24),
        );

        await this.telegramService.sendOverduePaymentAlert({
          chatId: payment.user.telegramChatId,
          client: payment.client?.name || 'Unknown',
          subscription: payment.subscription?.type || 'Unknown',
          amount: formatCurrency(Number(payment.amount), payment.currency),
          overdueDays,
        });
      }
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async checkSubscriptionRenewals() {
    const db = getDatabase();

    const settingsResult = await db
      .select()
      .from(notificationSettings)
      .leftJoin(users, eq(users.id, notificationSettings.userId))
      .limit(1);

    if (!settingsResult.length) return;

    const { user, notification_settings } = settingsResult[0] as any;

    if (!user?.telegramChatId || !notification_settings?.notifyRenewals) return;

    const reminderDays = notification_settings?.renewalReminderDays || 7;
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + reminderDays);

    const renewingSubscriptions = await db
      .select({
        id: subscriptions.id,
        amount: subscriptions.amount,
        currency: subscriptions.currency,
        endDate: subscriptions.endDate,
        client: {
          name: clients.name,
        },
      })
      .from(subscriptions)
      .leftJoin(clients, eq(subscriptions.clientId, clients.id))
      .where(
        and(
          eq(subscriptions.status, 'active'),
          eq(subscriptions.type, 'recurring'),
          gte(subscriptions.endDate, new Date()),
          lte(subscriptions.endDate, targetDate),
        ),
      );

    for (const subscription of renewingSubscriptions) {
      const daysLeft = getDaysUntil(subscription.endDate);

      await this.telegramService.sendSubscriptionRenewalReminder({
        chatId: user.telegramChatId,
        client: subscription.client?.name || 'Unknown',
        plan: subscription.type,
        amount: formatCurrency(Number(subscription.amount), subscription.currency),
        renewalDate: formatDate(subscription.endDate),
        daysLeft,
      });
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async checkExpenseDueDates() {
    const db = getDatabase();

    const settingsResult = await db
      .select()
      .from(notificationSettings)
      .leftJoin(users, eq(users.id, notificationSettings.userId))
      .limit(1);

    if (!settingsResult.length) return;

    const { user, notification_settings } = settingsResult[0] as any;

    if (!user?.telegramChatId || !notification_settings?.notifyExpenses) return;

    const today = new Date();
    const todayEnd = new Date(today);
    todayEnd.setHours(23, 59, 59, 999);

    const dueExpenses = await db
      .select({
        id: expenses.id,
        type: expenses.type,
        description: expenses.description,
        amount: expenses.amount,
        currency: expenses.currency,
        dueDate: expenses.dueDate,
      })
      .from(expenses)
      .where(
        and(
          eq(expenses.status, 'pending'),
          gte(expenses.dueDate, today),
          lte(expenses.dueDate, todayEnd),
        ),
      );

    for (const expense of dueExpenses) {
      await this.telegramService.sendExpenseDueAlert({
        chatId: user.telegramChatId,
        type: expense.type,
        description: expense.description,
        amount: formatCurrency(Number(expense.amount), expense.currency),
        dueDate: formatDate(expense.dueDate),
      });
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async sendDailySummary() {
    const db = getDatabase();

    const settingsResult = await db
      .select()
      .from(notificationSettings)
      .leftJoin(users, eq(users.id, notificationSettings.userId))
      .limit(1);

    if (!settingsResult.length) return;

    const { user, notification_settings } = settingsResult[0] as any;

    if (!user?.telegramChatId || !notification_settings?.dailySummary) return;

    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayEnd = new Date(todayStart);
    todayEnd.setHours(23, 59, 59, 999);

    const paymentsResult = await db
      .select({
        total: sql`SUM(${payments.amount})`,
      })
      .from(payments)
      .where(
        and(
          gte(payments.paymentDate, todayStart),
          lte(payments.paymentDate, todayEnd),
          eq(payments.status, 'completed'),
        ),
      );

    const expensesResult = await db
      .select({
        total: sql`SUM(${expenses.amount})`,
      })
      .from(expenses)
      .where(
        and(
          gte(expenses.paidDate, todayStart),
          lte(expenses.paidDate, todayEnd),
          eq(expenses.status, 'paid'),
        ),
      );

    const paymentsReceived = Number(paymentsResult[0]?.total || 0);
    const expensesPaid = Number(expensesResult[0]?.total || 0);

    await this.telegramService.sendDailySummary({
      chatId: user.telegramChatId,
      paymentsReceived: formatCurrency(paymentsReceived, 'USD'),
      expenses: formatCurrency(expensesPaid, 'USD'),
      net: formatCurrency(paymentsReceived - expensesPaid, 'USD'),
      date: formatDate(today),
    });
  }
}
