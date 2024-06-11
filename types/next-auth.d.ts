import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      sessionId: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: number;
    sessionId?: string;
  }
  interface JWT {
    id?: number;
    sessionId?: string;
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    id?: number;
    sessionId?: string;
  }
}
