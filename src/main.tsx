import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Use a more performant approach to hydration
const root = document.getElementById('root');

if (root) {
  // Create a root for concurrent rendering
  const reactRoot = createRoot(root);
  
  // Render the app
  reactRoot.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}