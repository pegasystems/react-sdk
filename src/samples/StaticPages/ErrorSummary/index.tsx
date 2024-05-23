import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

export default function StaticPageErrorSummary({ errorSummary, linkHref }) {
  const { t } = useTranslation();
  return (
    <>
      <>
        {errorSummary && errorSummary.length > 0 ? (
          <div className='govuk-error-summary' data-module='govuk-error-summary' tabIndex={-1}>
            <div role='alert'>
              <h2 className='govuk-error-summary__title'>{t('THERE_IS_A_PROBLEM')}</h2>
              <div className='govuk-error-summary__body'>
                <ul className='govuk-list govuk-error-summary__list'>
                  <li key='error-summary'>
                    <a href={linkHref}>{errorSummary}</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ) : null}
      </>
    </>
  );
}

StaticPageErrorSummary.propTypes = {
  linkHref: PropTypes.string,
  errorSummary: PropTypes.string
};
