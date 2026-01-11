import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { getDatabase, users } from '../database';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(username: string, password: string) {
    const db = getDatabase();
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);

    if (!result.length) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const user = result[0];
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      id: user.id,
      username: user.username,
      telegramChatId: user.telegramChatId,
    };
  }

  async login(username: string, password: string) {
    const user = await this.validateUser(username, password);

    const payload = {
      sub: user.id,
      username: user.username,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user,
    };
  }

  async me(userId: number) {
    const db = getDatabase();
    const result = await db.select().from(users).where(eq(users.id, userId)).limit(1);

    if (!result.length) {
      throw new UnauthorizedException('User not found');
    }

    const user = result[0];
    return {
      id: user.id,
      username: user.username,
      telegramChatId: user.telegramChatId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
