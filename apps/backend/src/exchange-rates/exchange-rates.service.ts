import { Injectable, NotFoundException } from '@nestjs/common';
import { eq, desc, and } from 'drizzle-orm';
import { getDatabase, exchangeRates } from '../database';
import { createExchangeRateSchema } from '@subscriptions/shared';
import type { CreateExchangeRateRequest } from '@subscriptions/shared';

@Injectable()
export class ExchangeRatesService {
  async findAll() {
    const db = getDatabase();
    return await db
      .select()
      .from(exchangeRates)
      .orderBy(desc(exchangeRates.effectiveDate));
  }

  async findOne(id: number) {
    const db = getDatabase();
    const result = await db.select().from(exchangeRates).where(eq(exchangeRates.id, id)).limit(1);

    if (!result.length) {
      throw new NotFoundException('Exchange rate not found');
    }

    return result[0];
  }

  async getLatestRate(fromCurrency: string, toCurrency: string) {
    const db = getDatabase();
    const result = await db
      .select()
      .from(exchangeRates)
      .where(and(
        eq(exchangeRates.fromCurrency, fromCurrency as any),
        eq(exchangeRates.toCurrency, toCurrency as any),
      ))
      .orderBy(desc(exchangeRates.effectiveDate))
      .limit(1);

    if (!result.length) {
      return null;
    }

    return result[0];
  }

  async create(data: CreateExchangeRateRequest) {
    const validated = createExchangeRateSchema.parse(data);
    const db = getDatabase();

    const effectiveDate =
      typeof validated.effectiveDate === 'string'
        ? new Date(validated.effectiveDate)
        : validated.effectiveDate;

    const result = await db.insert(exchangeRates).values({
      fromCurrency: validated.fromCurrency as any,
      toCurrency: validated.toCurrency as any,
      rate: validated.rate.toString(),
      effectiveDate,
    });

    return this.findOne(Number(result[0].insertId));
  }

  async update(id: number, data: Partial<CreateExchangeRateRequest>) {
    const db = getDatabase();

    const updateData: any = { ...data };

    if (data.effectiveDate && typeof data.effectiveDate === 'string') {
      updateData.effectiveDate = new Date(data.effectiveDate);
    }

    if (updateData.rate) {
      updateData.rate = updateData.rate.toString();
    }

    await db.update(exchangeRates).set(updateData).where(eq(exchangeRates.id, id));

    return this.findOne(id);
  }

  async delete(id: number) {
    const db = getDatabase();
    const result = await db.delete(exchangeRates).where(eq(exchangeRates.id, id));

    if (result.rowsAffected === 0) {
      throw new NotFoundException('Exchange rate not found');
    }
  }
}
