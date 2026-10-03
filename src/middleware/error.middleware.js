const errorMiddleware = (err, req, res, next) => {
  console.error(err);

  // Duplicate value: unique constraint violation
  if (err.code === '23505') {
    return res.status(409).json({
      success: false,
      message:
        'A student with this email or registration number already exists',
    });
  }

  // Foreign key violation
  if (err.code === '23503') {
    return res.status(400).json({
      success: false,
      message: 'The specified department does not exist',
    });
  }

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message:
      statusCode === 500
        ? 'Something went wrong'
        : err.message,
  });
};

export default errorMiddleware;