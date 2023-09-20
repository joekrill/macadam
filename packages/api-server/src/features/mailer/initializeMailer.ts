import Koa from "koa";
import { createTransport, Transporter } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

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
  { smtpUri, smtpMailTo: defaultMailTo }: InitializeMailerOptions,
) => {
  const transporter = createTransport({
    url: smtpUri,
  });
  app.context.mailer = {
    defaultMailTo,
    transporter,
  };
};
