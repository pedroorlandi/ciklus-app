import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middleware para separação de domínios - SERVIR ARQUIVOS ESTÁTICOS DIRETOS
app.use((req, res, next) => {
  const host = req.get('host') || '';
  const path = req.path;

  console.log(`[DOMAIN] ${req.method} ${path} (Host: ${host})`);

  // Site institucional: ciklus.com.br ou www.ciklus.com.br
  if (host === 'ciklus.com.br' || host === 'www.ciklus.com.br') {
    console.log(`[DOMAIN] Serving static institutional site for ${host}`);
    
    // Servir arquivos estáticos do site-atual
    const staticMiddleware = express.static('./site-atual');
    return staticMiddleware(req, res, (staticErr) => {
      // Se não encontrou arquivo estático específico, servir index.html
      if (staticErr || req.method === 'GET') {
        console.log(`[DOMAIN] Serving index.html for ${host}${path}`);
        return res.sendFile('index.html', { 
          root: './site-atual',
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'no-cache'
          }
        });
      }
    });
  }

  // Para outros domínios (app.ciklus.com.br ou desenvolvimento), continua o fluxo normal
  next();
});

// Middleware de logging para app.ciklus.com.br
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  const host = req.get('host') || '';
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  // Skip logging para requests do site institucional
  if (host === 'ciklus.com.br' || host === 'www.ciklus.com.br') {
    return next();
  }

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`[DEBUG] Response: ${req.method} ${path} -> ${res.statusCode} in ${duration}ms`);
    
    if (path.startsWith("/api") || path.includes("test-server")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Setup routes FIRST
  const server = await registerRoutes(app);

  // Error handling middleware
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // Setup SPA handling with proper order
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // REPLIT PRODUCTION: Use environment PORT (default 5000) and bind to 0.0.0.0
  // Development: Use 5000 for local development
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen(port, '0.0.0.0', () => {
    log(`🚀 Server running on port ${port}`);
  });
})();
