type LogLevel = 'info' | 'warn' | 'error' | 'debug';

const getTimestamp = () => new Date().toISOString();

const formatMessage = (level: LogLevel, message: string, data?: any) => {
  const timestamp = getTimestamp();
  const dataString = data ? `\n${JSON.stringify(data, null, 2)}` : '';
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${dataString}`;
};

export const logger = {
  info: (message: string, data?: any) => {
    console.log(formatMessage('info', message, data));
  },
  warn: (message: string, data?: any) => {
    console.warn(formatMessage('warn', message, data));
  },
  error: (message: string, error?: any) => {
    console.error(formatMessage('error', message, error));
  },
  debug: (message: string, data?: any) => {
    console.debug(formatMessage('debug', message, data));
  }
};
