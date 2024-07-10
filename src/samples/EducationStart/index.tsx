import React, { FunctionComponent, useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import LandingPage from './LandingPage';
import setPageTitle, { registerServiceName } from '../../components/helpers/setPageTitleHelpers';
import { getSdkConfig, loginIfNecessary } from '@pega/auth/lib/sdk-auth-manager';
import AppHeader from './reuseables/AppHeader';
import MainWrapper from '../../components/BaseComponents/MainWrapper';
import AppFooter from '../../components/AppComponents/AppFooter';
import AppContextEducation from './reuseables/AppContextEducation'; // TODO: Once this code exposed to common folder, we will refer AppContext from reuseable components
import { setAppServiceName, triggerLogout } from '../../components/helpers/utils';
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
import toggleNotificationProcess from '../../components/helpers/toggleNotificationLanguage';

const EducationStartCase: FunctionComponent<any> = () => {
  const educationStartParam = 'claim-child-benefit';
  const claimsListApi = 'D_ClaimantWorkAssignmentEdStartCases';

  const [showLandingPage, setShowLandingPage] = useState<boolean>(true);
  const [shuttered, setShuttered] = useState(null);

  const [pCoreReady, setPCoreReady] = useState(false);
  const { showLanguageToggle } = useContext(AppContextEducation);
  const [showLanguageToggleState, setShowLanguageToggleState] = useState(showLanguageToggle);

  const setAuthType = useState('gg')[1];

  const [currentDisplay, setCurrentDisplay] = useState<
    'pegapage' | 'resolutionpage' | 'servicenotavailable' | 'shutterpage' | 'loading'
  >('pegapage');

  const [summaryPageContent, setSummaryPageContent] = useState<any>({
    content: null,
    title: null,
    banner: null
  });

  const [showTimeoutModal, setShowTimeoutModal] = useState(false);
  const [showSignoutModal, setShowSignoutModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { t } = useTranslation();
  const { hmrcURL } = useHMRCExternalLinks();
  const history = useHistory();

  registerServiceName(t('EDUCATION_START'));
  setAppServiceName(t('EDUCATION_START'));


  useEffect(() => {
    initTimeout(setShowTimeoutModal, false, true, false);
  }, []);

  function doRedirectDone() {
    history.push('/education/start');
    // appName and mainRedirect params have to be same as earlier invocation
    loginIfNecessary({ appName: 'embedded', mainRedirect: true });
    setIsLoggedIn(true);
  }

  const { showPega, setShowPega, showResolutionPage, caseId, shutterServicePage, serviceNotAvailable, assignmentPConn } = useStartMashup(
    setAuthType,
    doRedirectDone,
    {
      appBacklinkProps: {},
      serviceParam: educationStartParam
    }
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
            PCore.getPubSubUtils().unsubscribe(
              'languageToggleTriggered',
              'summarypageLanguageChange'
            );
            const summaryData: Array<any> =
              response.data.data.caseInfo.content.ScreenContent.LocalisedContent;
            const currentLang =
              sessionStorage.getItem('rsdk_locale')?.slice(0, 2).toUpperCase() || 'EN';

            setSummaryPageContent(summaryData.find(data => data.Language === currentLang));

            PCore.getPubSubUtils().subscribe(
              'languageToggleTriggered',
              ({ language }) => {
                setSummaryPageContent(
                  summaryData.find(data => data.Language === language.toUpperCase())
                );
              },
              'summarypageLanguageChange'
            );
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
    staySignedIn(setShowTimeoutModal, claimsListApi, null, false, true, (currentDisplay === 'resolutionpage'));

  };

  function returnToPortalPage() {
    setShowSignoutModal(false);
    staySignedIn(setShowTimeoutModal, claimsListApi, null, false, true, (currentDisplay === 'resolutionpage'));
    setCurrentDisplay('loading');
    setShowLandingPage(true);
    PCore.getContainerUtils().closeContainerItem(
      PCore.getContainerUtils().getActiveContainerItemContext('app/primary'),
      { skipDirtyCheck: true }
    );
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
      requestAnimationFrame(removeHmrcLink); // TODO - To be removed with US-13518 implementation.
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

  const landingPageProceedHandler = e => {
    e.preventDefault();
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
  } else if (currentDisplay === 'servicenotavailable') {
    return (
      <>
        <AppHeader appname={t('EDUCATION_START')} />
        <div className='govuk-width-container'>
          <ServiceNotAvailable returnToPortalPage={returnToPortalPage} />
        </div>
        <AppFooter />
      </>
    );
  } else if (shuttered) {
    setPageTitle();
    return (
      <>
        <AppHeader appname={t('EDUCATION_START')} />
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
      <AppContextEducation.Provider
        value={{
          appBacklinkProps: {},
          showLanguageToggle,
          serviceParam: educationStartParam
        }}
      >
        <TimeoutPopup
          show={showTimeoutModal}
          staySignedinHandler={() =>
            staySignedIn(setShowTimeoutModal, claimsListApi, null, false, true, (currentDisplay === 'resolutionpage'))
          }
          signoutHandler={triggerLogout}
          isAuthorised={false}
          signoutButtonText='Sign out'
          staySignedInButtonText='Stay signed in'
        >
          <h1 id='hmrc-timeout-heading' className='govuk-heading-m push--top'>
            You’re about to be signed out
          </h1>            
          <p className='govuk-body hmrc-timeout-dialog__message'> {/* Todo Aria-hidden will be added back with US-13474 implementation */}
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
          languageToggleCallback= {
            toggleNotificationProcess(
          { en: 'SwitchLanguageToEnglish', cy: 'SwitchLanguageToWelsh' },
          assignmentPConn 
          ) 
          }
          betafeedbackurl={`${hmrcURL}contact/beta-feedback?service=claim-child-benefit-frontend&backUrl=/fill-online/claim-child-benefit/recently-claimed-child-benefit`}
        />
        <div className='govuk-width-container'>
          {currentDisplay === 'shutterpage' ? (
            <ShutterServicePage />
          ) : (
            <>
              <div id='pega-part-of-page'>
                <div id='pega-root' className='education-start'></div>
              </div>
              {showLandingPage && (
                <LandingPage onProceedHandler={e => landingPageProceedHandler(e)} />
              )}
              {currentDisplay === 'resolutionpage' && (
                <SummaryPage
                  summaryContent={summaryPageContent.Content}
                  summaryTitle={summaryPageContent.Title}
                  summaryBanner={summaryPageContent.Banner}
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
          <p className='govuk-body'>{t('YOU_STILL_NEED_TO_SAVE_YOUR_PROGRESS')}</p>
          <p className='govuk-body'>{t('TO_SAVE_YOUR_PROGRESS')}</p>
        </LogoutPopup>
        <AppFooter />
      </AppContextEducation.Provider>
    );
  }
};
export default EducationStartCase;
