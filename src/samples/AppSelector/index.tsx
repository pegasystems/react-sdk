import { Route, Routes } from 'react-router';

import Embedded from '../Embedded';
import FullPortal from '../FullPortal';

// NOTE: You should update this to be the same value that's in
//  the src/index.html <base href="value"> to allow the React Router
//  to identify the paths correctly.
const baseURL = '/';

// The Main component renders one of the three provided
// Routes (provided that one matches). Both the /roster
// and /schedule routes will match any pathname that starts
// with /roster or /schedule. The / route will only match
// when the pathname is exactly the string "/"
const AppSelector = () => {
  return (
    <div>
      <Routes>
        <Route path={`${baseURL}`} element={<Embedded />} />
        <Route path={`${baseURL}index.html`} element={<Embedded />} />
        <Route path={`${baseURL}embedded`} element={<Embedded />} />
        <Route path={`${baseURL}embedded.html`} element={<Embedded />} />
        <Route path={`${baseURL}portal`} element={<FullPortal />} />
        <Route path={`${baseURL}portal.html`} element={<FullPortal />} />
        <Route path='*' element={<Embedded />} />
      </Routes>
    </div>
  );
};

export default AppSelector;
