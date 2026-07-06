const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8000;
const DIRECTORY = __dirname;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const rooms = {};

const server = http.createServer((req, res) => {
  let urlPath = req.url.split('?')[0];
  
  // API Endpoints for Collaborative Rooms
  if (urlPath.startsWith('/api/room')) {
    res.setHeader('Content-Type', 'application/json');
    
    if (req.method === 'GET') {
      const urlParams = new URL(req.url, `http://${req.headers.host}`);
      const code = urlParams.searchParams.get('code');
      if (!code) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Missing code parameter' }));
        return;
      }
      if (!rooms[code]) {
        rooms[code] = { members: [], chat: [], strokes: [] };
      }
      res.writeHead(200);
      res.end(JSON.stringify(rooms[code]));
      return;
    }

    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        try {
          const data = JSON.parse(body);
          const { code, action } = data;

          if (!code) {
            res.writeHead(400);
            res.end(JSON.stringify({ error: 'Missing code' }));
            return;
          }

          if (!rooms[code]) {
            rooms[code] = { members: [], chat: [], strokes: [] };
          }

          if (action === 'join') {
            const { name } = data;
            if (name && !rooms[code].members.includes(name)) {
              rooms[code].members.push(name);
              rooms[code].chat.push({ sender: 'System', text: `${name} joined the room.`, system: true });
            }
            res.writeHead(200);
            res.end(JSON.stringify({ success: true }));
          } else if (action === 'chat') {
            const { sender, text } = data;
            if (sender && text) {
              rooms[code].chat.push({ sender, text });
            }
            res.writeHead(200);
            res.end(JSON.stringify({ success: true }));
          } else if (action === 'draw') {
            const { strokes, stroke, sender } = data;
            if (strokes && Array.isArray(strokes)) {
              strokes.forEach(s => {
                rooms[code].strokes.push({ sender, ...s });
              });
            } else if (stroke) {
              rooms[code].strokes.push({ sender, ...stroke });
            }
            res.writeHead(200);
            res.end(JSON.stringify({ success: true }));
          } else if (action === 'clear') {
            rooms[code].strokes = [];
            rooms[code].chat.push({ sender: 'System', text: `Canvas cleared by a peer.`, system: true });
            res.writeHead(200);
            res.end(JSON.stringify({ success: true }));
          } else {
            res.writeHead(400);
            res.end(JSON.stringify({ error: 'Unknown action' }));
          }
        } catch (e) {
          res.writeHead(400);
          res.end(JSON.stringify({ error: 'Invalid JSON body' }));
        }
      });
      return;
    }
  }

  let filePath = path.join(DIRECTORY, decodeURIComponent(urlPath));
  
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  const extname = path.extname(filePath);
  let contentType = MIME_TYPES[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>', 'utf-8');
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${error.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
