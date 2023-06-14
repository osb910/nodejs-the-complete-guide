import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        req.isAuth = false;
        return next();
    }
    const token = authHeader.split(' ')[1];
    try {
        const decodedToken = jwt.verify(token, 'somesupersecretsecret');
        if (!decodedToken) {
            req.isAuth = false;
            next();
        }
        req.userId = decodedToken.userId;
        req.isAuth = true;
        next();
    } catch (err) {
        req.isAuth = false;
        next();
    }
};

export {authMiddleware};