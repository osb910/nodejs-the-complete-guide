const express = require('express');

const app = express();

app.use('/add-product', (req, res, next) => {
  console.log('In product middleware');
  res.send('<h1>The "Add Product" Page</h1>');
});

app.use('/', (req, res, next) => {
  console.log('In home middleware');
  res.send('<h1>Hello from express!</h1>');
});

app.listen(3000);
