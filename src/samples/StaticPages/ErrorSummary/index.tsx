import React from 'react';
import PropTypes from 'prop-types';

export default function StaticPageErrorSummary({ errorSummary, linkHref }) {
  return (
    <>
      <>
        {errorSummary && errorSummary.length > 0 ? (
          <div className='govuk-error-summary' data-module='govuk-error-summary' tabIndex={-1}>
            <div role='alert'>
              <h2 className='govuk-error-summary__title'>There is a problem</h2>
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
