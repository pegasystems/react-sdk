// from react_root.js
import React from "react";
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import TopLevelApp from './applications/TopLevelApp';

const outletElement = document.getElementById("outlet");

if (outletElement) {
  const root = createRoot(outletElement);
  root.render(
    <BrowserRouter>
      <TopLevelApp />
    </BrowserRouter>
  );
}
