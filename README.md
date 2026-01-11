# Subscriptions - Payment & Expense Tracker

A full-featured monorepo application for tracking client subscriptions, payments, and company expenses with multi-currency support and Telegram notifications.

## Features

- **Client Management**: Add, edit, and manage clients
- **Subscription Types**: Recurring, one-time, usage-based, and trial subscriptions
- **Payment Tracking**: Manual payment entry with status tracking
- **Expense Tracking**: Software company expenses (vendors, contractors, infrastructure, etc.)
- **Multi-Currency Support**: USD and UZS with exchange rate management
- **Telegram Notifications**: Alerts for overdue payments, renewals, and expense due dates
- **Dashboard**: Key metrics (MRR, expenses, profit, active subscriptions)
- **Reports**: Revenue, expense, and cash flow reports

## Tech Stack

- **Backend**: NestJS, Drizzle ORM, MySQL, JWT auth
- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Monorepo**: pnpm Workspaces
- **Notifications**: Telegram Bot API

## Quick Start with Docker

The easiest way to run the application:

```bash
# 1. Copy environment file
cp .env.example .env

# 2. Edit .env with your settings (especially JWT_SECRET and TELEGRAM_BOT_TOKEN)

# 3. Start everything
docker-compose up -d

# 4. Access the app
# Frontend: http://localhost:5173
# Backend API: http://localhost:3001
# Login: admin / admin123
```

**What happens automatically:**

- ✅ MySQL database created
- ✅ Database migrations run
- ✅ Admin user seeded
- ✅ Backend and frontend started

## Getting Started (Manual)

### Prerequisites

- Node.js 18+
- MySQL 8.0+
- pnpm (installed with `npm install -g pnpm`)

### Installation

1. Install dependencies:

```bash
pnpm install
```

2. Set up environment variables:

```bash
cp apps/backend/.env.example apps/backend/.env
```

Edit `apps/backend/.env`:

```env
DATABASE_URL=mysql://root:password@localhost:3306/subscriptions
JWT_SECRET=your-secret-key-here
TELEGRAM_BOT_TOKEN=your-bot-token-from-botfather
FRONTEND_URL=http://localhost:5173
```

3. Create MySQL database:

```sql
CREATE DATABASE subscriptions;
```

4. Run database migrations:

```bash
cd apps/backend
pnpm db:generate
pnpm db:migrate
```

5. Seed admin user:

```bash
npx ts-node seed.ts
```

Default credentials:

- Username: `admin`
- Password: `admin123`

6. Start development servers:

Terminal 1 - Backend:

```bash
pnpm dev:backend
```

Terminal 2 - Frontend:

```bash
pnpm dev:frontend
```

7. Access the application:

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## Project Structure

```
subscriptions/
├── apps/
│   ├── backend/          # NestJS API
│   │   ├── src/
│   │   │   ├── auth/           # JWT authentication
│   │   │   ├── clients/         # Client management
│   │   │   ├── subscriptions/   # Subscription CRUD
│   │   │   ├── payments/        # Payment tracking
│   │   │   ├── expenses/        # Expense management
│   │   │   ├── exchange-rates/  # Currency exchange rates
│   │   │   ├── dashboard/       # Metrics & stats
│   │   │   ├── reports/         # Financial reports
│   │   │   ├── telegram/        # Bot integration
│   │   │   ├── notifications/    # Scheduled notifications
│   │   │   └── database/        # Drizzle schema & connection
│   │   └── drizzle.config.ts
│   └── frontend/        # React application
│       └── src/
│           ├── components/     # Reusable UI components
│           ├── pages/         # Page components
│           ├── contexts/       # Auth context
│           ├── services/      # API client
│           └── lib/           # Utilities
└── packages/
    └── shared/          # Shared types & utilities
        ├── src/
        │   ├── types/     # TypeScript interfaces
        │   ├── enums/     # Enum definitions
        │   ├── utils/     # Helper functions
        │   └── constants/ # App constants
```

## API Endpoints

### Authentication

- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Clients

- `GET /api/clients` - List clients
- `GET /api/clients/:id` - Get client
- `POST /api/clients` - Create client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

### Subscriptions

- `GET /api/subscriptions` - List subscriptions
- `GET /api/subscriptions/:id` - Get subscription
- `POST /api/subscriptions` - Create subscription
- `PUT /api/subscriptions/:id` - Update subscription
- `DELETE /api/subscriptions/:id` - Delete subscription

### Payments

- `GET /api/payments` - List payments
- `GET /api/payments/:id` - Get payment
- `POST /api/payments` - Create payment
- `PUT /api/payments/:id` - Update payment
- `DELETE /api/payments/:id` - Delete payment

### Expenses

- `GET /api/expenses` - List expenses
- `GET /api/expenses/:id` - Get expense
- `POST /api/expenses` - Create expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense

### Exchange Rates

- `GET /api/exchange-rates` - List rates
- `POST /api/exchange-rates` - Create rate
- `PUT /api/exchange-rates/:id` - Update rate
- `DELETE /api/exchange-rates/:id` - Delete rate

### Dashboard & Reports

- `GET /api/dashboard/metrics` - Get dashboard metrics
- `GET /api/reports/revenue` - Revenue report
- `GET /api/reports/expenses` - Expense report
- `GET /api/reports/cash-flow` - Cash flow report

### Telegram

- `POST /api/telegram/webhook` - Telegram webhook endpoint
- `GET /api/telegram/connect` - Get connection instructions

## Telegram Bot Setup

1. Create a bot via [@BotFather](https://t.me/botfather) on Telegram
2. Copy the bot token
3. Add `TELEGRAM_BOT_TOKEN=your-token` to `.env`
4. Start the backend
5. Send `/start` to your bot on Telegram
6. In the app settings, enter your Telegram username to connect

## Notification Schedule

- **Daily at 9 AM**: Overdue payments, subscription renewals, expense due alerts, daily summary

## Building for Production

```bash
# Build all
pnpm build

# Build backend only
pnpm build:backend

# Build frontend only
pnpm build:frontend
```

## Railway Deployment

See [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md) for complete deployment instructions.

The application is designed for Railway deployment with:

- MySQL database service
- NestJS backend service
- Static frontend deployment
- Telegram webhook configuration

Quick summary:

1. Push repository to GitHub
2. Deploy MySQL database to Railway
3. Deploy backend with environment variables
4. Deploy frontend with API URL
5. Run database migrations and seed
6. Connect Telegram webhook
7. Change default admin password

## License

MIT
