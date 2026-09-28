import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { logoInk } from './brand/logos';

const icon = document.querySelector('link[rel="icon"]');
if (icon) icon.href = logoInk;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
