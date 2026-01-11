import { Injectable, NotFoundException } from '@nestjs/common';
import { eq, and, like } from 'drizzle-orm';
import { getDatabase, payments, clients, subscriptions } from '../database';
import { createPaymentSchema } from '@subscriptions/shared';
import type { CreatePaymentRequest } from '@subscriptions/shared';

@Injectable()
export class PaymentsService {
  async findAll(clientId?: number, search?: string) {
    const db = getDatabase();
    let query = db
      .select({
        id: payments.id,
        clientId: payments.clientId,
        subscriptionId: payments.subscriptionId,
        amount: payments.amount,
        currency: payments.currency,
        paymentDate: payments.paymentDate,
        status: payments.status,
        notes: payments.notes,
        createdAt: payments.createdAt,
        updatedAt: payments.updatedAt,
        client: {
          id: clients.id,
          name: clients.name,
        },
        subscription: {
          id: subscriptions.id,
          type: subscriptions.type,
        },
      })
      .from(payments)
      .leftJoin(clients, eq(payments.clientId, clients.id))
      .leftJoin(subscriptions, eq(payments.subscriptionId, subscriptions.id));

    if (clientId) {
      query = query.where(eq(payments.clientId, clientId)) as typeof query;
    }

    if (search) {
      query = query.where(
        like(clients.name, `%${search}%`),
      ) as typeof query;
    }

    return await query.orderBy(payments.createdAt);
  }

  async findOne(id: number) {
    const db = getDatabase();
    const result = await db
      .select({
        id: payments.id,
        clientId: payments.clientId,
        subscriptionId: payments.subscriptionId,
        amount: payments.amount,
        currency: payments.currency,
        paymentDate: payments.paymentDate,
        status: payments.status,
        notes: payments.notes,
        createdAt: payments.createdAt,
        updatedAt: payments.updatedAt,
        client: {
          id: clients.id,
          name: clients.name,
        },
        subscription: {
          id: subscriptions.id,
          type: subscriptions.type,
        },
      })
      .from(payments)
      .leftJoin(clients, eq(payments.clientId, clients.id))
      .leftJoin(subscriptions, eq(payments.subscriptionId, subscriptions.id))
      .where(eq(payments.id, id))
      .limit(1);

    if (!result.length) {
      throw new NotFoundException('Payment not found');
    }

    return result[0];
  }

  async create(data: CreatePaymentRequest) {
    const validated = createPaymentSchema.parse(data);
    const db = getDatabase();

    const paymentDate =
      typeof validated.paymentDate === 'string'
        ? new Date(validated.paymentDate)
        : validated.paymentDate;

    const result = await db.insert(payments).values({
      clientId: validated.clientId,
      subscriptionId: validated.subscriptionId || null,
      amount: validated.amount.toString(),
      currency: validated.currency,
      paymentDate,
      status: validated.paymentDate > new Date() ? 'pending' : 'completed',
      notes: validated.notes || null,
    });

    return this.findOne(result[0].insertId);
  }

  async update(id: number, data: Partial<CreatePaymentRequest>) {
    const db = getDatabase();

    const updateData: any = { ...data };

    if (data.paymentDate && typeof data.paymentDate === 'string') {
      updateData.paymentDate = new Date(data.paymentDate);
    }

    if (updateData.amount) {
      updateData.amount = updateData.amount.toString();
    }

    await db.update(payments).set(updateData).where(eq(payments.id, id));

    return this.findOne(id);
  }

  async delete(id: number) {
    const db = getDatabase();
    const result = await db.delete(payments).where(eq(payments.id, id));

    if (!result.affectedRows) {
      throw new NotFoundException('Payment not found');
    }
  }
}
