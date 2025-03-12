import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

import Embedded from '../Embedded';
import FullPortal from '../FullPortal';
import HMRCHome from '../HMRCHome';
import setPageTitle from '../../components/helpers/setPageTitleHelpers';

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
  const [i18nloaded, seti18nloaded] = useState(false);

  useEffect(() => {
    i18n
      .use(Backend)
      .use(initReactI18next)
      .init({
        lng: 'en',

        backend: {
          loadPath: `assets/i18n/en.json`
        },
        fallbackLng: 'en',
        debug: false,
        returnNull: false,
        react: {
          useSuspense: false
        }
      })
      .finally(() => {
        seti18nloaded(true);
        setPageTitle();
      });
  }, []);

  return !i18nloaded ? null : (
    <div>
      <Routes>
        <Route path={`${baseURL}`} element={<HMRCHome />} />
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
