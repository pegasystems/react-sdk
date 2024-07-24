import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import setPageTitle from '../../components/helpers/setPageTitleHelpers';
import NotificationBanner from '../../components/BaseComponents/NotificationBanner/NotificationBanner';
import { getClaimsCaseId } from '../../components/helpers/utils';
import ClaimsList from './ClaimList';

export default function PortalPage(props) {
  const {
    showPortalBanner,
    children,
    inProgressClaims,
    submittedClaims,
    assignmentPConn,
    setShowLandingPage,
    setShowStartClaim,
    setShowPortalPageDefault
  } = props;
  const { t } = useTranslation();

  function showStartClaim(e) {
    e.preventDefault();
    setShowStartClaim(true);
    setShowPortalPageDefault(false);
  }

  useEffect(() => {
    setPageTitle();
  }, []);

  return (
    <>
      <main className='govuk-main-wrapper' id='main-content' role='main'>
        {showPortalBanner && (
          <NotificationBanner content={t('PORTAL_NOTIFICATION_BANNER_CONTENT')} />
        )}
        <div className='govuk-grid-row'>
          <div className='govuk-grid-column-two-thirds'>
            <h1 className='govuk-heading-xl'>{t('CHILD_BENEFIT_EXTENSION_REQUESTS')}</h1>
            <p className='govuk-body'>{t('VIEW_STATUS_OR_NOTIFY_CHANGES')}</p>
            <p className='govuk-body'>
              {t('YOUR_VIEW')}{' '}
              <a
                href='https://www.gov.uk/child-benefit-proof'
                target='_blank'
                className='govuk-link'
                rel='noopener noreferrer'
              >
                {' '}
                {t('PROOF_OF_ENTITLEMENT')} {t('OPENS_IN_NEW_TAB')}.
              </a>
            </p>
            <hr
              className='govuk-section-break govuk-section-break--l govuk-section-break--visible'
              aria-hidden
            ></hr>
          </div>
        </div>
        {inProgressClaims.length > 0 && (
          <div className='govuk-grid-row'>
            <div className='govuk-grid-column-two-thirds'>
              {children}
              <ClaimsList
                thePConn={assignmentPConn}
                cases={inProgressClaims}
                title={t('REQUESTS_IN_PROGRESS')}
                rowClickAction='OpenAssignment'
                caseId={getClaimsCaseId()}
                fieldType={t('CREATED_DATE')}
                setShowLandingPage={setShowLandingPage}
              />
            </div>
          </div>
        )}

        {submittedClaims.length > 0 && (
          <div className='govuk-grid-row'>
            <div className='govuk-grid-column-two-thirds'>
              {children}
              <ClaimsList
                thePConn={assignmentPConn}
                cases={submittedClaims}
                title={t('SUBMITTED_REQUESTS')}
                rowClickAction='OpenCase'
                caseId={getClaimsCaseId()}
                fieldType={t('SUBMITTED_DATE')}
                setShowLandingPage={setShowLandingPage}
              />
            </div>
          </div>
        )}

        <div className='govuk-grid-row'>
          <div className='govuk-grid-column-two-thirds'>
            <h2 className='govuk-heading-m'>{t('TELL_US_ABOUT_EDUCATION')}</h2>
            <p className='govuk-body'>
              {t('USE_THIS_SERVICE_TO_TELL_US')}{' '}
              <a
                href='#'
                className='govuk-link govuk-link--no-visited-state'
                rel='noopener noreferrer'
                onClick={showStartClaim}
              >
                {t('STARTING_NON_ADVANCED_EDUCATION')}
              </a>
            </p>
            <p className='govuk-body'>
              {t('MUST_TELL')}{' '}
              <a
                href='https://www.gov.uk/government/publications/child-benefit-child-left-approved-education-or-training-ch459'
                className='govuk-link'
                rel='noopener noreferrer'
                target='_blank'
              >
                {t('LEAVES_FULL_TIME_EDUCATION')} {t('OPENS_IN_NEW_TAB')}.
              </a>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
