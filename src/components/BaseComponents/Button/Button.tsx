import React from 'react';
import PropTypes from 'prop-types';

export default function Button(props) {
  const {
    disabled,
    variant,
    onClick,
    children,
    type,
    ...attributes
  } = props;

  let buttonAttributes = {
    className: `govuk-button${variant === 'secondary' ? ' govuk-button--secondary' : ''} ${
      disabled ? ' govuk-button--disabled' : ''
    }`,
    'data-module': 'govuk-button',
    'data-prevent-double-click': true,
    ...attributes
  };

  if (disabled) {
    buttonAttributes = {
      'aria-disabled': true,
      disabled: 'disabled',
      ...buttonAttributes
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
  variant: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  type: PropTypes.string,
  onClick: PropTypes.func
};
