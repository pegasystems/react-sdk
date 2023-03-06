import React from 'react';
import PropTypes from 'prop-types';

export default function Button(props) {
  const {
    disabled,
    varient,
    onClick,
    children,
    type,
    ...attributes
  } = props;

  let buttonAttributes = {
    ...attributes,
    'data-module': 'govuk-button',
    'data-prevent-double-click': true,
    className: `govuk-button${varient === 'secondary' ? ' govuk-button--secondary' : ''} ${disabled ? ' govuk-button--disabled' : ''}`
  };

  if (disabled) {
    buttonAttributes = {
      ...buttonAttributes,
      'aria-disabled': true,
      disabled: 'disabled',
    };
  }

  return (
    // eslint-disable-next-line react/button-has-type
    <button {...buttonAttributes} onClick={onClick}>{children}</button>
  );
}

Button.propTypes = {
  name: PropTypes.string,
  disabled: PropTypes.bool,
  varient: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  type: PropTypes.string,
  onClick: PropTypes.func
};
