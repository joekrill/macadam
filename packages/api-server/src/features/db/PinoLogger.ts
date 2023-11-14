import {
  Highlighter,
  LogContext,
  Logger,
  LoggerNamespace,
  LoggerOptions,
} from "@mikro-orm/core";
import pino from "pino";

export type PinoLoggerOptions = LoggerOptions & {
  logger: pino.Logger;
};

export class PinoLogger implements Logger {
  static InfoNamespaces: LoggerNamespace[] = ["info", "schema"];
  private readonly logger;
  private readonly highlighter?: Highlighter;
  debugMode: boolean | LoggerNamespace[];

  constructor({ logger, ...options }: PinoLoggerOptions) {
    this.debugMode = options.debugMode ?? false;
    this.logger = logger;
    this.highlighter = options.highlighter;
  }

  setDebugMode(debugMode: boolean | LoggerNamespace[]): void {
    this.debugMode = debugMode;
  }

  isEnabled(namespace: LoggerNamespace, context?: LogContext): boolean {
    return (
      !!this.debugMode &&
      (!Array.isArray(this.debugMode) || this.debugMode.includes(namespace))
    );
  }

  log(namespace: LoggerNamespace, message: string, context?: LogContext) {
    if (!this.isEnabled(namespace)) {
      return;
    }

    const level = PinoLogger.InfoNamespaces.includes(namespace)
      ? "info"
      : "debug";
    this.logger[level]({ ...context, namespace }, message);
  }

  logQuery(context: { query: string } & LogContext): void {
    this.logger.debug(
      context,
      this.highlighter?.highlight(context.query) ?? context.query,
    );
  }

  error(
    namespace: LoggerNamespace,
    message: string,
    context?: LogContext | undefined,
  ): void {
    this.logger.error({ namespace, ...context }, message);
  }

  warn(
    namespace: LoggerNamespace,
    message: string,
    context?: LogContext | undefined,
  ): void {
    this.logger.warn({ namespace, ...context }, message);
  }
}
