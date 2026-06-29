type LogLevel = "info" | "warn" | "error" | "debug";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: Record<string, unknown>;
  error?: string;
  stack?: string;
}

function write(entry: LogEntry) {
  const line = JSON.stringify(entry);
  if (entry.level === "error") console.error(line);
  else if (entry.level === "warn") console.warn(line);
  else console.log(line);
}

export const logger = {
  info(message: string, data?: Record<string, unknown>) {
    write({ timestamp: new Date().toISOString(), level: "info", message, data });
  },
  warn(message: string, data?: Record<string, unknown>) {
    write({ timestamp: new Date().toISOString(), level: "warn", message, data });
  },
  error(message: string, err?: unknown, data?: Record<string, unknown>) {
    write({
      timestamp: new Date().toISOString(),
      level: "error",
      message,
      error: err instanceof Error ? err.message : String(err ?? ""),
      stack: err instanceof Error ? err.stack : undefined,
      data,
    });
  },
  debug(message: string, data?: Record<string, unknown>) {
    if (process.env.NODE_ENV === "development") {
      write({ timestamp: new Date().toISOString(), level: "debug", message, data });
    }
  },
};
