import { z } from "zod";
import { provinces } from "./provinces";

const phone = z
  .string()
  .trim()
  .min(8)
  .max(25)
  .refine((value) => (value.match(/\d/g) || []).length >= 8, "phone");

export const driverSchema = z
  .object({
    firstName: z.string().trim().min(2).max(60),
    lastName: z.string().trim().min(2).max(60),
    phone,
    whatsapp: z.string().trim().max(25).optional().or(z.literal("")),
    email: z.email().max(160),
    city: z.string().trim().min(2).max(80),
    province: z.string().refine((value) => provinces.includes(value as (typeof provinces)[number])),
    vehicleType: z.enum(["car", "motorcycle"]),
    vehicleMake: z.string().trim().min(2).max(40),
    vehicleModel: z.string().trim().min(1).max(40),
    vehicleYear: z.coerce.number().int().min(1980).max(new Date().getFullYear() + 1),
    licenseNumber: z.string().trim().min(4).max(40),
    licenseExpiry: z.string().trim().max(20).optional().or(z.literal("")),
    meetsRequirements: z.enum(["on", "true"]),
    privacyConsent: z.enum(["on", "true"]),
  })
  .superRefine((value, ctx) => {
    if (value.whatsapp && (value.whatsapp.match(/\d/g) || []).length < 8) {
      ctx.addIssue({ code: "custom", path: ["whatsapp"], message: "phone" });
    }
  });

export const contactCategories = [
  "passenger_support",
  "driver_support",
  "driver_registration",
  "partnerships",
  "general",
  "report_problem",
  "data_deletion",
] as const;

export const contactSchema = z.object({
  fullName: z.string().trim().min(3).max(120),
  email: z.email().max(160),
  phone: z.string().trim().max(25).optional().or(z.literal("")),
  category: z.enum(contactCategories),
  message: z.string().trim().min(10).max(4000),
});

export const newsletterSchema = z.object({
  name: z.string().trim().max(80).optional().or(z.literal("")),
  email: z.email().max(160),
  city: z.string().trim().max(80).optional().or(z.literal("")),
  whatsapp: phone,
  interest: z.enum(["ride", "drive", "both"]),
  consent: z.enum(["on", "true"]),
});

export const applicationStatuses = ["pending", "under_review", "approved", "rejected", "more_info"] as const;
export const inquiryStatuses = ["open", "pending", "resolved"] as const;
export const roles = ["owner", "admin", "support"] as const;
export type Role = (typeof roles)[number];
