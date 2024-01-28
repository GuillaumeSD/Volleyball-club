export const logError = (error: unknown, context?: Record<string, unknown>) => {
  const entry = {
    severity: "ERROR",
    message: error instanceof Error ? error.stack : error,
    ...context,
  };
  const entryString = JSON.stringify(entry);
  console.log(entryString);
};

export const logCatchedError =
  (context?: Record<string, unknown>) => (error: unknown) => {
    logError(error, context);
    throw error;
  };
