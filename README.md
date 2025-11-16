# ChatGPT-style Frontend + Backend Assignment

A full-stack chat application with a ChatGPT-like interface, featuring table-based answers, session management, and theme switching.

## Project Structure

```
/chat-app-assignment
│
├─ /backend
│   ├─ package.json
│   ├─ server.js           <-- Express entry point
│   ├─ /data
│   │   ├─ sessions.json   <-- Sessions list
│   │   ├─ history/{sessionId}.json  <-- Per-session chat history
│   │   └─ responses.json  <-- Mock table responses
│   └─ routes/
│       ├─ sessions.js     <-- Session management endpoints
│       └─ chat.js         <-- Chat/ask endpoints
│
├─ /frontend
│   ├─ package.json
│   ├─ tailwind.config.cjs
│   ├─ postcss.config.cjs
│   └─ /src
│       ├─ main.jsx
│       ├─ App.jsx
│       ├─ /pages
│       │    ├─ Landing.jsx / LandingPage.jsx
│       │    └─ ChatPage.jsx / ChatLayout.jsx
│       ├─ /components
│       │    ├─ LeftPanel.jsx / SidePanel.jsx
│       │    ├─ TopBar.jsx
│       │    ├─ ChatWindow.jsx / ChatInterface.jsx
│       │    ├─ TableAnswer.jsx / TableView.jsx
│       │    └─ ThemeToggle.jsx
│       ├─ /context
│       │    ├─ SessionContext.jsx
│       │    └─ ThemeContext.jsx
│       └─ /lib
│            └─ api.js
```

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Installation & Setup

### Backend

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The backend will run on `http://localhost:4000`

### Frontend

1. Navigate to the frontend directory (in a new terminal):
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (or the Vite default port)

## API Endpoints

### Sessions

- **GET** `/api/sessions` - Get all sessions
  ```bash
  curl http://localhost:4000/api/sessions
  ```

- **POST** `/api/sessions` - Create a new session
  ```bash
  curl -X POST http://localhost:4000/api/sessions
  ```

- **GET** `/api/sessions/:id/history` - Get chat history for a session
  ```bash
  curl http://localhost:4000/api/sessions/{sessionId}/history
  ```

### Chat

- **POST** `/api/chat/:sessionId/ask` - Ask a question in a session
  ```bash
  curl -X POST http://localhost:4000/api/chat/{sessionId}/ask \
    -H "Content-Type: application/json" \
    -d '{"question":"Show me sales data"}'
  ```

## Features

### Backend
- ✅ Express server with CORS enabled
- ✅ File-based persistence (JSON files)
- ✅ Session management with UUID generation
- ✅ Deterministic mock responses based on question hash
- ✅ Chat history persistence per session
- ✅ Automatic session title generation from first question

### Frontend
- ✅ React Router for navigation
- ✅ Session-based chat interface
- ✅ Table rendering for structured answers
- ✅ Like/Dislike feedback with localStorage persistence
- ✅ Dark/Light theme toggle with persistence
- ✅ Collapsible left panel (responsive)
- ✅ Mobile-responsive design
- ✅ Real-time message updates
- ✅ Auto-scroll to latest message

## Key UX Behaviors

1. **Start New Chat**: Creates a new session and navigates to `/chat/:sessionId`
2. **Session in URL**: Session ID is in the route parameter (bookmarkable)
3. **Persist History**: Backend writes to JSON files; frontend reloads full history
4. **Answer Format**: Table displayed first, then description, then meta information
5. **Like/Dislike**: Toggle state stored in localStorage per answer
6. **Dark/Light Theme**: Toggle persists and updates entire UI instantly
7. **Collapsible Panel**: Left panel state remembered (localStorage)
8. **Mobile Responsive**: Left panel hidden by default on mobile, accessible via hamburger menu

## Technology Stack

### Backend
- Node.js
- Express.js
- File system (fs/promises) for persistence

### Frontend
- React 19
- React Router DOM
- Tailwind CSS v4
- Axios for API calls
- Lucide React for icons

## Development

### Backend Scripts
- `npm run dev` - Start with nodemon (auto-reload)
- `npm start` - Start with node

### Frontend Scripts
- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Data Structure

### Session Object
```json
{
  "id": "uuid",
  "title": "Chat title",
  "createdAt": "2025-11-17T01:00:00Z"
}
```

### History Entry
```json
{
  "role": "user" | "assistant",
  "text": "Question text",
  "answer": { "columns": [...], "rows": [...] },
  "description": "Answer description",
  "meta": { ... },
  "time": "ISO timestamp"
}
```

### Response Object
```json
{
  "id": "table-1",
  "title": "Sales Summary",
  "columns": ["Region", "Q1", "Q2"],
  "rows": [["North", "1200", "1400"]],
  "description": "Description text",
  "meta": { "totalSales": "5400" }
}
```

## Testing

1. Start both servers (backend and frontend)
2. Navigate to `http://localhost:5173`
3. Click "Start New Chat"
4. Enter a question
5. Verify table rendering and description
6. Test Like/Dislike buttons
7. Test theme toggle
8. Test session switching
9. Test mobile responsiveness

## Notes

- Backend uses file-based persistence (no database)
- Mock responses are deterministic based on question hash
- Frontend uses localStorage for feedback and theme preferences
- All API responses follow `{ success: true, data: ... }` format
- Session IDs are UUIDs generated on the backend

## License

ISC

