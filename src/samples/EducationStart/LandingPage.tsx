import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '../../components/BaseComponents/Button/Button';
import MainWrapper from '../../components/BaseComponents/MainWrapper';
import AppContextEducation from './reuseables/AppContextEducation'; // TODO: Once this code exposed to common folder, we will remove this import from EducationStart

export default function LandingPage(props) {
  const { onProceedHandler } = props;
  const { t } = useTranslation();
  const history = useHistory();
  const { serviceParam } = useContext(AppContextEducation);

  return (
    <>
      <Button
        variant='backlink'
        onClick={() => history.goBack()} // Todo: this will be removed with portal story implementation
        key='StartPageBacklink'
        attributes={{ type: 'link' }}
      />
      <MainWrapper serviceParam={serviceParam}>
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

        <Button id='continueToOptin' onClick={onProceedHandler} variant='start'>
          {t('START_NOW')}
        </Button>
        <br />
      </MainWrapper>
    </>
  );
}
