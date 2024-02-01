import React from 'react';
import AppHeader from '../../../components/AppComponents/AppHeader';
import AppFooter from '../../../components/AppComponents/AppFooter';
import { useTranslation } from 'react-i18next';
import useHMRCExternalLinks from '../../../components/helpers/hooks/HMRCExternalLinks';
import MainWrapper from '../../../components/BaseComponents/MainWrapper';

export default function ChooseClaimService() {
  const { t } = useTranslation();
  return (
    <>
      <AppHeader appname={t('CLAIM_CHILD_BENEFIT')} hasLanguageToggle isPegaApp={false} />
      <div className='govuk-width-container'>
        <a href='#' className='govuk-back-linMainWrapperink  js-visible'>
          Back
        </a>
        <MainWrapper>
          <form
            method='POST'
            action='/fill-online/claim-child-benefit/recently-claimed-child-benefit'
            autoComplete='off'
          >
            <input
              type='hidden'
              name='csrfToken'
              value='b4358e625c3b13f54c1adaeff9a6405214dd9fb3-1706717540406-dd6a305cf073e88c052e78c0'
            />
            <div className='govuk-form-group'>
              <fieldset className='govuk-fieldset' aria-describedby='serviceType-hint'>
                <legend className='govuk-fieldset__legend  govuk-fieldset__legend--xl'>
                  <h1 className='govuk-fieldset__heading'>
                    Make sure you’re using the right Child Benefit service
                  </h1>
                </legend>

                <div id='serviceType-hint' className='govuk-hint'>
                  <p className='govuk-body'>Confirm which service you want to use.</p>
                </div>

                <div className='govuk-radios' data-module='govuk-radios'>
                  <div className='govuk-radios__item'>
                    <input
                      className='govuk-radios__input'
                      id='serviceType'
                      name='serviceType'
                      type='radio'
                      value='newClaim'
                    />

                    <label className='govuk-label govuk-radios__label' htmlFor='serviceType'>
                      Make a new claim
                    </label>
                  </div>

                  <div className='govuk-radios__item'>
                    <input
                      className='govuk-radios__input'
                      id='serviceType-2'
                      name='serviceType'
                      type='radio'
                      value='addClaim'
                    />

                    <label className='govuk-label govuk-radios__label' htmlFor='serviceType-2'>
                      Add a child to an existing claim
                    </label>
                  </div>

                  <div className='govuk-radios__item'>
                    <input
                      className='govuk-radios__input'
                      id='serviceType-3'
                      name='serviceType'
                      type='radio'
                      value='checkClaim'
                    />

                    <label className='govuk-label govuk-radios__label' htmlFor='serviceType-3'>
                      Check on the progress of a claim
                    </label>
                  </div>
                  <div className='govuk-radios__item'>
                    <input
                      className='govuk-radios__input'
                      id='serviceType-4'
                      name='serviceType'
                      type='radio'
                      value='restartChildBenefit'
                    />
                    <label className='govuk-label govuk-radios__label' htmlFor='serviceType-4'>
                      Restart your payments (without adding a child to an existing claim)
                    </label>
                  </div>
                  <div className='govuk-radios__item'>
                    <input
                      className='govuk-radios__input'
                      id='serviceType-5'
                      name='serviceType'
                      type='radio'
                      value='stopChildBenefit'
                    />
                    <label className='govuk-label govuk-radios__label' htmlFor='serviceType-5'>
                      Stop your payments (without adding a child to an existing claim)
                    </label>
                  </div>
                </div>
              </fieldset>
            </div>
            <button className='govuk-button' data-module='govuk-button'>
              Continue
            </button>
          </form>
        </MainWrapper>
      </div>
      <AppFooter />
    </>
  );
}
