import React from 'react';
import PropTypes from 'prop-types';

export default function BackLink(props) {
  const { onClick, children, attributes } = props;

  return (
    <a href='#' onClick={onClick} {...attributes} className='govuk-back-link govuk-!-margin-top-0 govuk-!-margin-bottom-8'>
     Back {children}
    </a>
  );
}

BackLink.propTypes = {
  children: PropTypes.any,
  attributes: PropTypes.object,
  onClick: PropTypes.func
};
