import * as bcrypt from 'bcrypt';
import { getDatabase, users, notificationSettings } from './src/database';

async function seed() {
  const db = getDatabase();
  console.log('🌱 Starting database seed...');

  const hashedPassword = await bcrypt.hash('admin123', 10);

  const existingUser = await db.select().from(users).limit(1);

  if (existingUser.length === 0) {
    const userResult = await db.insert(users).values({
      username: 'admin',
      passwordHash: hashedPassword,
    });

    const userId = Number(userResult[0].insertId);

    await db.insert(notificationSettings).values({
      userId,
      notifyOverduePayments: 1,
      notifyRenewals: 1,
      notifyExpenses: 1,
      dailySummary: 0,
      renewalReminderDays: 7,
    });

    console.log('✅ Admin user created');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('   Please change this password in production!');
  } else {
    console.log('ℹ️  Admin user already exists');
  }

  console.log('🌱 Seed completed!');
  process.exit(0);
}

seed().catch((error) => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});
