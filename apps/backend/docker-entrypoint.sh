#!/bin/sh
set -e

echo "🚀 Starting CashFlow Backend..."

echo "⏳ Waiting for MySQL to be ready..."
sleep 5

echo "📦 Running database migrations..."
cd /app/apps/backend
npx drizzle-kit push:mysql || echo "⚠️ Migration failed or already applied"

echo "🌱 Seeding database (if needed)..."
npx ts-node seed.ts || echo "⚠️ Seed skipped (user may already exist)"

echo "✅ Starting application..."
exec "$@"
