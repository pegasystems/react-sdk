import React, { useEffect, useCallback } from 'react';
import Modal from '../../BaseComponents/Modal/Modal';
import Button from '../../BaseComponents/Button/Button';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

export default function TimeoutPopup(props) {
  const { show, staySignedinHandler, signoutHandler, isAuthorised, isConfirmationPage, staySignedInButtonText, signoutButtonText, children } = props;
  const staySignedInCallback = useCallback(
    event => {
      if (event.key === 'Escape') staySignedinHandler();
    },
    [staySignedinHandler]
  );
  const { t } = useTranslation();

  useEffect(() => {
    if (show) {
      window.addEventListener('keydown', staySignedInCallback);
    } else {
      window.removeEventListener('keydown', staySignedInCallback);
    }
    return () => {
      window.removeEventListener('keydown', staySignedInCallback);
    };
  }, [show]);
  const unAuthTimeoutPopupContent = () => {
    return (
      <div>
        <h1 id='govuk-timeout-heading' className='govuk-heading-m push--top'>
          {t('FOR_YOUR_SECURITY')}
        </h1>

        <p className='govuk-body'>
          {t('WE_WILL_DELETE_YOUR_CLAIM')}
          <span className='govuk-!-font-weight-bold'> {t('2_MINUTES')}.</span>
        </p>

        <div className='govuk-button-group govuk-!-padding-top-4'>
          <Button type='button' onClick={staySignedinHandler}>
            {t('CONTINUE_CLAIM')}
          </Button>

          <a id='modal-staysignin-btn' className='govuk-link' href='#' onClick={signoutHandler}>
            {t('DELETE_YOUR_CLAIM')}
          </a>
        </div>
      </div>
    );
  };
  const unAuthTimeoutPopupContentForConfirmationPage = () => {
    return (
      <div>
        <h1 id='govuk-timeout-heading' className='govuk-heading-m push--top'>
          {t('FOR_YOUR_SECURITY')}
        </h1>

        <p className='govuk-body'>
          {t('AUTOMATICALLY_CLOSE_IN')}
          <span className='govuk-!-font-weight-bold'> {t('2_MINUTES')}.</span>
        </p>

        <div className='govuk-button-group govuk-!-padding-top-4'>
          <Button type='button' onClick={staySignedinHandler}>
            {t('STAY_ON_THIS_PAGE')}
          </Button>

          <a id='modal-staysignin-btn' className='govuk-link' href='#' onClick={signoutHandler}>
            {t('EXIT_THIS_PAGE')}
          </a>
        </div>
      </div>
    );
  };

  const renderUnAuthPopupContent = () => {
    return isConfirmationPage
      ? unAuthTimeoutPopupContentForConfirmationPage()
      : unAuthTimeoutPopupContent();
  };

  if(children){
    return <Modal show={show} id='timeout-popup'>
      <div>
        {children}
        <div className='govuk-button-group govuk-!-padding-top-4'>
          <Button type='button' onClick={staySignedinHandler}>
            {staySignedInButtonText}
          </Button>

          <a id='modal-signout-btn' className='govuk-link' href='#' onClick={signoutHandler}>
            {signoutButtonText}
          </a>
        </div>
      </div>  
    </Modal>  
  }

  return (
    <Modal show={show} id='timeout-popup'>
      {isAuthorised ? (
        <div>
          <h1 id='govuk-timeout-heading' className='govuk-heading-m push--top'>
            {t('YOU_ARE_ABOUT_TO_SIGN_OUT')}
          </h1>
          <p className='govuk-body'>
            {t('FOR_YOUR_SECURITY_WE_WILL_SIGN_YOU_OUT')}{' '}
            <span className='govuk-!-font-weight-bold'>{t('2_MINUTES')}</span>
          </p>
          <div className='govuk-button-group govuk-!-padding-top-4'>
            <Button type='button' onClick={staySignedinHandler}>
              {t('STAY_SIGNED_IN')}
            </Button>

            <a id='modal-staysignin-btn' className='govuk-link' href='#' onClick={signoutHandler}>
              {t('SIGN-OUT')}
            </a>
          </div>
        </div>
      ) : (
        renderUnAuthPopupContent()
      )}
    </Modal>
  );
}

TimeoutPopup.propTypes = {
  show: PropTypes.bool,
  staySignedinHandler: PropTypes.func,
  signoutHandler: PropTypes.func,
  isAuthorised: PropTypes.bool,
  staySignedInButtonText: PropTypes.string,
  signoutButtonText: PropTypes.string,
  children: PropTypes.any,
  isConfirmationPage: PropTypes.bool
};
