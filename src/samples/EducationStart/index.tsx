import React, { FunctionComponent, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import LandingPage from './LandingPage';
import ClaimPage from './ClaimPage';
import setPageTitle, { registerServiceName } from '../../components/helpers/setPageTitleHelpers';
import { getSdkConfig } from '@pega/auth/lib/sdk-auth-manager';
import AppHeader from './reuseables/AppHeader';
import MainWrapper from '../../components/BaseComponents/MainWrapper';
import AppFooter from '../../components/AppComponents/AppFooter';
import AppContext from './reuseables/AppContext';

const EducationStartCase: FunctionComponent<any> = () => {
  const [showLandingPage, setShowLandingPage] = useState<boolean>(true);
  const [shuttered, setShuttered] = useState(null);
  const [showLanguageToggle, setShowLanguageToggle] = useState(false);

  const { t } = useTranslation();
  registerServiceName(t('EDUCATION_START'));
  const landingPageProceedHandler = () => {
    // localStorage.setItem('showLandingPage', 'false');
    setShowLandingPage(false);
  };

  useEffect(() => {
    getSdkConfig().then(config => {
      setShowLanguageToggle(config?.educationStartConfig?.showLanguageToggle);
    });
  }, []);

  useEffect(() => {
    getSdkConfig().then(config => {
      if (config.educationStartConfig?.shutterService) {
        setShuttered(config.educationStartConfig.shutterService);
      } else {
        setShuttered(false);
      }
    });
  }, []);

  if (shuttered === null) {
    return null;
  } else if (shuttered) {
    setPageTitle();
    return (
      <>
        <AppHeader appname={t('EDUCATION_START')} hasLanguageToggle={false} />
        <div className='govuk-width-container'>
          <MainWrapper showPageNotWorkingLink={false}>
            <h1 className='govuk-heading-l'>Sorry, the service is unavailable</h1>
            <p className='govuk-body'>Try again later.</p>
            <p className='govuk-body'>
              You can return to{' '}
              <a className='govuk-link' href='https://www.gov.uk/child-benefit'>
                Child Benefit guidance
              </a>
              .
            </p>
          </MainWrapper>
        </div>
        <AppFooter />
      </>
    );
  } else {
    return (
      <AppContext.Provider value={{ appBacklinkProps: {}, showLanguageToggle }}>
        {showLandingPage ? (
          <LandingPage onProceedHandler={() => landingPageProceedHandler()} />
        ) : (
          <ClaimPage />
        )}
      </AppContext.Provider>
    );
  }
};
export default EducationStartCase;
