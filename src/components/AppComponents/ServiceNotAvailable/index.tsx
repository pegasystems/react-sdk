import React from 'react';
import { useTranslation } from 'react-i18next';
import MainWrapper from '../../BaseComponents/MainWrapper';

export default function ServiceNotAvailable(props) {
  const { returnToPortalPage } = props;

  const { t } = useTranslation();
  return (
    <MainWrapper>
      <h1 className='govuk-heading-l'>{t('SERVICE_NOT_AVAILABLE')}</h1>
      <p className='govuk-body'>{t('COME_BACK_LATER')}</p>
      <a href='#' className='govuk-link ' onClick={returnToPortalPage}>
        {t('RETURN_TO_THE_HOMEPAGE')}
      </a>
      <br />
      <br />
    </MainWrapper>
  );
}
