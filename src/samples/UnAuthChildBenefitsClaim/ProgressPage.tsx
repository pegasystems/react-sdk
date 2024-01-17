import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../components/BaseComponents/Button/Button';
import useHMRCExternalLinks from '../../components/helpers/hooks/HMRCExternalLinks';
import setPageTitle from '../../components/helpers/setPageTitleHelpers';
import NotificationBanner from '../../components/BaseComponents/NotificationBanner/NotificationBanner';

const ProgressPage = (props: { onStart: any; showPortalBanner: any }) => {
  const { onStart, showPortalBanner } = props;
  const { t } = useTranslation();
  const { referrerURL, hmrcURL } = useHMRCExternalLinks();

  useEffect(() => {
    setPageTitle();
  }, []);

  return (
    <>
      <main
        className='govuk-main-wrapper govuk-main-wrapper--auto-spacing'
        id='main-content'
        role='main'
      >
        {showPortalBanner && (
          <NotificationBanner content={t('PORTAL_NOTIFICATION_BANNER_CONTENT')} />
        )}
        <div className='govuk-grid-row'>
          <div className='govuk-grid-column-two-thirds'>
            <h1 className='govuk-heading-l'>{t('CLAIM_CHILD_BENEFIT')}</h1>
            <h2 className='govuk-heading-l'>{t('CLAIM_INCOMPLETE')}</h2>
            <p className='govuk-body'>
              {t('YOU_HAVE_COMPLETED')}
              {t('OF_4_SECTIONS')}
            </p>
            <ol className='app-task-list'>
              <li>
                <ul className='gapp-task-list__items govuk-!-padding-left-0'>
                  <li className='app-task-list__item'>
                    <span className='gapp-task-list__task-name'>
                      <a
                        href='https://www.tax.service.gov.uk/ask-hmrc/chat/child-benefit'
                        className='govuk-link'
                        rel='noreferrer noopener'
                      >
                        {t('YOUR_DETAILS')}
                      </a>
                    </span>
                    <span className='hmrc-status-tag'>
                      <strong className='govuk-tag govuk-tag--grey'>{t('NOT_STARTED')}</strong>
                    </span>
                  </li>
                  <li className='app-task-list__item'>
                    <span className='gapp-task-list__task-name'>
                      <a
                        href='https://www.tax.service.gov.uk/ask-hmrc/chat/child-benefit'
                        className='govuk-link'
                        rel='noreferrer noopener'
                      >
                        {t('RELATIONSHIP_DETAILS')}
                      </a>
                    </span>
                    <span className='hmrc-status-tag'>
                      <strong className='govuk-tag govuk-tag--grey'>{t('CANNOT_START_YET')}</strong>
                    </span>
                  </li>
                  <li className='app-task-list__item'>
                    <span className='gapp-task-list__task-name'>
                      <a
                        href='https://www.tax.service.gov.uk/ask-hmrc/chat/child-benefit'
                        className='govuk-link'
                        rel='noreferrer noopener'
                      >
                        {t('CHILD_DETAILS')}
                      </a>
                    </span>
                    <span className='hmrc-status-tag'>
                      <strong className='govuk-tag govuk-tag--grey'>{t('CANNOT_START_YET')}</strong>
                    </span>
                  </li>
                  <li className='app-task-list__item'>
                    <span className='gapp-task-list__task-name'>
                      <a
                        href='https://www.tax.service.gov.uk/ask-hmrc/chat/child-benefit'
                        className='govuk-link'
                        rel='noreferrer noopener'
                      >
                        {t('INCOME_DETAILS')}
                      </a>
                    </span>
                    <span className='hmrc-status-tag'>
                      <strong className='govuk-tag govuk-tag--grey'>{t('CANNOT_START_YET')}</strong>
                    </span>
                  </li>
                </ul>
              </li>
            </ol>

            <Button variant='start' onClick={onStart}>
              {t('START_NOW')}
            </Button>

            <div className='govuk-!-margin-top-8'>
              <a
                lang='en'
                className='govuk-link hmrc-report-technical-issue '
                rel='noreferrer noopener'
                target='_blank'
                href={`${hmrcURL}contact/report-technical-problem?newTab=true&service=463&referrerUrl=${referrerURL}`}
              >
                {t('PAGE_NOT_WORKING_PROPERLY')} {t('OPENS_IN_NEW_TAB')}
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default ProgressPage;
