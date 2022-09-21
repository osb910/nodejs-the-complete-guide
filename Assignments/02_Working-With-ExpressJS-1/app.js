const express = require('express');

const app = express();

// app.use((req, res, next) => {
//   console.log('Hello from assignment 2');
//   next();
// });

// app.use((req, res, next) => {
//   console.log('Hello again from assignment 2');
//   res.send(`<h1>Max's course is really great!</h1>`);
// });

app.use('/users', (req, res, next) => {
  console.log('Hello again from assignment 2');
  res.send(`<h1>Users Page</h1>`);
});

app.use('/', (req, res, next) => {
  console.log('Hello from assignment 2');
  res.send(`<h1>Home page</h1>`);
});

app.listen(3000);
