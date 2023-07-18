import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

declare const PCore: any;
const LanguageToggle = () => {
  const { i18n } = useTranslation();
  let lang = sessionStorage.getItem('rsdk_locale')?.substring(0, 2) || 'en';
  const [selectedLang, setSelectedLang] = useState(lang);
  // i18n.changeLanguage(lang);

  const changeLanguage = (e) => {
    e.preventDefault();
    lang = e.currentTarget.getAttribute('lang');
    setSelectedLang(lang);
    sessionStorage.setItem('rsdk_locale', `${lang}-GB`);
    i18n.changeLanguage(lang);
    PCore.getEnvironmentInfo().setLocale(`${lang}-GB`);
  };

  return (
    <nav id='hmrc-language-toggle' className='hmrc-language-select' aria-label='Language switcher'>
      <ul className='hmrc-language-select__list'>
        <li className='hmrc-language-select__list-item'>
          {selectedLang === 'en' ? (
            <span aria-current='true'>English</span>
          ) : (
            <a onClick={changeLanguage} lang='en' rel='alternate' className='govuk-link'>
              <span className='govuk-visually-hidden'>Change the language to English</span>
              <span aria-hidden='true'>English</span>
            </a>
          )}
        </li>
        <li className='hmrc-language-select__list-item'>
          {selectedLang === 'cy' ? (
            <span aria-current='true'>Cymraeg</span>
          ) : (
            <a onClick={changeLanguage} lang='cy' rel='alternate' className='govuk-link'>
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
