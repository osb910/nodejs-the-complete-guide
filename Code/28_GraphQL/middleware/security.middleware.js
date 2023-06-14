import helmet from 'helmet';

const helmetMiddleware = helmet.contentSecurityPolicy({
  directives: {
    // ...helmet.contentSecurityPolicy.getDefaultDirectives(),
    'script-src': ["'self'", 'https://esm.sh', 'https://js.stripe.com'],
    'frame-src': ["'self'", 'https://js.stripe.com'],
  },
});

const corsMiddleware = (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
};

export {helmetMiddleware, corsMiddleware};
