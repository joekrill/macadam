import { z } from "zod";
import { identitySchema } from "./identity";

export const sessionSchema = z.object({
  /**
   * Whether or not the session is active.
   */
  active: z.boolean().nullish(),

  /**
   * The Session Authentication Timestamp  When this session was authenticated at.
   */
  authenticated_at: z.string().nullish(),

  /**
   * The Session Expiry  When this session expires at.
   */
  expires_at: z.string().nullish(),

  id: z.string(),

  identity: identitySchema,

  /**
   * The Session Issuance Timestamp  When this session was authenticated at.
   */
  issued_at: z.string().nullish(),
});

export type Session = z.infer<typeof sessionSchema>;
