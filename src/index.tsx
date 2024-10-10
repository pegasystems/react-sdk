// from react_root.js
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import TopLevelApp from '../src/samples/TopLevelApp';
import './common.css';

const outletElement = document.getElementById('outlet');

if (outletElement) {
  render(
    <BrowserRouter>
      <TopLevelApp />
    </BrowserRouter>,
    document.getElementById('outlet')
  );
}
