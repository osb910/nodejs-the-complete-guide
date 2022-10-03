const path = require('path');

const express = require('express');

const rootDir = require('./util/path');
const usersRoutes = require('./routes/users');
const homeRoutes = require('./routes/home');

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(rootDir, 'public')));

app.use('/users', usersRoutes);
app.use(homeRoutes);

app.use((_, res) => {
  res.sendFile(path.join(rootDir, 'views', 'not-found.html'));
});

app.listen(3000);
