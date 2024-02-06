import React from 'react';
import PropTypes from 'prop-types';

export default function StaticPageErrorSummary(props) {
  return (
    <>
      <div className='govuk-error-summary' data-module='govuk-error-summary' tabIndex={-1}>
        <div role='alert'>
          <h2 className='govuk-error-summary__title'>There is a problem</h2>
          <div className='govuk-error-summary__body'>
            <ul className='govuk-list govuk-error-summary__list'>
              <li key='serviceType'>
                <a href={props.linkHref}>{props.errorSummary}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

StaticPageErrorSummary.propTypes = {
  linkHref: PropTypes.string,
  errorSummary: PropTypes.string
};
