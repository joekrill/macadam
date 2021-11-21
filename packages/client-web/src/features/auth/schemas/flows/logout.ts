import { z } from "zod";

export const selfServiceLogoutUrlSchema = z.object({
  /**
   * LogoutToken can be used to perform logout using AJAX.
   */
  logout_token: z.string(),

  /**
   * LogoutURL can be opened in a browser to sign the user out.  format: uri
   */
  logout_url: z.string(),
});
