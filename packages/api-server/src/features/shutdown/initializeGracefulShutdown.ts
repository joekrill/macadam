import Koa from "koa";

export type ShutdownListener = (
  exitCode?: number,
  waitMs?: number,
) => void | Promise<void>;

export type AddShutdownListener = (listener: ShutdownListener) => void;

export interface ShutdownContext {
  addShutdownListener: AddShutdownListener;

  /**
   * Set to true when the app starts shutting down and no further requests
   * should be handled.
   */
  isTerminating: boolean;

  /**
   * Gracefully shuts down the application, closing any open connections, etc,
   * and calling `process.exit` on completion if an `exitCode` was provided.
   * @param exitCode
   * @param waitMs
   */
  shutdown: (exitCode?: number, waitMs?: number) => Promise<void>;
}

export interface InitializeGracefulShutdownOptions {
  /**
   * When `shutdown()` is called, this is the maximum amount of time to give
   * to the shutdown listeners before forcefully ending the process.
   *
   * This can also be overriden at the time that shutdown is called.
   */
  defaultShutdownWaitMs?: number;
}

/**
 * Adds graceful shutdown functionality to the Koa app, allowing for cleanup,
 * when possible, if we are shutting down.
 *
 * Other components can use `app.context.addShutdownListener` to add a callback
 * that will be called when the application is shutting down and allow
 * for closing database connection, cleaning up, etc.
 */
export const initializeGracefulShutdown = (
  app: Koa,
  { defaultShutdownWaitMs = 15000 }: InitializeGracefulShutdownOptions,
) => {
  let isTerminating = false;

  // This will be used to keep track of the signal listeners we add,
  // so that we can remove them when we have finished our shutdown.
  const processListeners: Record<string, NodeJS.SignalsListener> = {};

  const shutdown = async (
    exitCode?: number,
    waitMs: number = defaultShutdownWaitMs,
  ) => {
    const { logger } = app.context;
    let shutdownTimeout: NodeJS.Timeout | number | undefined = undefined;
    isTerminating = true;
    const listeners = app.listeners("shutdown") as ShutdownListener[];
    app.removeAllListeners("shutdown");

    try {
      logger.info(
        { exitCode, waitMs, listenerCount: listeners.length },
        `Preparing shutdown, notifying ${listeners.length} listeners`,
      );
      await Promise.race([
        // Ideally let any processes cleanup and shutdown.
        Promise.all(
          listeners.map((listener: ShutdownListener) =>
            listener(exitCode, waitMs),
          ),
        ),

        // This provides a maximum wait time for the above -- after `maxWait`
        // this will resolve and win the `Promise.race`.
        new Promise<void>((resolve) => {
          shutdownTimeout = setTimeout(() => {
            logger.warn(`Forcing shutdown after waiting ${waitMs}ms`);
            resolve();
          }, waitMs);
        }),
      ]);
    } finally {
      clearTimeout(shutdownTimeout);
      logger.info({ exitCode }, "Shutting down");

      // Remove all listeneres... this is really only necessary if the process
      // itself is not being shutdown.
      process.off("exit", shutdown);

      Object.entries(processListeners).forEach(([signal, listener]) => {
        process.off(signal, listener);
      });

      if (exitCode !== undefined) {
        process.exit(exitCode);
      }
    }
  };

  // Intercept shutdowns so we can allow any listeners to cleanup,
  // but maintain exit codes.
  processListeners.exit = () => shutdown();
  processListeners.SIGHUP = () => shutdown(128 + 1);
  processListeners.SIGINT = () => shutdown(128 + 2);
  processListeners.SIGQUIT = () => shutdown(128 + 3);
  processListeners.SIGTERM = () => shutdown(128 + 15);
  processListeners.SIGBREAK = () => shutdown(128 + 21); // Windows only

  Object.entries(processListeners).forEach(([signal, listener]) => {
    process.on(signal, listener);
  });

  const addShutdownListener = (listener: ShutdownListener) => {
    app.on("shutdown", listener);
  };

  Object.defineProperties(app.context, {
    isTerminating: {
      get() {
        return isTerminating;
      },
      enumerable: true,

      // Allow setting the `isTerminating` value when mocking tests.
      set:
        process.env.NODE_ENV === "test"
          ? function (value) {
              isTerminating = value;
            }
          : undefined,
    },
    shutdown: {
      value: shutdown,
    },
    addShutdownListener: {
      value: addShutdownListener,
    },
  });
};
