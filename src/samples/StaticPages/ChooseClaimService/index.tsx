import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import AppHeader from '../../../components/AppComponents/AppHeader';
import AppFooter from '../../../components/AppComponents/AppFooter';
import { useTranslation } from 'react-i18next';
import MainWrapper from '../../../components/BaseComponents/MainWrapper';
import RadioButtons from '../../../components/BaseComponents/RadioButtons/RadioButtons';
import '../../../../assets/css/appStyles.scss';
import StaticPageErrorSummary from '../ErrorSummary';
import setPageTitle from '../../../components/helpers/setPageTitleHelpers';
import NotificationBanner from '../../../components/BaseComponents/NotificationBanner/NotificationBanner';

export default function RecentlyClaimedChildBenefit() {
  const { t } = useTranslation();
  const history = useHistory();
  const [errorMsg, setErrorMsg] = useState('');
  const errorHref = `#serviceType`;
  const lang = sessionStorage.getItem('rsdk_locale')?.substring(0, 2) || 'en';

  useEffect(() => {
    const setPageTitleInterval = setInterval(() => {
      clearInterval(setPageTitleInterval);
      if (errorMsg.length > 0) {
        setPageTitle(true);
      } else {
        setPageTitle();
      }
    }, 500);
  }, [errorMsg, lang]);

  const radioOptions = [
    {
      value: 'makeanewclaim',
      label: t('MAKE_A_NEW_CLAIM')
    },
    {
      value: 'addchildtoexistingclaim',
      label: t('ADD_CHILD_TO_EXISTING_CLAIM')
    },
    {
      value: 'checkonprogressofclaim',
      label: t('CHECK_PROGRESS_OF_CLAIM')
    },
    {
      value: 'restartyourpayments',
      label: t('RESTART_YOUR_PAYMENTS')
    },
    {
      value: 'stopyourpayments',
      label: t('STOP_YOUR_PAYMENTS')
    }
  ];

  function routeToService() {
    const selectedOption = document.querySelector('input[name="serviceType"]:checked');
    if (selectedOption) {
      const selectedOptionValue = selectedOption.getAttribute('value');
      switch (selectedOptionValue) {
        case 'makeanewclaim':
          history.push('/sign-in-to-government-gateway');
          break;
        case 'addchildtoexistingclaim':
          history.push('/sign-in-to-government-gateway');
          break;
        case 'checkonprogressofclaim':
          history.push('/check-on-claim');
          break;
        case 'restartyourpayments':
          window.location.assign(
            'https://www.gov.uk/child-benefit-tax-charge/restart-child-benefit'
          );
          break;
        case 'stopyourpayments':
          window.location.assign('https://www.gov.uk/child-benefit-tax-charge/stop-child-benefit');
          break;
        default:
          break;
      }
    } else {
      setErrorMsg(t('CONFIRM_YOUR_SERVICE'));
    }
  }
  return (
    <>
      <AppHeader appname={t('CLAIM_CHILD_BENEFIT')} hasLanguageToggle isPegaApp={false} />
      <div className='govuk-width-container'>
        <MainWrapper>
          <NotificationBanner content={t('IMPROVMENTS_TO_THIS_SERVICE_NOTIFICATION')} />
          <StaticPageErrorSummary errorSummary={errorMsg} linkHref={errorHref} />
          <form>
            <RadioButtons
              name='serviceType'
              displayInline={false}
              value=''
              useSmallRadios={false}
              options={radioOptions}
              label={t('MAKE_SURE_YOU_USE_RIGHT_CHBS')}
              legendIsHeading
              hintText={`${t('CONFIRM_YOUR_SERVICE')}`}
              errorText={errorMsg}
            ></RadioButtons>
            <button
              className='govuk-button'
              data-module='govuk-button'
              onClick={routeToService}
              type='button'
            >
              {t('CONTINUE')}
            </button>
          </form>
        </MainWrapper>
      </div>
      <AppFooter />
    </>
  );
}
