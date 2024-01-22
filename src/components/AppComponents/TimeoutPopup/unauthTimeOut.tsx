import React from 'react';
import TimeoutPopup from '.';
import Button from '../../BaseComponents/Button/Button';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

export default function UnauthTimeOut({ show, modalId, primaryHandler, secondaryHandler }) {
  const { t } = useTranslation();

  return (
    <TimeoutPopup show={show} staySignedIn={primaryHandler} id={modalId}>
      <div>
        <h1 id='govuk-timeout-heading' className='govuk-heading-m push--top'>
          {t('FOR_YOUR_SECURITY')}
        </h1>
        <p className='govuk-body'>
          {t('WE_WILL_DELETE_YOUR_ANSWERS')}
          <span className='govuk-!-font-weight-bold'> {t('2_MINUTES')}.</span>
        </p>
        <div className='govuk-button-group govuk-!-padding-top-4'>
          <Button type='button' onClick={primaryHandler}>
            {t('CONTINUE_CLAIM')}
          </Button>

          <a id='modal-staysignin-btn' className='govuk-link' href='#' onClick={secondaryHandler}>
            {t('DELETE_YOUR_ANSWERS')}
          </a>
        </div>
      </div>
    </TimeoutPopup>
  );
}

UnauthTimeOut.propTypes = {
  show: PropTypes.bool,
  modalId: PropTypes.string,
  primaryHandler: PropTypes.func,
  secondaryHandler: PropTypes.func
};
