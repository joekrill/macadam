import Router from "@koa/router";
import { ensure as ensureError } from "errorish";
import { DefaultState } from "koa";
import { ability } from "../../../features/auth/ability";
import {
  ContactUsMessage,
  ContactUsMessageStatus,
} from "../../../features/db/entities/ContactUsMessage";
import { contactUsCreateSchema } from "./contactUsSchemas";

export const contactUsRouter = new Router<DefaultState>();

contactUsRouter.use(ability()).post("/", async (ctx) => {
  const { ability, entityManager } = ctx.state;
  const session = await ctx.state.session();
  ability!.ensureCan("create", "ContactUsMessage");

  const data = contactUsCreateSchema.parse(ctx.request.body);
  const contactUsMessage = new ContactUsMessage(
    data.name,
    data.email,
    data.message,
    ctx.ip,
    ctx.get("user-agent"),
    session?.identity.id,
  );

  if (ctx.mailer) {
    contactUsMessage.lastStatusAt = new Date();
    try {
      await ctx.mailer.transporter.sendMail({
        from: {
          name: data.name,
          address: data.email,
        },
        to: ctx.mailer.defaultMailTo,
        subject: `Contact Us message from ${data.name} (${data.email})`,
        text: data.message,
      });
      contactUsMessage.status = ContactUsMessageStatus.SENT;
    } catch (error) {
      contactUsMessage.error =
        typeof error === "string" ? error : ensureError(error).message;
      contactUsMessage.status = ContactUsMessageStatus.ERROR;
    }
  }

  await entityManager!.persistAndFlush([contactUsMessage]);

  ctx.body = {};
  ctx.status = 201;
});
