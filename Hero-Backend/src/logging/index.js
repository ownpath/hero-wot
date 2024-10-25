// logging.js
const { Logging } = require("@google-cloud/logging");
const winston = require("winston");

// Initialize the Google Cloud Logging client
const initCloudLogging = () => {
  const logging = new Logging();
  const logName = "express-app-logs";
  return logging.log(logName);
};

// Create a Winston transport that writes to Cloud Logging
const createCloudLogTransport = (log) => {
  return {
    log: (info, callback) => {
      const metadata = {
        resource: {
          type: "global",
        },
        severity: info.level.toUpperCase(),
      };

      const entry = log.entry(metadata, {
        message: info.message,
        ...info,
      });

      log.write(entry).catch(console.error);
      callback();
    },
  };
};

// Configure logger
const logger = (() => {
  const isDevelopment = process.env.NODE_ENV !== "production";
  const transports = [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ];

  // Add Cloud Logging transport if credentials are available
  try {
    const log = initCloudLogging();
    transports.push({
      log: createCloudLogTransport(log).log,
    });
  } catch (error) {
    console.warn("Could not initialize Cloud Logging:", error);
  }

  return winston.createLogger({
    level: isDevelopment ? "debug" : "info",
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    transports,
  });
})();

// Request logging middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info("Request completed", {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration,
      userAgent: req.get("user-agent"),
    });
  });
  next();
};

// Error logging middleware
const errorLogger = (err, req, res, next) => {
  logger.error("Unhandled error", {
    error: {
      message: err.message,
      stack: err.stack,
    },
    request: {
      method: req.method,
      path: req.path,
      headers: req.headers,
    },
  });
  next(err);
};

module.exports = {
  logger,
  requestLogger,
  errorLogger,
};
