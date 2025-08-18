// from react_root.js
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import TopLevelApp from '../src/samples/TopLevelApp';
import './common.css';

const outletElement = document.getElementById('outlet');

if (outletElement) {
  const root = createRoot(outletElement);
  root.render(
    <BrowserRouter>
      <TopLevelApp />
    </BrowserRouter>
  );
}
