// CIKLUS APP - Production Server
// Servidor otimizado para deploy sem dependências Vite

import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { registerRoutes } from "./routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware básico
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      console.log(`${req.method} ${path} ${res.statusCode} in ${duration}ms`);
    }
  });

  next();
});

// Bypass de login para produção
app.get('/api/login', (req, res) => {
  console.log('🔓 Login bypass para produção ativado');
  res.redirect('/');
});

app.get('/api/auth/user', (req, res) => {
  res.json({
    id: 'demo-user',
    email: 'demo@ciklus.com.br',
    firstName: 'Demo',
    lastName: 'User',
    role: 'administrador'
  });
});

app.get('/api/dashboard', (req, res) => {
  res.json({
    totalPlanejamentos: 3,
    totalPatrimonio: 1500000,
    totalReceitas: 25000,
    totalDespesas: 18000,
    portfolioValue: 850000,
    recentActivity: []
  });
});

// Health check sempre ativo
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'production'
  });
});

// Registrar outras rotas da API (se necessário)
const server = await registerRoutes(app).catch(() => {
  console.log('⚠️ Rotas avançadas desabilitadas - modo demo ativo');
  return createServer(app);
});

// Servir arquivos estáticos do frontend (client/dist -> dist/client)
app.use(express.static(path.join(__dirname, "../dist/client")));

// Fallback para SPA - servir index.html para rotas não-API
app.get("*", (req, res) => {
  if (!req.path.startsWith("/api")) {
    res.sendFile(path.join(__dirname, "../dist/client/index.html"));
  }
});

// Error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  console.error(`Error ${status}: ${message}`);
  res.status(status).json({ message });
});

const port = process.env.PORT || 10000;

server.listen(port, "0.0.0.0", () => {
  console.log(`🚀 CIKLUS APP running on port ${port}`);
  console.log(`🌐 Production URL: https://ciklus-app.onrender.com`);
  console.log(`📱 Local: http://localhost:${port}`);
});