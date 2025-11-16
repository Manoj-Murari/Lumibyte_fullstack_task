import { Router } from 'express';
import { randomUUID } from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

const dataDir = path.join(__dirname, '..', 'data');
const sessionsFile = path.join(dataDir, 'sessions.json');
const historyDir = path.join(dataDir, 'history');

// Helper to read JSON file
const readJSON = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
};

// Helper to write JSON file
const writeJSON = async (filePath, data) => {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
};

// GET /api/sessions - Returns array of sessions
router.get('/', async (req, res) => {
  try {
    const sessions = await readJSON(sessionsFile);
    res.json({ success: true, data: sessions });
  } catch (error) {
    console.error('Error reading sessions:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch sessions' });
  }
});

// POST /api/sessions - Create new session
router.post('/', async (req, res) => {
  try {
    const sessions = await readJSON(sessionsFile);
    const sessionId = randomUUID();
    const newSession = {
      id: sessionId,
      title: 'New Chat',
      createdAt: new Date().toISOString()
    };

    sessions.push(newSession);
    await writeJSON(sessionsFile, sessions);

    // Create empty history file for this session
    const historyFile = path.join(historyDir, `${sessionId}.json`);
    await writeJSON(historyFile, []);

    res.json({ success: true, data: { sessionId } });
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ success: false, error: 'Failed to create session' });
  }
});

// GET /api/sessions/:id/history - Return chat history for a session
router.get('/:id/history', async (req, res) => {
  try {
    const { id } = req.params;
    const historyFile = path.join(historyDir, `${id}.json`);

    try {
      const history = await readJSON(historyFile);
      res.json({ success: true, data: history });
    } catch (error) {
      if (error.code === 'ENOENT') {
        res.status(404).json({ success: false, error: 'Session not found' });
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error('Error reading history:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch history' });
  }
});

export default router;

