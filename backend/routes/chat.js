import { Router } from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

const dataDir = path.join(__dirname, '..', 'data');
const responsesFile = path.join(dataDir, 'responses.json');
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

// Deterministic response selection based on question hash
const getResponseForQuestion = async (question) => {
  const responses = await readJSON(responsesFile);
  if (responses.length === 0) {
    throw new Error('No responses available');
  }

  // Hash the question to get a deterministic index
  const hash = crypto.createHash('md5').update(question).digest('hex');
  const index = parseInt(hash.substring(0, 8), 16) % responses.length;
  return responses[index];
};

// POST /api/chat/:sessionId/ask
router.post('/:sessionId/ask', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { question } = req.body;

    if (!question || typeof question !== 'string') {
      return res.status(400).json({ success: false, error: 'Question is required' });
    }

    // Check if session exists
    const historyFile = path.join(historyDir, `${sessionId}.json`);
    let history;
    try {
      history = await readJSON(historyFile);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return res.status(404).json({ success: false, error: 'Session not found' });
      }
      throw error;
    }

    // Get response from responses.json
    const responseData = await getResponseForQuestion(question);

    // Format the answer according to spec
    const answerTable = {
      id: responseData.id,
      title: responseData.title,
      columns: responseData.columns,
      rows: responseData.rows
    };

    const answer = {
      answerTable,
      description: responseData.description,
      meta: responseData.meta || {}
    };

    // Add user message to history
    const userMessage = {
      role: 'user',
      text: question,
      time: new Date().toISOString()
    };

    // Add assistant message to history
    const assistantMessage = {
      role: 'assistant',
      responseId: responseData.id,
      answer: answerTable,
      description: responseData.description,
      meta: responseData.meta,
      time: new Date().toISOString()
    };

    history.push(userMessage);
    history.push(assistantMessage);

    // Write updated history back to file
    await writeJSON(historyFile, history);

    // Update session title if this is the first message
    if (history.length === 2) {
      const sessionsFile = path.join(dataDir, 'sessions.json');
      const sessions = await readJSON(sessionsFile);
      const session = sessions.find(s => s.id === sessionId);
      if (session) {
        const newTitle = question.substring(0, 50) + (question.length > 50 ? '...' : '');
        session.title = newTitle;
        await writeJSON(sessionsFile, sessions);
      }
    }

    // Return the answer
    res.json({ success: true, data: answer });
  } catch (error) {
    console.error('Error processing question:', error);
    res.status(500).json({ success: false, error: 'Failed to process question' });
  }
});

export default router;

