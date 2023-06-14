// DEPS
import path from 'path';
import express from 'express';
import dotenv from 'dotenv/config';
import {createHandler} from 'graphql-http/lib/use/express';

import rootDir from './utils/path.js';
import {
  corsMiddleware,
  helmetMiddleware,
} from './middleware/security.middleware.js';
import {
  imgUploadMiddleware,
  filePathMiddleware,
} from './middleware/file.middleware.js';
import {authMiddleware} from './middleware/auth.middleware.js';
import {serverError} from './middleware/error.middleware.js';
import {mongoConnect} from './utils/database.js';
import {schema} from './graphql/schema.js';
import {createUser, login, createPost} from './graphql/resolvers.js';

const app = express();

// MIDDLEWARE
app.use(helmetMiddleware);
app.use(corsMiddleware);

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use('/images', express.static(path.join(rootDir(), 'images')));
app.use(imgUploadMiddleware);

app.use(filePathMiddleware);

app.use(authMiddleware);

app.put('/post-image', (req, res, next) => {
  if (!req.isAuth) throw new Error('Not authenticated');
  if (!req.file) return res.status(200).json({message: 'No file provided'});
  if (req.body.oldPath) clearImage(req.body.oldPath);
  return res
    .status(201)
    .json({message: 'File stored', filePath: req.file.path.replace('\\', '/')});
});

app.use(
  '/graphql',
  createHandler({
    schema,
    rootValue: {
      createUser,
      login,
      createPost,
    },
    graphiql: true,
    formatError: err => {
      if (!err.originalError) return err;
      const {data, code, message} = err.originalError;
      return {data, code, message};
    },
    context: ({req}) => ({req}),
  })
);

// ERROR HANDLING
app.use(serverError);

// INITIATE SERVER
try {
  await mongoConnect();
  app.listen(process.env.PORT, async () => {
    console.log(`Running on port ${process.env.PORT}`);
  });
} catch (err) {
  console.error(err);
  throw err;
}
