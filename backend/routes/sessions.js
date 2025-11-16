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
// This must come before /:id routes to avoid route conflicts
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

// PUT /api/sessions/:id - Update session title
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    if (!title || typeof title !== 'string') {
      return res.status(400).json({ success: false, error: 'Title is required' });
    }

    const sessions = await readJSON(sessionsFile);
    const sessionIndex = sessions.findIndex(s => s.id === id);

    if (sessionIndex === -1) {
      return res.status(404).json({ success: false, error: 'Session not found' });
    }

    sessions[sessionIndex].title = title;
    await writeJSON(sessionsFile, sessions);

    res.json({ success: true, data: sessions[sessionIndex] });
  } catch (error) {
    console.error('Error updating session:', error);
    res.status(500).json({ success: false, error: 'Failed to update session' });
  }
});

// DELETE /api/sessions/:id - Delete a session
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('DELETE request received for session:', id);

    const sessions = await readJSON(sessionsFile);
    const sessionIndex = sessions.findIndex(s => s.id === id);

    if (sessionIndex === -1) {
      console.log('Session not found:', id);
      return res.status(404).json({ success: false, error: 'Session not found' });
    }

    // Remove session from list
    sessions.splice(sessionIndex, 1);
    await writeJSON(sessionsFile, sessions);
    console.log('Session removed from list:', id);

    // Delete history file
    const historyFile = path.join(historyDir, `${id}.json`);
    try {
      await fs.unlink(historyFile);
      console.log('History file deleted:', historyFile);
    } catch (error) {
      // Ignore if file doesn't exist
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }

    console.log('Session deleted successfully:', id);
    res.json({ success: true, message: 'Session deleted successfully' });
  } catch (error) {
    console.error('Error deleting session:', error);
    res.status(500).json({ success: false, error: 'Failed to delete session' });
  }
});

export default router;

