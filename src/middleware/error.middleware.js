const errorMiddleware = (err, req, res, next) => {
    console.error(err);

    // Duplicate value
    if (err.code === '23505') {
        return res.status(409).json({
            success: false,
            message: 'A student with this email or registration number already exists'
        });
    }

    // Foreign key violation
    if (err.code === '23503') {
        return res.status(400).json({
            success: false,
            message: 'The specified department does not exist'
        });
    }

    // Unknown error
    res.status(500).json({
        success: false,
        message: 'Something went wrong'
    });
};

export default errorMiddleware;