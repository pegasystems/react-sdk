// from react_root.js
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import TopLevelApp from '../src/samples/TopLevelApp';
import './common.css';

// Suppress "Uncaught runtime errors" overlay for non-fatal Axios errors from
// Constellation core (e.g. 404s during case loading). These are server-side
// responses that the SDK can recover from; the red error overlay is misleading.
window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
  const err = event.reason;
  if (err && typeof err === 'object' && 'isAxiosError' in err) {
    const status = err.response?.status;
    // Swallow 404 / 500-range errors coming from constellation-core API calls
    if (status === 404 || (status >= 500 && status < 600)) {
      console.warn(`[SDK] Suppressed Axios ${status} error:`, err.config?.url || err.message);
      event.preventDefault(); // prevents the red "Uncaught runtime errors" overlay
    }
  }
});

const outletElement = document.getElementById('outlet');

if (outletElement) {
  const root = createRoot(outletElement);
  root.render(
    <BrowserRouter>
      <TopLevelApp />
    </BrowserRouter>
  );
}
