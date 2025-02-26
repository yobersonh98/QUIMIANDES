import NextAuhtOptions from "@/auth/next-auth-options";

import nextAuth from "next-auth/next";

const handler = nextAuth(NextAuhtOptions);

export { handler as GET, handler as POST };