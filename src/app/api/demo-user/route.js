import { NextResponse } from 'next/server';
import { createClerkClient } from '@clerk/backend';
import { DEMO_CREDENTIALS } from '@/lib/demoConfig';

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

async function ensureDemoUser() {
  const existingUsers = await clerkClient.users.getUserList({
    emailAddress: [DEMO_CREDENTIALS.email],
    limit: 1,
  });

  if (existingUsers.data.length > 0) {
    const existingUser = existingUsers.data[0];

    await clerkClient.users.updateUser(existingUser.id, {
      password: DEMO_CREDENTIALS.password,
      skipPasswordChecks: true,
      skipLegalChecks: true,
      username: DEMO_CREDENTIALS.username,
      publicMetadata: {
        isDemo: true,
      },
    });

    return existingUser;
  }

  return clerkClient.users.createUser({
    emailAddress: [DEMO_CREDENTIALS.email],
    username: DEMO_CREDENTIALS.username,
    password: DEMO_CREDENTIALS.password,
    firstName: 'Demo',
    lastName: 'User',
    skipPasswordChecks: true,
    skipLegalChecks: true,
    publicMetadata: {
      isDemo: true,
    },
  });
}

export async function POST() {
  try {
    const demoUser = await ensureDemoUser();

    return NextResponse.json({
      success: true,
      userId: demoUser.id,
    });
  } catch (error) {
    console.error('Error ensuring demo user:', error);
    return NextResponse.json(
      { success: false, error: 'Unable to prepare demo user.' },
      { status: 500 },
    );
  }
}
