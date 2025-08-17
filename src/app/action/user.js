'use server';

import { db } from '@/db';
import { Users } from '@/db/schema';
import { eq } from 'drizzle-orm';

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

    return newUser;
  }

  return existingUser;
}
