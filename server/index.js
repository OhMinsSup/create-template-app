const express = require('express');
const path = require('path');

const port = parseInt(process.env.PORT, 10) || 3000;

const server = express();

server.use('/', express.static(path.join(__dirname, '../out')));

server.listen(port, (err) => {
  if (err) throw err;
  console.log(`> Ready on http://localhost:${port}`);
});
