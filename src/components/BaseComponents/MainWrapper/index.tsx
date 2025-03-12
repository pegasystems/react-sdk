import React from 'react';
import useHMRCExternalLinks from '../../helpers/hooks/HMRCExternalLinks';
import { useTranslation } from 'react-i18next';

export default function MainWrapper({
  children,
  showPageNotWorkingLink = true,
  serviceParam = '463' // Default will be set to chb journey
}) {
  const { t } = useTranslation();
  const { hmrcURL } = useHMRCExternalLinks();

  const pageNotWorkingUrl = `${hmrcURL}contact/report-technical-problem?newTab=true&service=${serviceParam}&referrerUrl=${window.location}`;

  return (
    <main className='govuk-main-wrapper govuk-main-wrapper--l' id='main-content' role='main'>
      <div className='govuk-grid-row'>
        <div className='govuk-grid-column-two-thirds'>
          {children}
          {showPageNotWorkingLink && (
            <p className='govuk-body'>
              <a
                lang='en'
                className='govuk-link hmrc-report-technical-issue '
                rel='noreferrer noopener'
                target='_blank'
                href={pageNotWorkingUrl}
              >
                {t('PAGE_NOT_WORKING_PROPERLY')} {t('OPENS_IN_NEW_TAB')}
              </a>
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
