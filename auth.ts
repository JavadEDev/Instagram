import NextAuth from "next-auth";
import { ZodError, z } from "zod";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";

import { authConfig } from "./auth.config";
import { comparePW } from "./utils/authTools";
import { getUserFromDb } from "./lib/action";
import { createSession } from "./lib/session";

import prisma from "@/db/prisma";

export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth,
} = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const parsedCredentials = z
            .object({
              email: z
                .string({ required_error: "Email is required" })
                .email("Invalid email"),
              password: z
                .string({ required_error: "Password is required" })
                .min(8, "Password must be more than 8 characters")
                .max(32, "Password must be less than 32 characters"),
            })
            .safeParse(credentials);

          if (!parsedCredentials.success) {
            throw new Error("Missing or invalid fields.");
          }
          const { email, password } = parsedCredentials.data;
          const user = await getUserFromDb(email);

          if (!user) {
            throw new Error("User dose not exists");
          }
          const passwordsMatch = await comparePW(password, user.password);

          if (!passwordsMatch) {
            throw new Error("Password dose not match");
          }
          const session = await createSession(user.id);

          return {
            id: user.id,
            username: user.username,
            email: user.email,
            password: user.password,
            bio: user.bio,
            sessionId: session.sessionId,
          };
        } catch (error: any) {
          if (error instanceof ZodError) {
            throw new Error(`ValidationError is: ${error.message}`);
          }
          throw new Error(error.message || "An unexpected error occurred.");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = Number(user.id);
        token.sessionId = user.sessionId;
      }

      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id as number;
        session.user.sessionId = token.sessionId as string;
      }

      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/signin",
  },
});
