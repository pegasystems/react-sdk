import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
import MainWrapper from '../../components/BaseComponents/MainWrapper';
import Button from '../../components/BaseComponents/Button/Button';
import AppHeader from './reuseables/AppHeader';
import AppFooter from '../../components/AppComponents/AppFooter';
import useHMRCExternalLinks from '../../components/helpers/hooks/HMRCExternalLinks';
// import setPageTitle from '../../components/helpers/setPageTitleHelpers';
import AppContext from './reuseables/AppContext';
import { loginIfNecessary } from '@pega/auth/lib/sdk-auth-manager';
import { useStartMashup } from './reuseables/PegaSetup';
import { triggerLogout } from '../../components/helpers/utils';

export default function LandingPage(props) {
  const { onProceedHandler } = props;
  const { showLanguageToggle } = useContext(AppContext);

  const { hmrcURL } = useHMRCExternalLinks();
  const history = useHistory();
  const setAuthType = useState('gg')[1];

  const { operatorName } = useStartMashup(
    setAuthType,
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    doRedirectDone,
    { appBacklinkProps: {} }
  );

  const { t } = useTranslation();

  const onContinue = () => {
    onProceedHandler();
  };

  function doRedirectDone() {
    history.push('/education/start');
    // appName and mainRedirect params have to be same as earlier invocation
    loginIfNecessary({ appName: 'embedded', mainRedirect: true });
  }

  function handleSignout() {
    triggerLogout();
  }

  return (
    <>
      <AppHeader
        handleSignout={handleSignout}
        appname={t('EDUCATION_START')}
        hasLanguageToggle={showLanguageToggle}
        betafeedbackurl={`${hmrcURL}contact/beta-feedback?service=463&referrerUrl=${window.location}`}
      />
      <div className='govuk-width-container'>
        <MainWrapper>
          {/* <span className='govuk-caption-xl'>{operatorName}</span> */}
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
        </MainWrapper>
      </div>
      <AppFooter />
    </>
  );
}
