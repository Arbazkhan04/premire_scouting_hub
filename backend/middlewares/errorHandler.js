//Global Error Handler 
const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500; // Default to Internal Server Error
    const message = err.message || 'Internal Server Error';
    
    // Log error (optional)
    console.error(`[ERROR] ${err.stack || err.message}`);

    // Set CORS headers for error responses
    res.header('Access-Control-Allow-Origin', '*'); // Allow all origins
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allowed methods
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allowed headers

    // Send structured error response
    res.status(statusCode).json({
        success: false,
        message,
        error: process.env.NODE_ENV === 'development' ? err.stack : null, // Show stack only in development
    });
};

module.exports = errorHandler;
