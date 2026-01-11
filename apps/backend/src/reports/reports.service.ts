import { Injectable } from '@nestjs/common';
import { eq, and, gte, lte, sql, desc } from 'drizzle-orm';
import { getDatabase, payments, expenses, subscriptions, clients } from '../database';
import { getDateRange } from '@subscriptions/shared';

@Injectable()
export class ReportsService {
  async getRevenueReport(
    startDate: Date,
    endDate: Date,
    currency?: string,
  ) {
    const db = getDatabase();

    const conditions = [
      gte(payments.paymentDate, startDate),
      lte(payments.paymentDate, endDate),
      eq(payments.status, 'completed'),
    ];

    if (currency) {
      conditions.push(eq(payments.currency, currency));
    }

    const result = await db
      .select({
        id: payments.id,
        clientId: payments.clientId,
        amount: payments.amount,
        currency: payments.currency,
        paymentDate: payments.paymentDate,
        clientName: clients.name,
      })
      .from(payments)
      .leftJoin(clients, eq(payments.clientId, clients.id))
      .where(and(...conditions))
      .orderBy(desc(payments.paymentDate));

    const total = await db
      .select({
        total: sql`SUM(${payments.amount})`,
      })
      .from(payments)
      .where(and(...conditions));

    return {
      payments: result,
      total: Number(total[0]?.total || 0),
      count: result.length,
      dateRange: { startDate, endDate },
    };
  }

  async getExpenseReport(
    startDate: Date,
    endDate: Date,
    currency?: string,
    type?: string,
  ) {
    const db = getDatabase();

    const conditions = [
      gte(expenses.paidDate, startDate),
      lte(expenses.paidDate, endDate),
      eq(expenses.status, 'paid'),
    ];

    if (currency) {
      conditions.push(eq(expenses.currency, currency));
    }

    if (type) {
      conditions.push(eq(expenses.type, type));
    }

    const result = await db
      .select({
        id: expenses.id,
        type: expenses.type,
        description: expenses.description,
        amount: expenses.amount,
        currency: expenses.currency,
        paidDate: expenses.paidDate,
        vendor: expenses.vendor,
        category: expenses.category,
      })
      .from(expenses)
      .where(and(...conditions))
      .orderBy(desc(expenses.paidDate));

    const total = await db
      .select({
        total: sql`SUM(${expenses.amount})`,
      })
      .from(expenses)
      .where(and(...conditions));

    const byType = await db
      .select({
        type: expenses.type,
        total: sql`SUM(${expenses.amount})`,
        count: sql`COUNT(*)`,
      })
      .from(expenses)
      .where(and(...conditions))
      .groupBy(expenses.type);

    return {
      expenses: result,
      total: Number(total[0]?.total || 0),
      count: result.length,
      byType,
      dateRange: { startDate, endDate },
    };
  }

  async getCashFlowReport(
    startDate: Date,
    endDate: Date,
    currency?: string,
  ) {
    const db = getDatabase();

    const conditionsRevenue = [
      gte(payments.paymentDate, startDate),
      lte(payments.paymentDate, endDate),
      eq(payments.status, 'completed'),
    ];

    const conditionsExpenses = [
      gte(expenses.paidDate, startDate),
      lte(expenses.paidDate, endDate),
      eq(expenses.status, 'paid'),
    ];

    if (currency) {
      conditionsRevenue.push(eq(payments.currency, currency));
      conditionsExpenses.push(eq(expenses.currency, currency));
    }

    const revenue = await db
      .select({
        total: sql`SUM(${payments.amount})`,
      })
      .from(payments)
      .where(and(...conditionsRevenue));

    const expenses = await db
      .select({
        total: sql`SUM(${expenses.amount})`,
      })
      .from(expenses)
      .where(and(...conditionsExpenses));

    return {
      revenue: Number(revenue[0]?.total || 0),
      expenses: Number(expenses[0]?.total || 0),
      net: Number(revenue[0]?.total || 0) - Number(expenses[0]?.total || 0),
      dateRange: { startDate, endDate },
    };
  }
}
