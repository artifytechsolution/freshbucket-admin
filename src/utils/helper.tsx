import { environment } from "@/config/config";

export const ROLES = {
  admin: "ADMIN",
  customer: "CUSTOMER",
} as const;

export type RoleType = keyof typeof ROLES;

export const isDevEnv: boolean = environment === "development";
