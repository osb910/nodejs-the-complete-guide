const serverError = (err, req, res, next) => {
    console.error(err);
    const {statusCode = 500, message = 'An error occurred!'} = err;
    res.status(statusCode).json({message});
    next();
}

export {serverError};
