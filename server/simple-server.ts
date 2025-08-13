import express from "express";
import { createServer } from "http";
import { setupAuth } from "./replitAuth";

const app = express();

function log(message: string) {
  const formattedTime = new Date().toISOString().split('T')[1].split('.')[0];
  console.log(`${formattedTime} [express] ${message}`);
}

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

(async () => {
  // Setup auth first
  await setupAuth(app);

  // API routes
  app.get('/api/auth/user', (req: any, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    // Demo user for now
    res.json({
      id: "demo-user",
      email: "demo@ciklus.com.br",
      firstName: "Demo",
      lastName: "User",
      role: "cliente"
    });
  });

  app.get('/test-server', (req, res) => {
    res.json({ message: 'Server is working!', path: req.path });
  });

  // SPA fallback - serve React app for all non-API routes
  app.get('*', (req, res) => {
    // Simple HTML that loads React
    res.send(`
      <!DOCTYPE html>
      <html lang="pt-BR">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>CIKLUS APP</title>
        </head>
        <body>
          <div id="root"></div>
          <script>
            console.log('SIMPLE SERVER - ROUTE:', window.location.pathname);
            document.getElementById('root').innerHTML = '<h1>CIKLUS APP</h1><p>Route: ' + window.location.pathname + '</p>';
          </script>
        </body>
      </html>
    `);
  });

  const server = createServer(app);
  const port = parseInt(process.env.PORT || '5000', 10);
  
  server.listen(port, '0.0.0.0', () => {
    log(`🚀 Simple Server running on port ${port}`);
  });
})();