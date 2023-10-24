import { z } from "zod";

export const uuid = z.object({
  id: z.string().uuid(),
});

export const omitUuid = {
  id: true,
} as const;

export const timestamps = z.object({
  createdAt: z.string(),
  updatedAt: z.string(),
  deletedAt: z.string().nullish(),
});

export const omitTimestamps = {
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
} as const;

export const changedBy = z.object({
  createdBy: z.string(),
  updatedBy: z.string(),
});

export const omitChangedBy = {
  createdBy: true,
  updatedBy: true,
} as const;
