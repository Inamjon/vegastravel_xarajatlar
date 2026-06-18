import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Dev server uchun API middleware (data.json ni boshqaradi)
const localApiPlugin = () => ({
  name: 'local-api-plugin',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url === '/api/data') {
        const DATA_FILE = path.resolve(__dirname, 'data.json');

        if (req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json');
          if (fs.existsSync(DATA_FILE)) {
            res.end(fs.readFileSync(DATA_FILE, 'utf8'));
          } else {
            res.end(JSON.stringify({ reports: {}, expenses: {} }));
          }
          return;
        }

        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              fs.writeFileSync(DATA_FILE, body, 'utf8');
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true }));
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
          return;
        }
      }
      next();
    });
  }
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), localApiPlugin()],
  server: {
    host: true, // Tarmoqdagi boshqa qurilmalar kirishi uchun
    port: 5173,
  }
})
