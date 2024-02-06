import React, { useState } from 'react';
import AppHeader from '../../components/AppComponents/AppHeader';
import AppFooter from '../../components/AppComponents/AppFooter';
import Button from '../../components/BaseComponents/Button/Button';
import MainWrapper from '../../components/BaseComponents/MainWrapper';
import RadioButtons from '../../components/BaseComponents/RadioButtons/RadioButtons';
import '../../../assets/css/appStyles.scss';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function AreYouSureToContinueWoSignIn() {
  const [errorMsg, setErrorMsg] = useState('');
  const { t } = useTranslation();
  const history = useHistory();
  const radioOptions = [
    {
      value: 'yes',
      label: `${t('YES')} - ${t('I_WANT_TO_CONTINUE_WITHOUT_SIGN_IN')}`
    },
    {
      value: 'no',
      label: `${t('NO')} - ${t('I_WANT_TO_SIGN_IN')}`
    }
  ];

  function handleSubmit() {
    const selectedOption = document.querySelector(
      'input[name="areYouSureToContinueWoSignIn"]:checked'
    );
    if (selectedOption) {
      // todo - both yes and no redirection link to be confirmed - not mentioned explicitly in story
      const selectedOptionValue = selectedOption.getAttribute('value');
      if (selectedOptionValue === 'yes') {
        history.push('/ua');
      } else {
        window.location.href = 'https://www.access.service.gov.uk/login/signin/creds';
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
          {errorMsg && errorMsg.length > 0 && (
            <div className='govuk-error-summary' data-module='govuk-error-summary' tabIndex={-1}>
              <div role='alert'>
                <h2 className='govuk-error-summary__title'>There is a problem</h2>
                <div className='govuk-error-summary__body'>
                  <ul className='govuk-list govuk-error-summary__list'>
                    <li>
                      <a href='#areYouSureToContinueWoSignIn'>{errorMsg}</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
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
          <br />
        </MainWrapper>
      </div>
      <AppFooter />
    </>
  );
}
