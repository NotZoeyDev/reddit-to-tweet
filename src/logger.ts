import * as winston from 'winston';

const format = winston.format.printf(({ level, message, timestamp }) => {
  return `[${level}] ${timestamp} -> ${message}`;
});

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YY-MM-DD HH:mm:ss'
    }),
    format
  ),
  transports: [
    new winston.transports.Console({})
  ]
});
