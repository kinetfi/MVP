export const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || 500;
  const errorBody = {
    timestamp: new Date().toISOString(),
    code: statusCode,
    message: err.message || (statusCode === 404 ? 'Not Found' : 'Internal Server Error'),
    reason: err.reason || (statusCode === 404 ? 'notFound' : 'serverError'),
    severity: err.severity || 'ERROR',
    category: err.category || (statusCode === 404 ? 'REQUEST' : 'SERVER'),
    description:
      err.description ||
      (statusCode === 404
        ? `Couldn't find the requested resource '${req.originalUrl}'`
        : 'An unexpected error occurred on the server')
  };
  res.status(statusCode).json(errorBody);
};
