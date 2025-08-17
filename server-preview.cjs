const express = require('express');
const path = require('path');

const app = express();
const PORT = 3030;

// Serve static files from ciklus-clean/public directory
app.use(express.static(path.join(__dirname, 'ciklus-clean/public')));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Site Institucional Preview - Running on port 5000' });
});

// Serve React app for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'ciklus-clean/public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🌐 Site Institucional Preview rodando na porta ${PORT}`);
  console.log(`📋 Acesse: http://localhost:${PORT}`);
  console.log(`✅ Health check: http://localhost:${PORT}/health`);
});