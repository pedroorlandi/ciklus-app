// CIKLUS APP - RENDER NATIVE SERVER  
// Simple CommonJS server following Render.com best practices

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware
app.use(express.json());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// TEMPORARY: Serve assets from root assets folder until moved to public/assets
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Health check endpoint (required by Render)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'production'
  });
});

// API endpoints placeholder
app.get('/api/status', (req, res) => {
  res.json({
    message: 'CIKLUS APP API is running',
    timestamp: new Date().toISOString()
  });
});

// Serve React app for all other routes - RENDER OFFICIAL PATTERN
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server with proper binding for Render
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 CIKLUS APP running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'production'}`);
  console.log(`✅ Health check: http://localhost:${PORT}/api/health`);
});