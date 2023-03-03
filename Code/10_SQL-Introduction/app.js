// GLOBAL DEPENDENCIES
const path = require('path');

// EXTERNAL DEPENDENCIES
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

// UTILS
const rootDir = require('./util/path');

// ROUTES
const get404 = require('./controllers/error');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app = express();

// TEMPLATING ENGINE
app.set('view engine', 'ejs');
app.set('views', 'views'); // default

// MIDDLEWARE
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(rootDir, 'public')));

// ROUTING
app.use('/admin', adminRoutes);
app.use(shopRoutes);

// ERRORS
app.use(get404);

app.listen(3000, () => {
  console.log('Running on port 3000');
});
