import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../components/BaseComponents/Button/Button';

export default function LandingPage(props) {
  const { onProceedHandler } = props;
  const { t } = useTranslation();

  const onContinue = () => {
    onProceedHandler();
  };

  return (
    <>
      <h1 className='govuk-heading-l'>{t('EDUCATION_START_H1')}</h1>
      <p className='govuk-body'>{t('EDUCATION_START_P1')}</p>
      <ul className='govuk-list govuk-list--bullet'>
        <li>{t('COURCES_1')}</li>
        <li>{t('COURCES_2')}</li>
        <li>{t('COURCES_3')}</li>
        <li>{t('COURCES_4')}</li>
        <li>{t('COURCES_5')}</li>
        <li>{t('COURCES_6')}</li>
        <li>{t('COURCES_7')}</li>
      </ul>
      <p className='govuk-body'>{t('EDUCATION_START_P2')}</p>
      <ul className='govuk-list govuk-list--bullet'>
        <li>{t('ELIGIBILITY_1')}</li>
        <li>{t('ELIGIBILITY_2')}</li>
        <li>{t('ELIGIBILITY_3')}</li>
        <li>{t('ELIGIBILITY_4')}</li>
      </ul>
      <p className='govuk-body'>{t('EDUCATION_START_P3')}</p>
      <p className='govuk-body'>{t('EDUCATION_START_P4')}</p>

      <Button id='continueToOptin' onClick={onContinue} variant='start'>
        {t('CONTINUE')}
      </Button>
      <br />
    </>
  );
}
