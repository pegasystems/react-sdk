import React from 'react';
import PropTypes from 'prop-types';

export default function Button(props) {
  const {
    disabled,
    variant,
    onClick,
    children,
    attributes
  } = props;

  if (variant === 'start') {
    return (
      <a
        href='#'
        role='button'
        draggable='false'
        className='govuk-button govuk-button--start'
        data-module='govuk-button'
        onClick={onClick}
      >
        {children}
        <svg
          className='govuk-button__start-icon'
          xmlns='http://www.w3.org/2000/svg'
          width='17.5'
          height='19'
          viewBox='0 0 33 40'
          aria-hidden='true'
          focusable='false'
        >
          <path fill='currentColor' d='M0 0h13l20 20-20 20H0l20-20z' />
        </svg>
      </a>
    );
  }

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
  onClick: PropTypes.func,
  attributes: PropTypes.object,
};
