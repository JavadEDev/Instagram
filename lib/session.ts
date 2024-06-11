import { Session } from "@prisma/client";

import prisma from "@/db/prisma";

const { v4: uuidv4 } = require("uuid");

export async function createSession(userId: number): Promise<Session> {
  const sessionId = uuidv4();
  const expiresAt = new Date();

  expiresAt.setHours(expiresAt.getHours() + 1); // Set session to expire in 1 hour

  return await prisma.session.create({
    data: {
      sessionId: sessionId,
      userId,
      expiresAt: expiresAt,
    },
  });
}

export async function getSession(sessionId: string): Promise<Session | null> {
  return await prisma.session.findUnique({
    where: { sessionId },
  });
}
