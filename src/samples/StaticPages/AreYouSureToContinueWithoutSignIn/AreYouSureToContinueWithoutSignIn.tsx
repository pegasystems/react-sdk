import React, { useState, useEffect } from 'react';
import AppHeader from '../../../components/AppComponents/AppHeader';
import AppFooter from '../../../components/AppComponents/AppFooter';
import Button from '../../../components/BaseComponents/Button/Button';
import MainWrapper from '../../../components/BaseComponents/MainWrapper';
import RadioButtons from '../../../components/BaseComponents/RadioButtons/RadioButtons';
import StaticPageErrorSummary from '../ErrorSummary';
import '../../../../assets/css/appStyles.scss';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import setPageTitle from '../../../components/helpers/setPageTitleHelpers';
import { getSdkConfig } from '@pega/react-sdk-components/lib/components/helpers/config_access';

export default function AreYouSureToContinueWithoutSignIn() {
  const [errorMsg, setErrorMsg] = useState('');
  const { t } = useTranslation();
  const history = useHistory();
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
      value: 'yes',
      label: `${t('YES')}, ${t('I_WANT_TO_CONTINUE_WITHOUT_SIGN_IN')}`
    },
    {
      value: 'no',
      label: `${t('NO')}, ${t('I_WANT_TO_SIGN_IN')}`
    }
  ];

  function handleSubmit() {
    const selectedOption = document.querySelector(
      'input[name="areYouSureToContinueWoSignIn"]:checked'
    );
    if (selectedOption) {
      const selectedOptionValue = selectedOption.getAttribute('value');
      if (selectedOptionValue === 'yes') {
        getSdkConfig().then(sdkConfig => {
          if (sdkConfig?.isUnauthRouteToPega) {
            history.push('/ua');
          } else {
            window.location.assign(
              'https://www.tax.service.gov.uk/fill-online/claim-child-benefit/task-list'
            );
          }
        });
      } else {
        history.push('/');
      }
    } else {
      setErrorMsg(t('SELECT_YES_IF_YOU_WANT_TO_CONTINUE_WO_SIGN_IN'));
    }
  }

  return (
    <>
      <AppHeader appname={t('CLAIM_CHILD_BENEFIT')} hasLanguageToggle isPegaApp={false} />
      <div className='govuk-width-container'>
        <Button
          variant='backlink'
          onClick={() => history.goBack()}
          key='areYouSureToContinueWoSignInBacklink'
          attributes={{ type: 'link' }}
        />
        <MainWrapper>
          <StaticPageErrorSummary
            errorSummary={errorMsg}
            linkHref='#areYouSureToContinueWoSignIn'
          />
          <form>
            <RadioButtons
              name='areYouSureToContinueWoSignIn'
              displayInline
              value=''
              useSmallRadios
              options={radioOptions}
              label={t('ARE_YOU_SURE_YOU_WANT_TO_CONTINUE_WO_SIGN_IN')}
              legendIsHeading
              errorText={errorMsg}
            ></RadioButtons>
            <button
              className='govuk-button'
              data-module='govuk-button'
              onClick={handleSubmit}
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
