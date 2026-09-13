import express from 'express';
import cors from 'cors';
import researchRouter from './routes/researchRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));

// Health Check Endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'healthy',
    service: 'AlphaPulse Quantitative Research API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Mount Research Routes
app.use('/api/research', researchRouter);

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 AlphaPulse Research Backend API running on http://localhost:${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
});

export default app;
