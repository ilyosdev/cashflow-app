import { Injectable, NotFoundException } from '@nestjs/common';
import { eq, like, or, and } from 'drizzle-orm';
import { getDatabase, expenses } from '../database';
import { createExpenseSchema } from '@subscriptions/shared';
import type { CreateExpenseRequest } from '@subscriptions/shared';

@Injectable()
export class ExpensesService {
  async findAll(search?: string, type?: string) {
    const db = getDatabase();
    let query = db.select().from(expenses);

    const conditions = [];

    if (type) {
      conditions.push(eq(expenses.type, type as any));
    }

    if (search) {
      conditions.push(
        or(
          like(expenses.description, `%${search}%`),
          like(expenses.vendor!, `%${search}%`),
        )!,
      );
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as typeof query;
    }

    return await query.orderBy(expenses.createdAt);
  }

  async findOne(id: number) {
    const db = getDatabase();
    const result = await db.select().from(expenses).where(eq(expenses.id, id)).limit(1);

    if (!result.length) {
      throw new NotFoundException('Expense not found');
    }

    return result[0];
  }

  async create(data: CreateExpenseRequest) {
    const validated = createExpenseSchema.parse(data);
    const db = getDatabase();

    const dueDate =
      validated.dueDate && typeof validated.dueDate === 'string'
        ? new Date(validated.dueDate)
        : validated.dueDate || null;
    const paidDate =
      validated.paidDate && typeof validated.paidDate === 'string'
        ? new Date(validated.paidDate)
        : validated.paidDate || null;

    const status = paidDate ? 'paid' : dueDate && dueDate < new Date() ? 'overdue' : 'pending';

    const result = await db.insert(expenses).values({
      type: validated.type as any,
      description: validated.description,
      amount: validated.amount.toString(),
      currency: validated.currency,
      dueDate,
      paidDate,
      status,
      recurring: validated.recurring ? 1 : 0,
      recurringInterval: validated.recurringInterval || null,
      vendor: validated.vendor || null,
      category: validated.category || null,
      notes: validated.notes || null,
    });

    return this.findOne(Number(result[0].insertId));
  }

  async update(id: number, data: Partial<CreateExpenseRequest>) {
    const db = getDatabase();

    const updateData: any = { ...data };

    if (data.dueDate && typeof data.dueDate === 'string') {
      updateData.dueDate = new Date(data.dueDate);
    }
    if (data.paidDate && typeof data.paidDate === 'string') {
      updateData.paidDate = new Date(data.paidDate);
    }

    if (updateData.amount) {
      updateData.amount = updateData.amount.toString();
    }

    await db.update(expenses).set(updateData).where(eq(expenses.id, id));

    return this.findOne(id);
  }

  async delete(id: number) {
    const db = getDatabase();
    const result = await db.delete(expenses).where(eq(expenses.id, id));

    if (result.rowsAffected === 0) {
      throw new NotFoundException('Expense not found');
    }
  }
}
