import React, { useEffect, useCallback, useReducer } from 'react';
import Modal from '../../BaseComponents/Modal/Modal';
import Button from '../../BaseComponents/Button/Button';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

export default function TimeoutPopup(props) {
  const {
    show,
    milisecondsTilSignout,
    staySignedinHandler,
    signoutHandler,
    isAuthorised,
    isConfirmationPage,
    staySignedInButtonText,
    signoutButtonText,
    children
  } = props;
  const staySignedInCallback = useCallback(
    event => {
      if (event.key === 'Escape') staySignedinHandler();
    },
    [staySignedinHandler]
  );
  const { t } = useTranslation();

  const initialTimeoutState = {
    countdownStart: false,
    timeRemaining: 60,
    screenReaderCountdown: ''
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case 'START_COUNTDOWN':
        return { ...state, countdownStart: action.payload };
      case 'UPDATE_TIME_REMAINING':
        return { ...state, timeRemaining: action.payload };
      case 'UPDATE_SCREEN_READER_COUNTDOWN':
        return { ...state, screenReaderCountdown: action.payload };
      default:
        return state;
    }
  };

  const [timeoutState, dispatch] = useReducer(reducer, initialTimeoutState);

  useEffect(() => {
    if (!show) {
      // Reset countdown and related states if show is false
      dispatch({ type: 'UPDATE_TIME_REMAINING', payload: 60 });
      dispatch({ type: 'UPDATE_SCREEN_READER_COUNTDOWN', payload: '' });
      dispatch({ type: 'START_COUNTDOWN', payload: false });
    } else {
      // Start the countdown only if show is true
      const milisecondsTilCountdown = milisecondsTilSignout - 60000;
      const countdownTimeout = setTimeout(() => {
        dispatch({ type: 'START_COUNTDOWN', payload: true });
      }, milisecondsTilCountdown);

      return () => {
        clearTimeout(countdownTimeout);
      };
    }
  }, [show]);

  useEffect(() => {
    if (timeoutState.countdownStart) {
      if (timeoutState.timeRemaining === 60) {
        dispatch({
          type: 'UPDATE_SCREEN_READER_COUNTDOWN',
          payload: `${t('FOR_YOUR_SECURITY_WE_WILL_SIGN_YOU_OUT')} ${t('1_MINUTE')}`
        });
      }

      if (timeoutState.timeRemaining === 0) return;

      const timeRemainingInterval = setInterval(() => {
        dispatch({ type: 'UPDATE_TIME_REMAINING', payload: timeoutState.timeRemaining - 1 });
      }, 1000);

      return () => clearInterval(timeRemainingInterval);
    }
  }, [timeoutState.countdownStart, timeoutState.timeRemaining]);

  useEffect(() => {
    if (timeoutState.timeRemaining < 60 && timeoutState.timeRemaining % 20 === 0) {
      dispatch({
        type: 'UPDATE_SCREEN_READER_COUNTDOWN',
        payload: `${t('FOR_YOUR_SECURITY_WE_WILL_SIGN_YOU_OUT')} ${timeoutState.timeRemaining} ${t(
          'SECONDS'
        )}`
      });
    }
  }, [timeoutState.timeRemaining]);

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

  const timeoutText = () => {
    let timeoutValue;

    if (timeoutState.countdownStart && timeoutState.timeRemaining === 60) {
      timeoutValue = `${t('1_MINUTE')}.`;
    } else if (timeoutState.countdownStart && timeoutState.timeRemaining < 60) {
      timeoutValue = `${timeoutState.timeRemaining} ${t('SECONDS')}.`;
    } else {
      timeoutValue = `${t('2_MINUTES')}.`;
    }

    return timeoutValue;
  };

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

  if (children) {
    return (
      <Modal show={show} id='timeout-popup'>
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
    );
  }

  return (
    <Modal show={show} id='timeout-popup'>
      {isAuthorised ? (
        <div>
          <h1 id='govuk-timeout-heading' className='govuk-heading-m push--top'>
            {t('YOURE_ABOUT_TO_BE_SIGNED_OUT')}
          </h1>
          <p className='govuk-body'>
            {`${t('FOR_YOUR_SECURITY_WE_WILL_SIGN_YOU_OUT')} `}
            <span className='govuk-!-font-weight-bold'>{timeoutText()}</span>
            {timeoutState.countdownStart && (
              <span className='govuk-visually-hidden' aria-live='polite'>
                {timeoutState.screenReaderCountdown}
              </span>
            )}
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
  milisecondsTilSignout: PropTypes.number,
  staySignedinHandler: PropTypes.func,
  signoutHandler: PropTypes.func,
  isAuthorised: PropTypes.bool,
  staySignedInButtonText: PropTypes.string,
  signoutButtonText: PropTypes.string,
  children: PropTypes.any,
  isConfirmationPage: PropTypes.bool
};
