import { createRoot } from 'react-dom/client';

import App from './App';
import { ErrorBoundary } from '@/components/error-boundary';
import { initializeVisitPalette } from './palette';

import './index.css';
import './styles/navigation-highlights.css';
import './styles/scale.css';

// Pick once when the site opens, not when navigating back to the home page.
initializeVisitPalette();

createRoot(document.getElementById('root')!, {
  // Keeps caught errors off reportError(), which would raise the dev overlay.
  onCaughtError: (error, errorInfo) => {
    console.error(error, errorInfo.componentStack);
  },
}).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
);
