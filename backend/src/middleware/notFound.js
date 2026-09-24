import { HTTP_STATUS } from '../constants/httpStatus.js';

/**
 * 404 Not Found Middleware
 */
export const notFound = (req, res, next) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    message: `Resource not found: ${req.method} ${req.originalUrl}`,
    errors: [],
  });
};

export default notFound;
