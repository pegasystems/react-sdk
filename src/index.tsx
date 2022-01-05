// from react_root.js
import React from "react";
import { render } from "react-dom";
import { BrowserRouter } from 'react-router-dom';
import TopLevelApp from '../src/samples/TopLevelApp';

render((
  <BrowserRouter>
    <TopLevelApp />
  </BrowserRouter>
), document.getElementById("outlet"));
