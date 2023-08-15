import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    lng: sessionStorage.getItem('rsdk_locale')?.substring(0, 2) || 'en',
    backend: {
      /* translation file path */
      loadPath: `${window.location.pathname}assets/i18n/{{lng}}.json`
    },
    fallbackLng: 'en',
    debug: false,
    returnNull: false,
    react: {
      wait: true,
      useSuspense: false,
    }
  });

export default i18n;
