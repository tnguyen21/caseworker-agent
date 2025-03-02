// Production server with proxy capabilities
import { createServer } from 'http';
import { createReadStream } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Backend API URL
const BACKEND_URL = process.env.NODE_ENV === 'production' 
  ? 'http://localhost:8000' 
  : 'http://localhost:8000';

// Create HTTP server
const server = createServer(async (req, res) => {
  console.log(`${req.method} ${req.url}`);

  // Handle API requests - proxy to backend
  if (req.url.startsWith('/chat-stream')) {
    // Forward the request to the backend
    try {
      const backendUrl = new URL(req.url, BACKEND_URL);
      
      // Create options for the backend request
      const options = {
        hostname: backendUrl.hostname,
        port: backendUrl.port,
        path: backendUrl.pathname + backendUrl.search,
        method: req.method,
        headers: req.headers,
      };

      // Remove host header to avoid conflicts
      delete options.headers.host;

      // Create a proxy request to the backend
      const proxyReq = createRequest(options);
      
      // Forward request headers and body
      req.pipe(proxyReq);
      
      // Handle the backend response
      proxyReq.on('response', (proxyRes) => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res);
      });
      
      // Handle errors
      proxyReq.on('error', (error) => {
        console.error('Proxy request error:', error);
        res.writeHead(500);
        res.end('Proxy request failed');
      });
    } catch (error) {
      console.error('Error proxying request:', error);
      res.writeHead(500);
      res.end('Internal Server Error');
    }
    return;
  }

  // Serve static files
  try {
    const url = req.url === '/' ? '/index.html' : req.url;
    const filePath = join(__dirname, 'dist', url);
    const ext = extname(filePath);
    
    // Set content type based on file extension
    const contentType = {
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
    }[ext] || 'text/plain';
    
    // Stream the file to the response
    const stream = createReadStream(filePath);
    res.writeHead(200, { 'Content-Type': contentType });
    stream.pipe(res);
    
    // Handle file read errors
    stream.on('error', () => {
      // If file not found, try serving index.html (for SPA routing)
      if (ext !== '.html') {
        const indexPath = join(__dirname, 'dist', 'index.html');
        const indexStream = createReadStream(indexPath);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        indexStream.pipe(res);
        
        indexStream.on('error', () => {
          res.writeHead(404);
          res.end('Not found');
        });
      } else {
        res.writeHead(404);
        res.end('Not found');
      }
    });
  } catch (error) {
    console.error('Error serving file:', error);
    res.writeHead(500);
    res.end('Internal Server Error');
  }
});

// Import http module for createRequest
import { request as createRequest } from 'http';

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
