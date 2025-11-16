import express from 'express';
import cors from 'cors';
import sessions from './routes/sessions.js';
import chat from './routes/chat.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/sessions', sessions);
app.use('/api/chat', chat);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Backend listening on port ${PORT}`));

