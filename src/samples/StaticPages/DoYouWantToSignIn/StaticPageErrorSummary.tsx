import React from 'react';

export default function StaticPageErrorSummary({ errorMessage, linkToFocus }) {
  return (
    <>
      {errorMessage && errorMessage.length > 0 ? (
        <div className='govuk-error-summary' data-module='govuk-error-summary' tabIndex={-1}>
          <div role='alert'>
            <h2 className='govuk-error-summary__title'>There is a problem</h2>
            <div className='govuk-error-summary__body'>
              <ul className='govuk-list govuk-error-summary__list'>
                <li>
                  <a href={linkToFocus}>{errorMessage}</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
