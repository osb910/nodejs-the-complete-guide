const fs = require('fs');
const handleRequests = (req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === '/') {
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head>Assignment 1</head>');
    res.write('<body>');
    res.write('<h1>Welcome</h1>');
    res.write(
      '<form action="/create-user" method="POST"><input name="username" type="text"><button type="submit">Add User</button></form>'
    );
    res.write('</body>');
    res.write('</head>');
    return res.end();
  }

  if (url === '/users') {
    const users = fs
      .readFileSync('./users.txt', {encoding: 'utf-8'})
      .split('\n');
    users.shift();
    console.log('users:', users);
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head>Assignment 1</head>');
    res.write('<body>');
    res.write(`<ul>${users.map(u => `<li>${u}</li>`).join('')}</ul>`);
    res.write('</body>');
    res.write('</html>');
    return res.end();
  }

  if (url === '/create-user' && method === 'POST') {
    let body = [];
    req.on('data', chunk => {
      body = [...body, chunk];
    });

    return req.on('end', () => {
      const parsedBody = Buffer.concat(body).toString();
      const username = parsedBody.split('=')[1];
      fs.appendFile('users.txt', `\n${username}`, err => {
        console.log(err);
        res.statusCode = 302;
        res.setHeader('Location', '/users');
        return res.end();
      });
    });
  }

  res.setHeader('Content-Type', 'text/html');
  res.write('<html>');
  res.write('<head>Assignment 1</head>');
  res.write('<body>');
  res.write('<h1>404</h1>');
  res.write('</body>');
  res.write('</html>');
  return res.end();
};

module.exports = handleRequests;
