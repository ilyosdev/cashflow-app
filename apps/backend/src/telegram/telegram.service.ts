import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class TelegramService {
  private bot: TelegramBot;

  constructor(private configService: ConfigService) {
    const token = this.configService.get('TELEGRAM_BOT_TOKEN');
    if (token) {
      this.bot = new TelegramBot(token, { polling: false });
    }
  }

  async sendMessage(chatId: string, message: string, options?: any) {
    if (!this.bot) return;

    try {
      await this.bot.sendMessage(chatId, message, {
        parse_mode: 'HTML',
        ...options,
      });
    } catch (error) {
      console.error('Failed to send Telegram message:', error);
    }
  }

  async sendOverduePaymentAlert(data: {
    chatId: string;
    client: string;
    subscription: string;
    amount: string;
    overdueDays: number;
  }) {
    const message = `⚠️ <b>Overdue Payment Alert!</b>\n\n` +
      `Client: ${data.client}\n` +
      `Subscription: ${data.subscription}\n` +
      `Amount Due: ${data.amount}\n` +
      `Overdue by: ${data.overdueDays} days`;

    await this.sendMessage(data.chatId, message);
  }

  async sendSubscriptionRenewalReminder(data: {
    chatId: string;
    client: string;
    plan: string;
    amount: string;
    renewalDate: string;
    daysLeft: number;
  }) {
    const message = `📋 <b>Subscription Renewing Soon!</b>\n\n` +
      `Client: ${data.client}\n` +
      `Plan: ${data.plan}\n` +
      `Amount: ${data.amount}\n` +
      `Renewal Date: ${data.renewalDate} (${data.daysLeft} days)`;

    await this.sendMessage(data.chatId, message);
  }

  async sendExpenseDueAlert(data: {
    chatId: string;
    type: string;
    description: string;
    amount: string;
    dueDate: string;
  }) {
    const message = `💳 <b>Expense Payment Due</b>\n\n` +
      `Type: ${data.type}\n` +
      `Description: ${data.description}\n` +
      `Amount: ${data.amount}\n` +
      `Due Date: ${data.dueDate}`;

    await this.sendMessage(data.chatId, message);
  }

  async sendDailySummary(data: {
    chatId: string;
    paymentsReceived: string;
    expenses: string;
    net: string;
    date: string;
  }) {
    const message = `📊 <b>Daily Summary</b>\n\n` +
      `Date: ${data.date}\n` +
      `✅ Payments Received: ${data.paymentsReceived}\n` +
      `💸 Expenses: ${data.expenses}\n` +
      `📈 Net: ${data.net}`;

    await this.sendMessage(data.chatId, message);
  }

  async setWebhook(webhookUrl: string) {
    if (!this.bot) return;

    try {
      await this.bot.setWebHook(webhookUrl);
      console.log('Telegram webhook set to:', webhookUrl);
    } catch (error) {
      console.error('Failed to set Telegram webhook:', error);
    }
  }

  async getBotInfo() {
    if (!this.bot) return null;

    try {
      return await this.bot.getMe();
    } catch (error) {
      console.error('Failed to get bot info:', error);
      return null;
    }
  }
}
