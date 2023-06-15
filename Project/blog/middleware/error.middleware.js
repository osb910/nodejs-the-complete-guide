const serverError = (err, req, res, next) => {
    console.error(err);
    const {statusCode = 500, message = 'An error occurred!'} = err;
    res.status(statusCode).json({message, data: err.data});
    next();
}

export {serverError};
