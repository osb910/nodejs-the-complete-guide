const fs = require('fs');

const handleRequests = (req, res) => {
  const url = req.url;
  const method = req.method;
  if (url === '/') {
    res.write('<html><head><title>Enter Message</title></head><body>');
    res.write(
      '<form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form>'
    );
    res.write('</body></html>');
    return res.end();
  }

  if (url === '/message' && method === 'POST') {
    let body = [];
    req.on('data', chunk => {
      console.log(chunk);
      body = [...body, chunk];
    });

    return req.on('end', () => {
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split('=')[1];
      fs.writeFile('message.txt', message, err => {
        console.log(err);
        res.statusCode = 302;
        res.setHeader('Location', '/');
        return res.end();
      });
    });
  }

  res.setHeader('Content-Type', 'text/html');
  res.write('<head><title>My First Page</title></head>');
  res.write('<head><title>My First Page</title></head>');
  res.write('<body><h1>Hi!</h1></body>');
  res.write('</html>');
  res.end();
};

module.exports = handleRequests;
