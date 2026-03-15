export enum UserRole {
  CUSTOMER = "CUSTOMER",
  STAFF = "STAFF",
  ADMIN = "ADMIN",
}

export enum UserTier {
  STANDARD = "STANDARD",
  VIP = "VIP",
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string | null;
  phone: string | null;
  tier: UserTier | null;
  createdAt: Date;
  updatedAt: Date;
}

export type UserPublic = Omit<User, "passwordHash">;
