const getTimestamp = () => {
  return new Date().toISOString();
};

const formatMessage = (level, message, meta = {}) => {
  return JSON.stringify({
    timestamp: getTimestamp(),
    level,
    message,
    ...meta
  });
};

const logger = {
  info: (message, meta) => {
    console.log(formatMessage('INFO', message, meta));
  },
  error: (message, meta) => {
    console.error(formatMessage('ERROR', message, meta));
  },
  warn: (message, meta) => {
    console.warn(formatMessage('WARN', message, meta));
  },
  debug: (message, meta) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(formatMessage('DEBUG', message, meta));
    }
  }
};

export default logger;
