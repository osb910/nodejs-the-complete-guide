const path = require('path');

const express = require('express');

const rootDir = require('./util/path');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(rootDir, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use((_, res, next) => {
  res.status(404).sendFile(path.join(rootDir, 'views', 'not-found.html'));
});

app.listen(3000);
