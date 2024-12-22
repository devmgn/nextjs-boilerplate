import pino from "pino";

export const logger = pino({
  level: "info",
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    },
  },
  browser: {
    asObject: true,
    write: {
      critical: (o) => console.error(JSON.stringify(o)),
      // biome-ignore lint/suspicious/noConsole: <explanation>
      debug: (o) => console.log(JSON.stringify(o)),
      error: (o) => console.error(JSON.stringify(o)),
      fatal: (o) => console.error(JSON.stringify(o)),
      // biome-ignore lint/suspicious/noConsole: <explanation>
      info: (o) => console.log(JSON.stringify(o)),
      // biome-ignore lint/suspicious/noConsole: <explanation>
      trace: (o) => console.log(JSON.stringify(o)),
      warn: (o) => console.warn(JSON.stringify(o)),
    },
  },
  // NOTE: This is a placeholder for redacting sensitive information
  redact: [],
});
