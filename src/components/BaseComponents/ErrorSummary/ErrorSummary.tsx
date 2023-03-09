import React from 'react';
import PropTypes from 'prop-types';

export default function ErrorSummary(props) {
  const { messages } = props;

  return (
    <div className='govuk-error-summary' data-module='govuk-error-summary'>
      <div role='alert'>
        <h2 className='govuk-error-summary__title'>There is a problem</h2>
        <div className='govuk-error-summary__body'>
          <ul className='govuk-list govuk-error-summary__list'>
            <li>
              <a href='#full-name-input'>{messages}</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

ErrorSummary.propTypes = {
  messages: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
};
