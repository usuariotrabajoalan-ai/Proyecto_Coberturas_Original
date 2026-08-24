import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    role: string;
    document: string;
  }

  interface Session {
    user: User & {
      id: string;
      role: string;
      document: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    document: string;
  }
}
