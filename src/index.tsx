// from react_root.js
import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import TopLevelApp from '../src/samples/TopLevelApp';
import '../assets/css/gdsStyles.scss';

const outletElement = document.getElementById('outlet');

if (outletElement) {
  render(
    <BrowserRouter>
      <TopLevelApp />
    </BrowserRouter>,
    document.getElementById('outlet')
  );
}
