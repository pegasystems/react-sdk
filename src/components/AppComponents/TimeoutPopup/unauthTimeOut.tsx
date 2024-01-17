import React from 'react';
import TimeoutPopup from '.';
import Button from '../../BaseComponents/Button/Button';
// import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

export default function UnauthTimeOut({ show, modalId, primaryHandler, secondaryHandler }) {
  // Welsh translation to be added later, not part of story
  //   const { t } = useTranslation();

  return (
    <TimeoutPopup show={show} handleClose={() => {}} staySignedIn={primaryHandler} id={modalId}>
      <div>
        <h1 id='govuk-timeout-heading' className='govuk-heading-m push--top'>
          For your security
        </h1>
        <p className='govuk-body'>
          We will delete your answers in
          <span className='govuk-!-font-weight-bold'> 2 minutes.</span>
        </p>
        <div className='govuk-button-group govuk-!-padding-top-4'>
          <Button type='button' onClick={primaryHandler}>
            Continue claim
          </Button>

          <a id='modal-staysignin-btn' className='govuk-link' href='#' onClick={secondaryHandler}>
            Delete your answers
          </a>
        </div>
      </div>
    </TimeoutPopup>
  );
}

UnauthTimeOut.propTypes = {
  show: PropTypes.bool,
  primaryHandler: PropTypes.func,
  secondaryHandler: PropTypes.func
};
