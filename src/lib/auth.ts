import { PrismaClient } from "@prisma/client";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

const prisma = new PrismaClient();
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
});

export async function signInUser(
  email: string,
  password: string,
  headers: Headers
) {
  try {
    const result = await auth.api.signInEmail({
      body: {
        email: email,
        password: password,
      },
      headers: headers,
    });
    return result;
  } catch (error) {
    console.error("Sign-in error:", error);
    throw error;
  }
}

export async function signUpUser(
  email: string,
  password: string,
  headers: Headers,
  name?: string
) {
  try {
    const result = await auth.api.signUpEmail({
      body: {
        email: email,
        password: password,
        name: name || email.split("@")[0],
      },
      headers: headers,
    });
    return result;
  } catch (error) {
    console.error("Sign-up error:", error);
    throw error;
  }
}

export async function signUpUserWithGoogle(headers: Headers) {
  try {
    const result = await auth.api.signInSocial({
      body: {
        provider: "google",
        callbackURL: "http://localhost:4000/api/auth/callback/google",
      },
      headers: headers,
    });
    return result;
  } catch (error) {
    console.error("Google sign-up error:", error);
    throw error;
  }
}

export async function signUpUserWithGithub(headers: Headers) {
  try {
    const result = await auth.api.signInSocial({
      body: {
        provider: "github",
        callbackURL: "http://localhost:4000/api/auth/callback/github",
      },
      headers: headers,
    });
    return result;
  } catch (error) {
    console.error("GitHub sign-up error:", error);
    throw error;
  }
}