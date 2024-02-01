import React from 'react';
import { useHistory } from 'react-router-dom';
import AppHeader from '../../../components/AppComponents/AppHeader';
import AppFooter from '../../../components/AppComponents/AppFooter';
import { Switch, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useHMRCExternalLinks from '../../../components/helpers/hooks/HMRCExternalLinks';
import MainWrapper from '../../../components/BaseComponents/MainWrapper';
import RadioButtons from '../../../components/BaseComponents/RadioButtons/RadioButtons';
import Button from '../../../components/BaseComponents/Button/Button';
import Accessibility from '../../ChildBenefitsClaim/AccessibilityPage';

export default function ChooseClaimService() {
  const { t } = useTranslation();
  let history = useHistory();
  // const form = document.getElementById('choose-claim-service');
  // form.addEventListener('submit', submitForm);

  const radioOptions = [
    {
      value: 'makeanewclaim',
      label: 'Make a new claim'
    },
    {
      value: 'addchildtoexistingclaim',
      label: 'Add a child to an existing claim'
    },
    {
      value: 'checkonprogressofclaim',
      label: 'Check on the progress of a claim'
    },
    {
      value: 'restartyourpayments',
      label: 'Restart your payments (without adding a child to an existing claim)'
    },
    {
      value: 'stopyourpayments',
      label: 'Stop your payments (without adding a child to an existing claim)'
    }
  ];

  function clicked() {
    var selected = document.querySelector('input[name="serviceType"]:checked');
    if (selected) {
      console.log(selected.getAttribute('value'));
      if (selected.getAttribute('value') === 'makeanewclaim') {
        console.log('hello');
        history.push('/accessibility');
      }
    } else {
      console.log('No button selected.');
    }
  }
  return (
    <>
      <AppHeader appname={t('CLAIM_CHILD_BENEFIT')} hasLanguageToggle isPegaApp={false} />
      <div className='govuk-width-container'>
        <Button
          variant='backlink'
          onClick={() => history.goBack()}
          key='ChooseClaimBacklink'
          attributes={{ type: 'link' }}
        />
        <MainWrapper isStatic={true}>
          <RadioButtons
            name='serviceType'
            displayInline={false}
            value=''
            useSmallRadios={false}
            options={radioOptions}
            label='Make sure you’re using the right Child Benefit service'
            legendIsHeading={true}
            hintText='<p class="govuk-body">Confirm which service you want to use.</p>'
          ></RadioButtons>
          <button className='govuk-button' data-module='govuk-button' onClick={clicked}>
            Continue
          </button>
          <br></br>
          <br></br>
        </MainWrapper>
      </div>
      <AppFooter />
    </>
  );
}
