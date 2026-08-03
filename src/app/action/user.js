'use server';

import { db } from '@/db';
import { Users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import {
  ensureDefaultCategoriesForUser,
  ensureDemoExpensesForUser,
} from '@/db/queries';
import { DEMO_CREDENTIALS } from '@/lib/demoConfig';

export async function ensureUser(email) {
  if (!email) return null;

  const existingUser = await db.query.Users.findFirst({
    where: (users, { eq }) => eq(users.email, email),
  });

  if (!existingUser) {
    const [newUser] = await db
      .insert(Users)
      .values({
        email,
      })
      .returning();

    await ensureDefaultCategoriesForUser(newUser.id);
    await ensureDemoExpensesForUser(newUser.id, email);

    return newUser;
  }

  await ensureDefaultCategoriesForUser(existingUser.id);
  await ensureDemoExpensesForUser(existingUser.id, email);

  return existingUser;
}

// update user preference for receiving reports
export async function updateReceiveReport(userId, receiveReport) {
  if (!userId) return;

  const updatedUser = await db
    .update(Users)
    .set({ receiveReport })
    .where(eq(Users.id, userId))
    .returning();

  return updatedUser;
}
