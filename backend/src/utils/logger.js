/**
 * Production-ready application logger
 */
const isDev = process.env.NODE_ENV !== 'production';

export const logger = {
  info: (message, meta = '') => {
    console.log(`[INFO] [${new Date().toISOString()}] ${message}`, meta ? meta : '');
  },
  warn: (message, meta = '') => {
    console.warn(`[WARN] [${new Date().toISOString()}] ${message}`, meta ? meta : '');
  },
  error: (message, error = null) => {
    console.error(`[ERROR] [${new Date().toISOString()}] ${message}`);
    if (error) {
      console.error(error.stack || error);
    }
  },
  debug: (message, meta = '') => {
    if (isDev) {
      console.debug(`[DEBUG] [${new Date().toISOString()}] ${message}`, meta ? meta : '');
    }
  },
};

export default logger;
