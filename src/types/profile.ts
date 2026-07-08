import type { AppRole } from "@/types/auth";

export type ProfileDetail = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone: string;
  location: string;
  bio: string;
  role: AppRole | null;
  isArchived: boolean;
  verified: boolean;
};

export type ProfileActivity = {
  posted: number;
  pending: number;
  approved: number;
};

export type UpdateProfileInput = {
  firstName: string;
  lastName: string;
  phone: string;
  location: string;
  bio: string;
};

export type ChangePasswordInput = {
  email: string;
  currentPassword: string;
  newPassword: string;
};
