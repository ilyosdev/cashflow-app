import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('telegram')
export class TelegramController {
  constructor(private telegramService: TelegramService) {}

  @Post('webhook')
  async webhook(@Body() update: any) {
    if (update.message) {
      const { chat, text, from } = update.message;
      const chatId = chat.id.toString();
      const username = from.username;

      switch (text) {
        case '/start':
          await this.telegramService.sendMessage(
            chatId,
            `✅ <b>Welcome!</b>\n\n` +
              `Hello ${username}!\n` +
              `To connect this Telegram account to your Subscriptions App, please:\n\n` +
              `1. Login to the web app\n` +
              `2. Go to Settings > Telegram\n` +
              `3. Enter your username: @${username}\n\n` +
              `Use /help to see available commands.`,
          );
          break;

        case '/help':
          await this.telegramService.sendMessage(
            chatId,
            `<b>Available Commands:</b>\n\n` +
              `/start - Start the bot and get connection instructions\n` +
              `/help - Show this help message\n\n` +
              `Once connected, you'll receive notifications for:\n` +
              `⚠️ Overdue payments\n` +
              `📋 Subscription renewals\n` +
              `💳 Expense due dates\n` +
              `📊 Daily summaries (if enabled)`,
          );
          break;

        default:
          await this.telegramService.sendMessage(
            chatId,
            'Unknown command. Use /help to see available commands.',
          );
      }
    }

    return { ok: true };
  }

  @Get('connect')
  @UseGuards(JwtAuthGuard)
  async getConnectInstructions() {
    const botInfo = await this.telegramService.getBotInfo();
    return {
      botUsername: botInfo?.username,
      instructions: 'Send /start to @' + botInfo?.username + ' on Telegram',
    };
  }
}
