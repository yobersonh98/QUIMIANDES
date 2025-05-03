import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
export const NextAuhtOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "email", placeholder: "test@test.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth`,
          {
            method: "POST",
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
            headers: { "Content-Type": "application/json" },
          }
        );
        const user = await res.json();
        if (!res.ok) {
          throw new Error(user.error || "Credenciales incorrectas");
        }
        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user}) {
      if (user) {
          token = { ...token, ...user };
      }
      return token;
  },
  async session({ session, token }) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    session.user = token as any;
    return session;
},
  },
  pages: {
    signIn: "/login",
  },
  session: {
    maxAge: 24 * 60 * 8,
  }
};

export default NextAuhtOptions;
