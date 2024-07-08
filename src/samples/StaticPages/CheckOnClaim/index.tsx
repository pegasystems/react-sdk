import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import AppHeader from '../../../components/AppComponents/AppHeader';
import AppFooter from '../../../components/AppComponents/AppFooter';
import { useTranslation } from 'react-i18next';
import MainWrapper from '../../../components/BaseComponents/MainWrapper';
import Button from '../../../components/BaseComponents/Button/Button';
import setPageTitle from '../../../components/helpers/setPageTitleHelpers';
import RadioButtons from '../../../components/BaseComponents/RadioButtons/RadioButtons';
import StaticPageErrorSummary from '../ErrorSummary';

export default function CheckOnClaim() {
  const { t } = useTranslation();
  const history = useHistory();
  const lang = sessionStorage.getItem('rsdk_locale')?.substring(0, 2) || 'en';
  const [errorMsg, setErrorMsg] = useState('');
  const errorHref = `#typeOfClaimCheck`;

  useEffect(() => {
    const setPageTitleInterval = setInterval(() => {
      clearInterval(setPageTitleInterval);
      setPageTitle();
    }, 500);
  }, [lang]);

  const radioOptions = [
    {
      value: 'viewmysavedorsubmittedclaims',
      label: t('VIEW_MY_SAVED_OR_SUBMITTED_CLAIMS')
    },
    {
      value: 'checkwhenicanexpectareply',
      label: t('CHECK_WHEN_I_CAN_EXPECT_A_REPLY')
    }
  ];

  function routeToService() {
    const selectedOption = document.querySelector('input[name="typeOfClaimCheck"]:checked');

    if (selectedOption) {
      const selectedOptionValue = selectedOption.getAttribute('value');

      switch (selectedOptionValue) {
        case 'viewmysavedorsubmittedclaims':
          window.location.assign('/');
          break;
        case 'checkwhenicanexpectareply':
          window.location.assign(
            'https://www.gov.uk/guidance/check-when-you-can-expect-a-reply-from-hmrc'
          );
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
        <Button
          variant='backlink'
          onClick={() => history.goBack()}
          key='CheckOnClaimBacklink'
          attributes={{ type: 'link' }}
        />
        <MainWrapper>
          <StaticPageErrorSummary errorSummary={errorMsg} linkHref={errorHref} />
          <form>
            <RadioButtons
              name='typeOfClaimCheck'
              displayInline={false}
              value=''
              useSmallRadios={false}
              options={radioOptions}
              label={t('HOW_DO_YOU_WANT_TO_CHECK_ON_YOUR_CLAIM')}
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
