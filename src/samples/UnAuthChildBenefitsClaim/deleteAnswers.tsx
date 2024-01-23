import React from 'react';
import MainWrapper from '../../components/BaseComponents/MainWrapper';
import Button from '../../components/BaseComponents/Button/Button';
import { useTranslation } from 'react-i18next';

export default function DeleteAnswers({ hasSessionTimedOut }) {
  const { t } = useTranslation();

  return (
    <MainWrapper>
      <h1 className='govuk-heading-l'>
        {hasSessionTimedOut
          ? t('FOR_YOUR_SECURITY_WE_DELETED_YOUR_ANSWERS')
          : t('YOU_DELETED_YOUR_ANSWERS')}
      </h1>
      <Button variant='start'>{t('START_CLAIM_AGAIN')}</Button>
      <h2 className='govuk-heading-m'>{t('BEFORE_YOU_GO')}</h2>
      <p className='govuk-body'>{t('YOUR_FEEDBACK_HELPS_US_MAKES_OUR_SERVICE_BETTER')}.</p>
      <p className='govuk-body'>
        <a
          href='https://www.staging.tax.service.gov.uk/contact/beta-feedback?service=463&referrerUrl=www.account.hmrc.gov.uk/child-benefit/make_a_claim
Prod Link: https://www.tax.service.gov.uk/contact/beta-feedback?service=463&referrerUrl=www.account.hmrc.gov.uk/child-benefit/make_a_claim'
          className='govuk-link'
          target='_blank'
          rel='noopener noreferrer'
        >
          {t('TAKE_OUR_SURVEY')}
        </a>{' '}
        {t('TO_SHARE_YOUR_FEEDBACK_ON_THIS_SERVICE')}.
      </p>
    </MainWrapper>
  );
}
