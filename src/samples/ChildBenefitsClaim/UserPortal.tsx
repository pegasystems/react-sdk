import React from 'react';
import Button from '../../components/BaseComponents/Button/Button';
import { useTranslation } from 'react-i18next';

export default function UserPortal(props) {
  const { beginClaim, children } = props;
  const { t } = useTranslation();

  return (
    <>
    <main className="govuk-main-wrapper govuk-main-wrapper--l" id="main-content" role="main">
        <div className="govuk-grid-row">
          <div className='govuk-grid-column-two-thirds'>
            <h1 className='govuk-heading-xl'>{t('YOUR_CLAIM_APPLICATIONS')}</h1>
          </div>
          <div className='govuk-grid-column-two-thirds'>
            <p className='govuk-body'>{t('CLAIM_LISTING_DESCRIPTION')}</p>
            {children}
          </div>
          <div className='govuk-grid-column-one-third'>
            <span className='govuk-heading-m'> {t('ONLINE')}</span>
            <a
              href='https://www.tax.service.gov.uk/ask-hmrc/chat/child-benefit'
              className='govuk-link'
              rel='noreferrer noopener'
              target='_blank'
            >
              {t('ASK_HMRC_ONLINE')}
            </a>
            <Button
              attributes={{ className: 'govuk-!-margin-top-4' }}
              onClick={beginClaim}
              variant='start'
            >
              {t('BEGIN_NEW_CLAIM')}
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
