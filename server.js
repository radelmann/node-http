const http = require('http');
const fs = require('fs');
const path = require('path');

const host = process.env.HOST || '127.0.0.1';
const port = process.env.PORT || 3000;

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.woff': 'application/font-woff',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'application/font-otf',
  '.svg': 'application/image/svg+xml'
};

const server = http.createServer(function(req, res) {
  console.log('get: ', req.url);

  let filePath = '.' + req.url;

  if (filePath == './') filePath = './index.html';

  const ext = String(path.extname(filePath)).toLowerCase();

  fs.readFile(filePath, function(err, content) {
    if (err) {
      handlerError(res, err);
    } else {
      serveFile(res, content, ext);
    }
  });
});

server.listen(port, function() {
  console.log(`Server running at http://${host}:${port}/`);
});

function handlerError(res, err) {
  if (err.code == 'ENOENT') {
    fs.readFile('./404.html', function(err, content) {
      res.writeHead(200, {
        'Content-Type': 'text/html',
      });
      res.end(content, 'utf-8');
    });
  } else {
    res.writeHead(500);
    res.end('server error: ' + err.code + ' ..\n');
    res.end();
  }
}

function serveFile(res, content, ext) {
  let contentType = mimeTypes[ext] || 'application/octect-stream';

  res.writeHead(200, {
    'Content-Type': contentType
  });
  res.end(content, 'utf-8');
}
