import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:4000/api' });

// Sessions endpoints
export const createSession = () => 
  API.post('/sessions').then(r => r.data.data);

export const getSessions = () => 
  API.get('/sessions').then(r => r.data.data);

export const getHistory = (id) => 
  API.get(`/sessions/${id}/history`).then(r => r.data.data);

// Chat endpoints
export const ask = (sessionId, question) => 
  API.post(`/chat/${sessionId}/ask`, { question }).then(r => r.data.data);

// Legacy exports for backward compatibility
export const fetchSessions = () => API.get('/sessions');
export const createNewChat = () => API.post('/sessions');
export const fetchSessionHistory = (sessionId) => API.get(`/sessions/${sessionId}/history`);
export const postQuestion = (sessionId, question) => API.post(`/chat/${sessionId}/ask`, { question });

export default API;

