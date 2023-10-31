import React,{ useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

export default function Button(props) {
  const {
    disabled,
    id,
    variant,
    onClick,
    children,
    attributes = {}
  } = props;

  const { t } = useTranslation();
  const [pointerState, setPointerState] = useState<Object>({});

  if(!Object.prototype.hasOwnProperty.call(attributes, 'className')) {attributes.className=''};

  useEffect(()=>{
    // eslint-disable-next-line no-prototype-builtins
    if(pointerState.hasOwnProperty('pointerEvents')){
      setTimeout(() => setPointerState({}), 200);
    }
  },[pointerState])

  if (variant === 'start') {
    return (
      <a
        href='#'
        role='button'
        draggable='false'
        className={'govuk-button govuk-button--start'.concat(' ', attributes.className)}
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
  } else if (variant === 'link') {
    return (
      <div className='govuk-button-group'>
        <a {...attributes} className={'govuk-link'.concat(' ', attributes.className)} href='#' onClick={onClick} >
          {children}
        </a>
      </div>
    );
  } else if (variant === 'backlink') {
    return (
      <a
        href='#'
        style={pointerState}
        onClick={(e) => {
          setPointerState({pointerEvents: 'none'});
          onClick(e);
        }}
          
        {...attributes}
        className='govuk-back-link'
      >
        {t('BACK')}{children}
      </a>
    );
  }

  let buttonAttributes = {
    ...attributes,
    className: `govuk-button ${variant === 'secondary' ? ' govuk-button--secondary' : ''} ${
      disabled ? ' govuk-button--disabled' : ''
    }`.concat(' ', attributes.className),
    'data-module': 'govuk-button',
    'data-prevent-double-click': true
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
    <button {...buttonAttributes} onClick={onClick} id={id}>
      {children}
    </button>
  );
}

Button.propTypes = {
  id:PropTypes.string,
  name: PropTypes.string,
  disabled: PropTypes.bool,
  variant: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  type: PropTypes.string,
  onClick: PropTypes.func,
  attributes: PropTypes.object
};
