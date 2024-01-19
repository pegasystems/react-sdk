import React from 'react';
import MainWrapper from '../../components/BaseComponents/MainWrapper';
import Button from '../../components/BaseComponents/Button/Button';

export default function DeleteAnswers({ hasSessionTimedOut }) {
  return (
    <MainWrapper>
      <h1 className='govuk-heading-l'>
        {hasSessionTimedOut
          ? 'For your security, we deleted your answers'
          : 'You deleted your answers'}
      </h1>
      <Button variant='start'>Start claim again</Button>
      <h2 className='govuk-heading-m'>Before you go</h2>
      <p className='govuk-body'>Your feedback helps us make our service better.</p>
      <p className='govuk-body'>
        <a
          href='https://www.staging.tax.service.gov.uk/contact/beta-feedback?service=463&referrerUrl=www.account.hmrc.gov.uk/child-benefit/make_a_claim
Prod Link: https://www.tax.service.gov.uk/contact/beta-feedback?service=463&referrerUrl=www.account.hmrc.gov.uk/child-benefit/make_a_claim'
          className='govuk-link'
          target='_blank'
          rel='noopener noreferrer'
        >
          Take our survey
        </a>{' '}
        to share your feedback on this service.
      </p>
    </MainWrapper>
  );
}
