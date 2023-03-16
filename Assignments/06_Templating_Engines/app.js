const path = require('path');

const express = require('express');

const rootDir = require('./util/path');

const {adminRouter} = require('./routes/admin');
const {usersRouter} = require('./routes/users');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views'); // default

app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(rootDir, 'public')));

app.use('/admin', adminRouter);
app.use(usersRouter);

app.listen(3000, () => console.log('Running on port 3000'));
