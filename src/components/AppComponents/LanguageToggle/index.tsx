import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import 'dayjs/locale/cy';
import setPageTitle from '../../helpers/setPageTitleHelpers';

declare const PCore: any;

const LanguageToggle = props => {
  const { languageToggleCallback } = props;
  const { i18n } = useTranslation();
  let lang = sessionStorage.getItem('rsdk_locale')?.substring(0, 2) || 'en';
  const [selectedLang, setSelectedLang] = useState(lang);
  const [resourcebundles, setResourceBundles] = useState([]);

  const changeLanguage = e => {
    e.preventDefault();
    lang = e.currentTarget.getAttribute('lang');
    setSelectedLang(lang);
    sessionStorage.setItem('rsdk_locale', `${lang}_GB`);
    dayjs.locale(lang);
    i18n.changeLanguage(lang).then(() => {
      setPageTitle();
    });
    if (typeof PCore !== 'undefined') {
      // Fetch Locale Reference names for data pages
      const datapageKeys = Object.keys(PCore.getDataPageUtils().datastore);
      const dataPageBundleNames = datapageKeys.map(dpageName => {
        return `@BASECLASS!DATAPAGE!${dpageName.toUpperCase()}`;
      });

      const bundles = [
        PCore.getLocaleUtils().GENERIC_BUNDLE_KEY,
        '@BASECLASS!DATAPAGE!D_LISTREFERENCEDATABYTYPE',
        '@BASECLASS!DATAPAGE!D_SCOPEDREFERENCEDATALISTBYTYPE',
        'HMRC-CHB-WORK-CLAIM!CASE!CLAIM'
      ];

      bundles.push(...resourcebundles, ...dataPageBundleNames);

      PCore.getEnvironmentInfo().setLocale(`${lang}_GB`);
      PCore.getLocaleUtils().resetLocaleStore();
      PCore.getLocaleUtils().loadLocaleResources(bundles);

      PCore.getPubSubUtils().publish('languageToggleTriggered', { language: lang, localeRef: [] });
    }
    if (languageToggleCallback) {
      languageToggleCallback(lang);
    }
  };

  // Initialises language value in session storage, and for dayjs
  useEffect(() => {
    document.addEventListener('SdkConstellationReady', () => {
      PCore.onPCoreReady(() => {
        PCore.getPubSubUtils().subscribe(PCore.getConstants().PUB_SUB_EVENTS.EVENT_EXPRESS_LOCALACTION, data => {
          setResourceBundles(data.submitResponse.uiResources.localeReferences);
        });
      });
    });

    if (!sessionStorage.getItem('rsdk_locale')) {
      sessionStorage.setItem('rsdk_locale', `en_GB`);
      dayjs.locale('en');
    } else {
      const currentLang = sessionStorage.getItem('rsdk_locale')?.slice(0, 2).toLowerCase();
      dayjs.locale(currentLang);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = selectedLang;
  }, [selectedLang]);

  return (
    <nav id='hmrc-language-toggle' className='hmrc-language-select' aria-label='Language switcher'>
      <ul className='hmrc-language-select__list'>
        <li className='hmrc-language-select__list-item'>
          {selectedLang === 'en' ? (
            <span aria-current='true'>English</span>
          ) : (
            <a href='#' onClick={changeLanguage} lang='en' rel='alternate' className='govuk-link'>
              <span className='govuk-visually-hidden'>Change the language to English</span>
              <span aria-hidden='true'>English</span>
            </a>
          )}
        </li>
        <li className='hmrc-language-select__list-item'>
          {selectedLang === 'cy' ? (
            <span aria-current='true'>Cymraeg</span>
          ) : (
            <a href='#' onClick={changeLanguage} lang='cy' rel='alternate' className='govuk-link'>
              <span className='govuk-visually-hidden'>Newid yr iaith ir Gymraeg</span>
              <span aria-hidden='true'>Cymraeg</span>
            </a>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default LanguageToggle;
