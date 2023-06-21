export const logError = (error: unknown) => {
  const entry = {
    severity: "ERROR",
    message: error instanceof Error ? error.stack : error,
  };
  const entryString = JSON.stringify(entry);
  console.log(entryString);
};
