import { Router } from 'express';
import { randomBytes } from 'crypto';
import fs from 'fs/promises';
import path from 'path';

// Helper function to read our JSON data
const readData = async (fileName) => {
  const filePath = path.join(process.cwd(), 'data', fileName);
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data);
};

const router = Router();

// --- Mock Data (In-memory "database") ---
// We load them once and then manipulate these arrays/objects.
// This is simple for a demo, but in a real app, you'd write back to the file or a DB.
let sessions = [];
let chatHistory = {};
let dummyAnswers = [];

// Load all data on server start
const loadData = async () => {
  try {
    sessions = await readData('sessions.json');
    chatHistory = await readData('chatHistory.json');
    dummyAnswers = await readData('dummyAnswers.json');
    console.log('Mock data loaded successfully.');
  } catch (error) {
    console.error('Failed to load mock data:', error);
  }
};
loadData();


// --- API Endpoints ---

// GET /api/sessions
// Fetches the list of all chat sessions for the side panel
router.get('/sessions', (req, res) => {
  // We only return the session ID and title, not the whole chat
  const sessionList = sessions.map(s => ({
    sessionId: s.sessionId,
    title: s.title,
  }));
  res.json(sessionList);
});

// POST /api/chat/new
// Starts a new chat session and returns a session ID
router.post('/chat/new', (req, res) => {
  const newSessionId = randomBytes(8).toString('hex');
  const newSession = {
    sessionId: newSessionId,
    title: 'New Chat', // Frontend can update this later
  };
  
  // Add to our "databases"
  sessions.push(newSession);
  chatHistory[newSessionId] = []; // Initialize empty chat history
  
  console.log(`New session created: ${newSessionId}`);
  res.json({ sessionId: newSessionId, title: 'New Chat' });
});

// GET /api/chat/:sessionId
// Fetches the full conversation history for a specific session
router.get('/chat/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const history = chatHistory[sessionId];
  
  if (history) {
    res.json(history);
  } else {
    res.status(404).json({ error: 'Session not found' });
  }
});

// POST /api/chat/:sessionId
// Handles a new user question in an existing session
router.post('/chat/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const { question } = req.body;

  if (!chatHistory[sessionId]) {
    return res.status(404).json({ error: 'Session not found' });
  }

  // 1. Add user's message to history
  const userMessage = {
    type: 'user',
    text: question,
  };
  chatHistory[sessionId].push(userMessage);

  // 2. Generate a dummy AI response
  // (Just pick a random answer from our file for this demo)
  const randomAnswer = dummyAnswers[Math.floor(Math.random() * dummyAnswers.length)];
  
  const aiResponse = {
    type: 'ai',
    text: randomAnswer.description,
    table: randomAnswer.table,
    feedback: null, // 'like', 'dislike', or null
  };
  
  // 3. Add AI's response to history
  chatHistory[sessionId].push(aiResponse);
  
  // 4. Update session title if it's the first message
  if (chatHistory[sessionId].length === 2) { // user msg + ai msg
    const newTitle = question.substring(0, 30) + '...';
    const sessionToUpdate = sessions.find(s => s.sessionId === sessionId);
    if(sessionToUpdate) {
      sessionToUpdate.title = newTitle;
    }
  }

  console.log(`New message in session ${sessionId}`);
  // 5. Send back just the new AI response
  res.json(aiResponse);
});

export default router;