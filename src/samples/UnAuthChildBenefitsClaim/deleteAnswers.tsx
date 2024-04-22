import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import MainWrapper from '../../components/BaseComponents/MainWrapper';
import Button from '../../components/BaseComponents/Button/Button';
import { useTranslation } from 'react-i18next';

export default function DeleteAnswers({ hasSessionTimedOut }) {
  const { t } = useTranslation();
  const history = useHistory();
  const redirectChoseClaim = () => {
    sessionStorage.removeItem('isRefreshFromDeleteScreen');
    sessionStorage.removeItem('hasSessionTimedOut');
    sessionStorage.removeItem('isTasklistClicked');
    history.push('/recently-claimed-child-benefit');
  };

  useEffect(() => {
    sessionStorage.removeItem('assignmentID');
    sessionStorage.setItem('isRefreshFromDeleteScreen', 'true');
  }, []);

  return (
    <MainWrapper>
      <h1 className='govuk-heading-l'>
        {sessionStorage.getItem('hasSessionTimedOut') === 'true' || !hasSessionTimedOut
          ? t('YOU_DELETED_YOUR_CLAIM')
          : t('FOR_YOUR_SECURITY_WE_DELETED_YOUR_CLAIM')}
      </h1>
      <Button onClick={redirectChoseClaim}>{t('START_CLAIM_AGAIN')}</Button>
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
