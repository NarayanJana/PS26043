import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import './index.css';
import './i18n';
import App from './App.jsx';
import { store } from './store/store.js';
import ErrorBoundary from './components/common/ErrorBoundary.jsx';
import ToastContainer from './components/common/ToastContainer.jsx';
import ThemeManager from './components/common/ThemeManager.jsx';
import LanguageManager from './components/common/LanguageManager.jsx';
import AccessibilityManager from './components/common/AccessibilityManager.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <ThemeManager />
        <LanguageManager />
        <AccessibilityManager />
        <BrowserRouter>
          <App />
          <ToastContainer />
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  </StrictMode>,
);