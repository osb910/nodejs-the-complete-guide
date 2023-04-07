import jwt from 'jsonwebtoken';

const isAuth = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        const error = new Error('Not authenticated.');
        error.statusCode = 401;
        throw error;
    }
    const token = authHeader.split(' ')[1];
    try {
        const decodedToken = jwt.verify(token, 'secret');
        if (!decodedToken) {
            const error = new Error('Not authenticated.');
            error.statusCode = 401;
            throw error;
        }
        req.userId = decodedToken.userId;
        next();
    } catch (err) {
        if (!err.statusCode) (err.statusCode = 500);
        next(err);
    }
};

export {isAuth};