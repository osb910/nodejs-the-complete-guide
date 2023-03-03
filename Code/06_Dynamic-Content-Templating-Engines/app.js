const path = require('path');

// const https = require('https');
const express = require('express');
const cors = require('cors');

const rootDir = require('./util/path');
const {adminRouter, products} = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app = express();

const corsOptions = {
  origin: '*',
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.set('view engine', 'ejs');
app.set('views', 'views'); // default

app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(rootDir, 'public')));

app.use('/admin', adminRouter);
app.use(shopRoutes);

app.use((_, res, next) => {
  res
    .status(404)
    .render('not-found', {pageTitle: 'Page Not Found', path: false});
});

// https.createServer({}, app).listen(3000, () => {
//   console.log('Running on port 3000');
// });

app.listen(3000, () => {
  console.log('Running on port 3000');
});
