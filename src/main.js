import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import './index.css';

const rootElement = document.getElementById('root');

if (rootElement) {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );

    // Signal to deployment synchronizer that React mounted successfully
    window.__fur_app_mounted = true;
    try {
      sessionStorage.removeItem('fur_deploy_sync_retry');
    } catch {}
  } catch (err) {
    console.error('Fatal application mount error:', err);
    rootElement.innerHTML = `
      <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #FAF8F5; color: #292524; font-family: system-ui, -apple-system, sans-serif; padding: 24px; text-align: center;">
        <div style="max-width: 420px; background: #ffffff; padding: 32px; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.08); border: 1px solid #e7e5e4;">
          <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 8px; color: #1c1917;">Fur Furniture Studio</h2>
          <p style="font-size: 13px; color: #78716c; line-height: 1.6; margin-bottom: 24px;">The application encountered a startup synchronization event. Please reload to restore the session.</p>
          <div style="display: flex; gap: 8px; justify-content: center;">
            <button onclick="sessionStorage.clear(); window.location.reload();" style="background: #292524; color: #ffffff; border: none; padding: 12px 24px; border-radius: 9999px; font-size: 13px; font-weight: 600; cursor: pointer; transition: opacity 0.2s;">
              Reload Application
            </button>
            <button onclick="window.location.href='/'" style="background: #f5f5f4; color: #44403c; border: 1px solid #e7e5e4; padding: 12px 24px; border-radius: 9999px; font-size: 13px; font-weight: 600; cursor: pointer;">
              Return Home
            </button>
          </div>
        </div>
      </div>
    `;
  }
}
