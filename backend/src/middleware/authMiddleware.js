/**
 * Authentication Middleware (Placeholder for Phase 2 implementation)
 */
export const authenticate = (req, res, next) => {
  next();
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    next();
  };
};

export default {
  authenticate,
  authorize,
};
