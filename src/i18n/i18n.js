import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import Backend from 'i18next-http-backend';

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    lng: sessionStorage.getItem('rsdk_locale')?.substring(0,2) || 'en',
    backend: {
      /* translation file path */
      loadPath: '/assets/i18n/{{lng}}.json'
    },
    fallbackLng: 'en',
    debug: true,
    keySeparator: false,
    interpolation: {
      escapeValue: false,
      formatSeparator: ','
    },
    react: {
      wait: true
    }
  });

export default i18n;
