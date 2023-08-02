// from react_root.js
import React from "react";
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import TopLevelApp from './samples/TopLevelApp';
import './i18n';
import '../assets/css/appStyles.scss'
import LanguageToggle from './components/BaseComponents/LanguageToggle';

const outletElement = document.getElementById("outlet");

if (outletElement) {
  // const root = render(outletElement);
  render(
    <>
      <LanguageToggle />
      <main className="govuk-main-wrapper " id="main-content" role="main">
        <div className="govuk-grid-row">
          <BrowserRouter>
            <TopLevelApp />
          </BrowserRouter>
        </div>
      </main>
    </>, document.getElementById("outlet")
  );
}
