import { Injectable, NotFoundException } from '@nestjs/common';
import { eq, and } from 'drizzle-orm';
import { getDatabase, subscriptions, clients } from '../database';
import { createSubscriptionSchema, updateClientSchema } from '@subscriptions/shared';
import type { CreateSubscriptionRequest, UpdateClientRequest } from '@subscriptions/shared';

@Injectable()
export class SubscriptionsService {
  async findAll(clientId?: number) {
    const db = getDatabase();
    let query = db
      .select({
        id: subscriptions.id,
        clientId: subscriptions.clientId,
        type: subscriptions.type,
        amount: subscriptions.amount,
        currency: subscriptions.currency,
        status: subscriptions.status,
        billingCycle: subscriptions.billingCycle,
        startDate: subscriptions.startDate,
        endDate: subscriptions.endDate,
        trialEndDate: subscriptions.trialEndDate,
        usageLimit: subscriptions.usageLimit,
        notes: subscriptions.notes,
        createdAt: subscriptions.createdAt,
        updatedAt: subscriptions.updatedAt,
        client: {
          id: clients.id,
          name: clients.name,
          email: clients.email,
          phone: clients.phone,
          company: clients.company,
        },
      })
      .from(subscriptions)
      .leftJoin(clients, eq(subscriptions.clientId, clients.id));

    if (clientId) {
      query = query.where(eq(subscriptions.clientId, clientId)) as typeof query;
    }

    return await query.orderBy(subscriptions.createdAt);
  }

  async findOne(id: number) {
    const db = getDatabase();
    const result = await db
      .select({
        id: subscriptions.id,
        clientId: subscriptions.clientId,
        type: subscriptions.type,
        amount: subscriptions.amount,
        currency: subscriptions.currency,
        status: subscriptions.status,
        billingCycle: subscriptions.billingCycle,
        startDate: subscriptions.startDate,
        endDate: subscriptions.endDate,
        trialEndDate: subscriptions.trialEndDate,
        usageLimit: subscriptions.usageLimit,
        notes: subscriptions.notes,
        createdAt: subscriptions.createdAt,
        updatedAt: subscriptions.updatedAt,
        client: {
          id: clients.id,
          name: clients.name,
          email: clients.email,
          phone: clients.phone,
          company: clients.company,
        },
      })
      .from(subscriptions)
      .leftJoin(clients, eq(subscriptions.clientId, clients.id))
      .where(eq(subscriptions.id, id))
      .limit(1);

    if (!result.length) {
      throw new NotFoundException('Subscription not found');
    }

    return result[0];
  }

  async create(data: CreateSubscriptionRequest) {
    const validated = createSubscriptionSchema.parse(data);
    const db = getDatabase();

    const startDate =
      typeof validated.startDate === 'string'
        ? new Date(validated.startDate)
        : validated.startDate;
    const endDate =
      validated.endDate && typeof validated.endDate === 'string'
        ? new Date(validated.endDate)
        : validated.endDate || null;
    const trialEndDate =
      validated.trialEndDate && typeof validated.trialEndDate === 'string'
        ? new Date(validated.trialEndDate)
        : validated.trialEndDate || null;

    const result = await db.insert(subscriptions).values({
      clientId: validated.clientId,
      type: validated.type,
      amount: validated.amount.toString(),
      currency: validated.currency,
      status: trialEndDate ? 'trial' : 'active',
      billingCycle: validated.billingCycle || null,
      startDate,
      endDate,
      trialEndDate,
      usageLimit: validated.usageLimit || null,
      notes: validated.notes || null,
    });

    return this.findOne(result[0].insertId);
  }

  async update(id: number, data: Partial<CreateSubscriptionRequest>) {
    const db = getDatabase();

    const updateData: any = { ...data };

    if (data.startDate && typeof data.startDate === 'string') {
      updateData.startDate = new Date(data.startDate);
    }
    if (data.endDate && typeof data.endDate === 'string') {
      updateData.endDate = new Date(data.endDate);
    }
    if (data.trialEndDate && typeof data.trialEndDate === 'string') {
      updateData.trialEndDate = new Date(data.trialEndDate);
    }

    if (updateData.amount) {
      updateData.amount = updateData.amount.toString();
    }

    await db.update(subscriptions).set(updateData).where(eq(subscriptions.id, id));

    return this.findOne(id);
  }

  async delete(id: number) {
    const db = getDatabase();
    const result = await db.delete(subscriptions).where(eq(subscriptions.id, id));

    if (!result.affectedRows) {
      throw new NotFoundException('Subscription not found');
    }
  }
}
