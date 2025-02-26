import "next-auth";

declare module "next-auth" {
  interface Session {
    token: string;
    user: UserAuth
  }
}