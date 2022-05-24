/**
 * This helper ensures consistent system logging
 * It includes formatting the log message when displayed on the command line
 */
import winston from 'winston';
import dayjs from 'dayjs';
import expressWinston from 'express-winston';
import { Handler } from 'express';

// import config from '../../config/env';
// optionaly if we want to config the enviroment

const { combine, timestamp, printf, align, prettyPrint } = winston.format;

const logFormat = printf((info: winston.Logform.TransformableInfo): string => {
  return `[${dayjs(info.timestamp).format('MM-DD-YYYY HH:mm:ss')}] ${
    info.level
  } : ${info.message}`;
});

function createLoggerForEnv() {
  const commonLoggerFormats = [
    winston.format.errors({ stack: true }),
    winston.format.timestamp(),
    winston.format.json(),
  ];
  const defaultMeta = {};

  return winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      ...commonLoggerFormats,
      winston.format.prettyPrint() // Only pretty print on local due to performance concerns
    ),
    transports: [new winston.transports.Console()],
    defaultMeta,
  });
}

export const logger = createLoggerForEnv();

export const logToFile = (filename: string): winston.Logger => {
  const loggerInstance = winston.createLogger({
    format: combine(timestamp(), prettyPrint(), logFormat, align()),
  });
  logger.level = 'debug';
  loggerInstance.add(
    new winston.transports.File({ filename: `logs/${filename}` })
  );
  return loggerInstance;
};

export function requestLogger(): Handler {
  expressWinston.requestWhitelist.push('body');
  expressWinston.responseWhitelist.push('body');

  return expressWinston.logger({
    winstonInstance: logger,
    colorize: true,
  });
}
