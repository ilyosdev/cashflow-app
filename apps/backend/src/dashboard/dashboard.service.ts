import { Injectable } from '@nestjs/common';
import { eq, and, gte, lte, sql } from 'drizzle-orm';
import { getDatabase, payments, expenses, subscriptions, clients } from '../database';
import { getDateRange } from '@subscriptions/shared';

@Injectable()
export class DashboardService {
  async getMetrics(dateRangeType = 'this_month') {
    const db = getDatabase();
    const range = getDateRange(dateRangeType);

    const paymentsResult = await db
      .select({
        amount: sql`SUM(${payments.amount})`,
        count: sql`COUNT(*)`,
      })
      .from(payments)
      .where(
        and(
          gte(payments.paymentDate, range.startDate),
          lte(payments.paymentDate, range.endDate),
          eq(payments.status, 'completed'),
        ),
      );

    const expensesResult = await db
      .select({
        amount: sql`SUM(${expenses.amount})`,
        count: sql`COUNT(*)`,
      })
      .from(expenses)
      .where(
        and(
          gte(expenses.paidDate, range.startDate),
          lte(expenses.paidDate, range.endDate),
          eq(expenses.status, 'paid'),
        ),
      );

    const activeSubscriptionsResult = await db
      .select({
        count: sql`COUNT(*)`,
      })
      .from(subscriptions)
      .where(eq(subscriptions.status, 'active'));

    const clientsResult = await db
      .select({
        count: sql`COUNT(*)`,
      })
      .from(clients);

    const overduePaymentsResult = await db
      .select({
        amount: sql`SUM(${payments.amount})`,
        count: sql`COUNT(*)`,
      })
      .from(payments)
      .where(eq(payments.status, 'overdue'));

    const upcomingExpensesResult = await db
      .select({
        amount: sql`SUM(${expenses.amount})`,
        count: sql`COUNT(*)`,
      })
      .from(expenses)
      .where(
        and(
          gte(expenses.dueDate, new Date()),
          lte(expenses.dueDate, getDateRange('last_7_days').endDate),
          eq(expenses.status, 'pending'),
        ),
      );

    const mrrResult = await db
      .select({
        amount: sql`SUM(${subscriptions.amount})`,
      })
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.status, 'active'),
          eq(subscriptions.type, 'recurring'),
          eq(subscriptions.billingCycle, 'monthly'),
        ),
      );

    return {
      totalMRR: Number(mrrResult[0]?.amount || 0),
      totalExpenses: Number(expensesResult[0]?.amount || 0),
      netProfit: Number(paymentsResult[0]?.amount || 0) - Number(expensesResult[0]?.amount || 0),
      paymentsReceived: Number(paymentsResult[0]?.amount || 0),
      paymentsCount: Number(paymentsResult[0]?.count || 0),
      expensesCount: Number(expensesResult[0]?.count || 0),
      activeSubscriptions: Number(activeSubscriptionsResult[0]?.count || 0),
      clientsCount: Number(clientsResult[0]?.count || 0),
      overduePayments: Number(overduePaymentsResult[0]?.amount || 0),
      overduePaymentsCount: Number(overduePaymentsResult[0]?.count || 0),
      upcomingExpenses: Number(upcomingExpensesResult[0]?.amount || 0),
      upcomingExpensesCount: Number(upcomingExpensesResult[0]?.count || 0),
      dateRange: {
        startDate: range.startDate,
        endDate: range.endDate,
        type: dateRangeType,
      },
    };
  }
}
