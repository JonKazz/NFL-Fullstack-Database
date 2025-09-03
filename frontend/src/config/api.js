// API Configuration
const RENDER_URL = 'https://nfl-backend-uaxt.onrender.com'; // Your actual Render URL
const LOCAL_URL = 'http://localhost:8080';

// Use Render backend in production, localhost in development
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? RENDER_URL 
  : LOCAL_URL;

export { API_BASE_URL };
