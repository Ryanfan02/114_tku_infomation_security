export type Role = "guest" | "user" | "admin";

export type AuthUser = {
  id: string;
  username: string;
  role: Role;
};
