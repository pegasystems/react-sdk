import React, { FunctionComponent, useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import LandingPage from './LandingPage';
import setPageTitle, { registerServiceName } from '../../components/helpers/setPageTitleHelpers';
import { getSdkConfig, loginIfNecessary } from '@pega/auth/lib/sdk-auth-manager';
import AppHeader from './reuseables/AppHeader';
import MainWrapper from '../../components/BaseComponents/MainWrapper';
import AppFooter from '../../components/AppComponents/AppFooter';
import AppContext from './reuseables/AppContext';
import { triggerLogout } from '../../components/helpers/utils';
import useHMRCExternalLinks from '../../components/helpers/hooks/HMRCExternalLinks';
import TimeoutPopup from '../../components/AppComponents/TimeoutPopup';
import ShutterServicePage from '../../components/AppComponents/ShutterServicePage';
import ServiceNotAvailable from '../../components/AppComponents/ServiceNotAvailable';
import LogoutPopup from '../../components/AppComponents/LogoutPopup';
import SummaryPage from '../../components/AppComponents/SummaryPage';
import {
  initTimeout,
  settingTimer,
  staySignedIn
} from '../../components/AppComponents/TimeoutPopup/timeOutUtils';
import { useStartMashup } from './reuseables/PegaSetup';
import { useHistory } from 'react-router-dom';

const EducationStartCase: FunctionComponent<any> = () => {
  const [showLandingPage, setShowLandingPage] = useState<boolean>(true);
  const [shuttered, setShuttered] = useState(null);

  const [shutterServicePage /* setShutterServicePage */] = useState(false);
  const [serviceNotAvailable /* setServiceNotAvailable */] = useState(false);
  const [pCoreReady, setPCoreReady] = useState(false);
  const { showLanguageToggle } = useContext(AppContext);
  const [showLanguageToggleState, setShowLanguageToggleState] = useState(showLanguageToggle);

  const setAuthType = useState('gg')[1];

  const [currentDisplay, setCurrentDisplay] = useState<
    'pegapage' | 'resolutionpage' | 'servicenotavailable' | 'shutterpage' | 'loading'
  >('pegapage');
  const [summaryPageContent, setSummaryPageContent] = useState<{
    content: string | null;
    title: string | null;
    banner: string | null;
  }>({ content: null, title: null, banner: null });

  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const [showSignoutModal, setShowSignoutModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { t } = useTranslation();
  const { hmrcURL } = useHMRCExternalLinks();
  const history = useHistory();

  registerServiceName(t('EDUCATION_START'));

  useEffect(() => {
    initTimeout(setShowTimeoutModal, false, true, false);
  }, []);

  function doRedirectDone() {
    history.push('/education/start');
    // appName and mainRedirect params have to be same as earlier invocation
    loginIfNecessary({ appName: 'embedded', mainRedirect: true });
    setIsLoggedIn(true);
  }

  const { showPega, setShowPega, showResolutionPage, caseId } = useStartMashup(
    setAuthType,
    doRedirectDone,
    { appBacklinkProps: {} }
  );

  useEffect(() => {
    if (showPega) {
      setCurrentDisplay('pegapage');
    } else if (showResolutionPage) {
      setCurrentDisplay('resolutionpage');
      getSdkConfig().then(config => {
        PCore.getRestClient()
          .invokeCustomRestApi(
            `${config.serverConfig.infinityRestServerUrl}/api/application/v2/cases/${caseId}?pageName=SubmissionSummary`,
            {
              method: 'GET',
              body: '',
              headers: '',
              withoutDefaultHeaders: false
            },
            ''
          )
          .then(response => {
            const summaryData = response.data.data.caseInfo.content;
            setSummaryPageContent({
              content: summaryData.SubmissionContent,
              title: summaryData.SubmissionTitle,
              banner: summaryData.SubmissionBanner
            });
          })
          .catch(() => {
            return false;
          });
      });
    } else if (shutterServicePage) {
      setCurrentDisplay('shutterpage');
    } else if (serviceNotAvailable) {
      setCurrentDisplay('servicenotavailable');
    } else {
      setCurrentDisplay('loading');
    }
    if (!showPega) {
      setPageTitle();
    }
  }, [showResolutionPage, showPega, shutterServicePage, serviceNotAvailable, pCoreReady]);

  function handleSignout() {
    if (currentDisplay === 'pegapage') {
      setShowSignoutModal(true);
    } else {
      triggerLogout();
    }
  }

  const handleStaySignIn = e => {
    e.preventDefault();
    setShowSignoutModal(false);
    // Extends manual signout popup 'stay signed in' to reset the automatic timeout timer also
    staySignedIn(setShowTimeoutModal, 'D_ClaimantSubmittedChBCases', null, null);
  };

  const startClaim = () => {
    setShowPega(true);
  };

  /* ***
   * Application specific PCore subscriptions
   *
   * TODO Can this be made into a tidy helper? including its own clean up? A custom hook perhaps
   */
  
  // TODO - This function will be removed with US-13518 implementation.
  function removeHmrcLink() {
    const hmrcLink = document.querySelector(
      '[href="https://www.tax.service.gov.uk/ask-hmrc/chat/child-benefit"]'
    );    
    const breakTag = document.querySelectorAll('br');

    if (hmrcLink || breakTag.length) {
      hmrcLink?.remove();
      breakTag[0]?.remove();
      breakTag[1]?.remove();
    } else {
      requestAnimationFrame(removeHmrcLink);
    }
  }

  // And clean up
  useEffect(() => {
    if (showPega && pCoreReady) {
      PCore.getMashupApi().createCase('HMRC-ChB-Work-EducationStart', PCore.getConstants().APP.APP);
      requestAnimationFrame(removeHmrcLink);  // TODO - To be removed with US-13518 implementation.
    }
  }, [pCoreReady, showPega]);

  useEffect(() => {
    document.addEventListener('SdkConstellationReady', () => {
      PCore.onPCoreReady(() => {
        if (!pCoreReady) {
          setPCoreReady(true);
          PCore.getPubSubUtils().subscribe(
            PCore.getConstants().PUB_SUB_EVENTS.CONTAINER_EVENTS.CLOSE_CONTAINER_ITEM,
            () => {
              // console.log("SUBEVENT!!! showStartPageOnCloseContainerItem")
              setShowPega(false);
            },
            'showStartPageOnCloseContainerItem'
          );
          // startClaim();
        }
      });
      settingTimer();
    });

    return () => {
      PCore.getPubSubUtils().unsubscribe(
        PCore.getConstants().PUB_SUB_EVENTS.CONTAINER_EVENTS.CLOSE_CONTAINER_ITEM,
        'showStartPageOnCloseContainerItem'
      );
    };
  }, []);

  /* ***
   * Application specific PCore subscriptions
   *
   * TODO Can this be made into a tidy helper? including its own clean up? A custom hook perhaps
   */
  document.addEventListener('SdkConstellationReady', () => {
    PCore.onPCoreReady(() => {
      PCore.getPubSubUtils().subscribe(
        PCore.getConstants().PUB_SUB_EVENTS.CONTAINER_EVENTS.CLOSE_CONTAINER_ITEM,
        () => {
          setShowPega(false);
        },
        'showStartPageOnCloseContainerItem'
      );
    });
    settingTimer();
    PCore.getStore().subscribe(() => staySignedIn(setShowTimeoutModal, '', null, true, false));
  });

  // And clean up

  useEffect(() => {
    return () => {
      PCore.getPubSubUtils().unsubscribe(
        PCore.getConstants().PUB_SUB_EVENTS.CONTAINER_EVENTS.CLOSE_CONTAINER_ITEM,
        'showStartPageOnCloseContainerItem'
      );
    };
  }, []);

  const landingPageProceedHandler = () => {
    setShowLandingPage(false);
    startClaim();
  };

  useEffect(() => {
    getSdkConfig().then(config => {
      setShowLanguageToggleState(config?.educationStartConfig?.showLanguageToggle);
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

  if (!isLoggedIn || shuttered === null) {
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
        <TimeoutPopup
          show={showTimeoutModal}
          staySignedinHandler={() =>
            staySignedIn(setShowTimeoutModal, 'D_ClaimantWorkAssignmentChBCases')
          }
          signoutHandler={triggerLogout}
          isAuthorised={false}
          signoutButtonText='Sign out'
          staySignedInButtonText='Stay signed in'
        >
          <h1 id='hmrc-timeout-heading' className='govuk-heading-m push--top'>
            You’re about to be signed out
          </h1>
          <p className='govuk-body hmrc-timeout-dialog__message' aria-hidden='true'>
            For your security, we will sign you out in{' '}
            <span id='hmrc-timeout-countdown' className='hmrc-timeout-dialog__countdown'>
              2 minutes
            </span>
            .
          </p>
        </TimeoutPopup>

        <AppHeader
          handleSignout={handleSignout}
          appname={t('EDUCATION_START')}
          hasLanguageToggle={showLanguageToggleState}
          isPegaApp={showPega}
          languageToggleCallback={
            () => {} /* toggleNotificationProcess(
          { en: 'SwitchLanguageToEnglish', cy: 'SwitchLanguageToWelsh' },
          assignmentPConn 
          ) */
          }
          betafeedbackurl={`${hmrcURL}contact/beta-feedback?service=claim-child-benefit-frontend&backUrl=/fill-online/claim-child-benefit/recently-claimed-child-benefit`}
        />

        <div className='govuk-width-container'>
          {shutterServicePage ? (
            <ShutterServicePage />
          ) : (
            <>
              <div id='pega-part-of-page'>
                <div id='pega-root' className='education-start'></div>
              </div>
              {showLandingPage && (
                <LandingPage onProceedHandler={() => landingPageProceedHandler()} />
              )}
              {serviceNotAvailable && <ServiceNotAvailable />}
              {currentDisplay === 'resolutionpage' && (
                <SummaryPage
                  summaryContent={summaryPageContent.content}
                  summaryTitle={summaryPageContent.title}
                  summaryBanner={summaryPageContent.banner}
                  backlinkProps={{}}
                />
              )}
            </>
          )}
        </div>
        <LogoutPopup
          show={showSignoutModal && !showTimeoutModal}
          hideModal={() => setShowSignoutModal(false)}
          handleSignoutModal={triggerLogout}
          handleStaySignIn={handleStaySignIn}
          staySignedInButtonText='Stay signed in'
          signoutButtonText='Sign out'
        >
          <h1 id='govuk-timeout-heading' className='govuk-heading-m push--top'>
            {t('YOU_ARE_ABOUT_TO_SIGN_OUT')}
          </h1>
          <p className='govuk-body'>If you sign out now, your progress will be lost.</p>
        </LogoutPopup>
        <AppFooter />
      </AppContext.Provider>
    );
  }
};
export default EducationStartCase;
