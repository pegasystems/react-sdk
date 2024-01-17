import React from 'react';
import { useTranslation } from 'react-i18next';
import MainWrapper from '../../BaseComponents/MainWrapper';

export default function ShutterServicePage() {
  const { t } = useTranslation();
  return (
    <MainWrapper>
      <h1 className='govuk-heading-l'>{t('SHUTTER_SERVICE_UNAVAILABLE')}</h1>
      <p className='govuk-body'>{t('SHUTTER_USE_SERVICE_LATER_MESSAGE')}</p>
    </MainWrapper>
  );
}
