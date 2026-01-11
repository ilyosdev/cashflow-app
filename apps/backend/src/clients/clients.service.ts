import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { eq, like } from 'drizzle-orm';
import { getDatabase, clients } from '../database';
import { createClientSchema, updateClientSchema } from '@subscriptions/shared';
import type { CreateClientRequest, UpdateClientRequest } from '@subscriptions/shared';

@Injectable()
export class ClientsService {
  async findAll(search?: string) {
    const db = getDatabase();
    let query = db.select().from(clients);

    if (search) {
      query = query.where(
        like(clients.name, `%${search}%`),
      ) as typeof query;
    }

    return await query.orderBy(clients.createdAt);
  }

  async findOne(id: number) {
    const db = getDatabase();
    const result = await db.select().from(clients).where(eq(clients.id, id)).limit(1);

    if (!result.length) {
      throw new NotFoundException('Client not found');
    }

    return result[0];
  }

  async create(data: CreateClientRequest) {
    const validated = createClientSchema.parse(data);
    const db = getDatabase();

    const result = await db.insert(clients).values({
      name: validated.name,
      email: validated.email || null,
      phone: validated.phone || null,
      company: validated.company || null,
      notes: validated.notes || null,
    });

    return this.findOne(Number(result[0].insertId));
  }

  async update(id: number, data: UpdateClientRequest) {
    const validated = updateClientSchema.parse(data);
    const db = getDatabase();

    await db.update(clients).set({
      name: validated.name,
      email: validated.email || null,
      phone: validated.phone || null,
      company: validated.company || null,
      notes: validated.notes || null,
    }).where(eq(clients.id, id));

    return this.findOne(id);
  }

  async delete(id: number) {
    const db = getDatabase();
    const result = await db.delete(clients).where(eq(clients.id, id));

    if (result.rowsAffected === 0) {
      throw new NotFoundException('Client not found');
    }
  }
}
