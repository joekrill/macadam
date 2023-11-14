import Koa from "koa";
import { createTransport, Transporter } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { redactUrl } from "../logging/redactUrl.js";

export interface MailerContext {
  mailer?: {
    transporter: Transporter<SMTPTransport.SentMessageInfo>;
    defaultMailTo: string;
  };
}

export interface InitializeMailerOptions {
  smtpUri: string;
  smtpMailTo: string;
}

/**
 * Adds an email transport to the application context.
 */
export const initializeMailer = (
  app: Koa,
  options: InitializeMailerOptions,
) => {
  const logger = app.context.logger.child({ module: "mailer" });
  const transporter = createTransport({
    url: options.smtpUri,
  });

  app.context.mailer = {
    defaultMailTo: options.smtpMailTo,
    transporter,
  };

  logger.info(
    { ...options, smtpUri: redactUrl(options.smtpUri) },
    "Mailer initialized",
  );
};
