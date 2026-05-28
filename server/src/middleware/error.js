/** 404 for unknown routes. */
export const notFound = (req, _res, next) => {
  next(Object.assign(new Error(`Route not found: ${req.originalUrl}`), { status: 404 }))
}

/** Central error handler — never leaks stack traces in production. */
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, _next) => {
  let status = err.status || 500
  let message = err.message || 'Server error'

  // Friendly messages for common Mongoose errors.
  if (err.name === 'ValidationError') {
    status = 400
    message = Object.values(err.errors)[0]?.message || message
  }
  if (err.code === 11000) {
    status = 409
    message = `${Object.keys(err.keyValue)[0]} already exists.`
  }
  if (err.name === 'CastError') {
    status = 400
    message = 'Invalid identifier.'
  }

  if (status >= 500) console.error(err)

  res.status(status).json({
    message,
    ...(process.env.NODE_ENV !== 'production' && status >= 500 ? { stack: err.stack } : {}),
  })
}
