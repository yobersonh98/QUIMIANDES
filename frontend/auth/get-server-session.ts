import { getServerSession } from "next-auth";
import nextAuthOptions from "./next-auth-options";
import { redirect } from "next/navigation";

export const GetServerSession = async (): Promise<UserAuth> => {
  const session = await getServerSession(nextAuthOptions);
  if (!session) {
    redirect("/auth/login");
  }
  return session.user as UserAuth;
};
