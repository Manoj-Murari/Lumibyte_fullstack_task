import express from 'express';
import cors from 'cors';
import sessions from './routes/sessions.js';
import chat from './routes/chat.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/sessions', sessions);
app.use('/api/chat', chat);

// Debug route to verify server is running
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend server is running' });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
  console.log('Available routes:');
  console.log('  GET  /api/sessions');
  console.log('  POST /api/sessions');
  console.log('  GET  /api/sessions/:id/history');
  console.log('  PUT  /api/sessions/:id');
  console.log('  DELETE /api/sessions/:id');
  console.log('  POST /api/chat/:sessionId/ask');
});

