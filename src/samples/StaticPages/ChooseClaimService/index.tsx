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

export default function RecentlyClaimedChildBenefit() {
  const { t } = useTranslation();
  const history = useHistory();
  const [errorMsg, setErrorMsg] = useState('');
  const errorHref = `#serviceType`;
  const lang = sessionStorage.getItem('rsdk_locale')?.substring(0, 2) || 'en';

  useEffect(() => {
    const setPageTitleTimeout = setTimeout(() => {
      clearInterval(setPageTitleTimeout);
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
      label: t('CHECK_PROGRESS_OF_SUBMITTED_CLAIM')
    },
    {
      value: 'viewmyproofofentitlement',
      label: t('VIEW_MY_PROOF_OF_ENTITLEMENT')
    },
    {
      value: 'restartyourpayments',
      label: t('RESTART_MY_PAYMENTS')
    },
    {
      value: 'stopyourpayments',
      label: t('STOP_MY_PAYMENTS')
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
        case 'viewmyproofofentitlement':
          window.location.assign(
            'https://www.tax.service.gov.uk/child-benefit/view-proof-entitlement'
          );
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
      setErrorMsg(t('SELECT_CHILD_BENEFIT_SERVICE'));
    }
  }
  return (
    <>
      <AppHeader appname={t('CLAIM_CHILD_BENEFIT')} hasLanguageToggle isPegaApp={false} />
      <div className='govuk-width-container'>
        <MainWrapper>
          <StaticPageErrorSummary errorSummary={errorMsg} linkHref={errorHref} />
          <form>
            <RadioButtons
              name='serviceType'
              displayInline={false}
              value=''
              useSmallRadios={false}
              options={radioOptions}
              label={t('WHICH_CHBS_DO_YOU_WANT_TO_USE')}
              legendIsHeading
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
