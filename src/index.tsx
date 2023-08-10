// from react_root.js
import React from "react";
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import TopLevelApp from './samples/TopLevelApp';
import './i18n';
import '../assets/css/appStyles.scss'

const outletElement = document.getElementById("outlet");

if (outletElement) {
  // const root = render(outletElement);
  render(
    <>
    <BrowserRouter>
      <TopLevelApp />
    </BrowserRouter>
    </>, outletElement
  );
}
