import React from 'react';
import TimeoutPopup from '.';
import Button from '../../BaseComponents/Button/Button';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

export default function AuthTimeOut({ show, modalId, primaryHandler, secondaryHandler }) {
  const { t } = useTranslation();

  return (
    <TimeoutPopup show={show} staySignedIn={primaryHandler} id={modalId}>
      <div>
        <h1 id='govuk-timeout-heading' className='govuk-heading-m push--top'>
          {t('YOU_ARE_ABOUT_TO_SIGN_OUT')}
        </h1>
        <p className='govuk-body'>
          {t('FOR_YOUR_SECURITY_WE_WILL_SIGN_YOU_OUT')}{' '}
          <span className='govuk-!-font-weight-bold'>{t('2_MINUTES')}</span>
        </p>
        <div className='govuk-button-group govuk-!-padding-top-4'>
          <Button type='button' onClick={primaryHandler}>
            {t('STAY_SIGNED_IN')}
          </Button>

          <a id='modal-staysignin-btn' className='govuk-link' href='#' onClick={secondaryHandler}>
            {t('SIGN-OUT')}
          </a>
        </div>
      </div>
    </TimeoutPopup>
  );
}

AuthTimeOut.propTypes = {
  show: PropTypes.bool,
  modalId: PropTypes.string,
  primaryHandler: PropTypes.func,
  secondaryHandler: PropTypes.func
};
