import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import AppHeader from '../../../components/AppComponents/AppHeader';
import AppFooter from '../../../components/AppComponents/AppFooter';
import { useTranslation } from 'react-i18next';
import MainWrapper from '../../../components/BaseComponents/MainWrapper';
import Button from '../../../components/BaseComponents/Button/Button';
import setPageTitle from '../../../components/helpers/setPageTitleHelpers';

export default function CheckOnClaim() {
  const { t } = useTranslation();
  const history = useHistory();
  const lang = sessionStorage.getItem('rsdk_locale')?.substring(0, 2) || 'en';
  useEffect(() => {
    const setPageTitleInterval = setInterval(() => {
      clearInterval(setPageTitleInterval);
      setPageTitle();
    }, 500);
  }, [lang]);

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
          <h1 className='govuk-heading-xl'>{t('CHECK_PROGRESS_CHB')}</h1>
          <p className='govuk-body'>
            {t('YOU_CAN_ALSO')}
            <a
              className='govuk-link '
              target='_blank'
              rel='noopener noreferrer'
              href='https://www.gov.uk/guidance/check-when-you-can-expect-a-reply-from-hmrc'
            >
              {t('CHECK_CLAIM_REPLY')}
            </a>
          </p>
          <p className='govuk-body'>
            {t('CHECK_CLAIM_APPROVED')}
            <a
              className='govuk-link '
              target='_blank'
              rel='noopener noreferrer'
              href='https://www.tax.service.gov.uk/child-benefit/view-proof-entitlement'
            >
              {t('YOU_NEED_TO_SIGN_IN_TO_ACCESS_INFO')}
            </a>
          </p>
          <br></br>
        </MainWrapper>
      </div>
      <AppFooter />
    </>
  );
}
