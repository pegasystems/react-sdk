import React, {useEffect, useCallback} from 'react';
import Modal from '../../BaseComponents/Modal/Modal';
import Button from '../../BaseComponents/Button/Button';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

export default function TimeoutPopup(props){

    const {show, staySignedinHandler, signoutHandler} = props;
    const staySignedInCallback = useCallback((event) => {
        if(event.key === 'Escape') staySignedinHandler();
    }, [staySignedinHandler]);
    const { t } = useTranslation();   

    useEffect(() => {        
        if(show) {
            window.addEventListener('keydown', staySignedInCallback)
        }
        else {
            window.removeEventListener('keydown', staySignedInCallback);
        }
        return () => {window.removeEventListener("keydown", staySignedInCallback)}
    }, [show])

    return (
    <Modal show={show} id='timeout-popup'>
        <div>
            <h1 id='govuk-timeout-heading' className='govuk-heading-m push--top'>
                {t('YOU_ARE_ABOUT_TO_SIGN_OUT')}
            </h1>
            <p className='govuk-body'>
                {t('FOR_YOUR_SECURITY_WE_WILL_SIGN_YOU_OUT')} <span className="govuk-!-font-weight-bold">{t('2_MINUTES')}</span>
            </p>
            <div className='govuk-button-group govuk-!-padding-top-4'>
                <Button
                    type='button'
                    onClick={staySignedinHandler}
                >
                    {t('STAY_SIGNED_IN')}
                </Button>

                <a id='modal-staysignin-btn' className='govuk-link' href='#' onClick={signoutHandler}>
                {t('SIGN-OUT')}
                </a>
            </div>
        </div>
    </Modal>)
}


TimeoutPopup.propTypes = {
    show: PropTypes.bool,
    staySignedinHandler: PropTypes.func,
    signoutHandler: PropTypes.func
  };
  