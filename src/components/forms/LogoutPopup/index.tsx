import React from 'react';
import PropTypes from 'prop-types';
import Modal from '../../BaseComponents/Modal/Modal';
import Button from '../../BaseComponents/Button/Button';

export default function LogoutPopup(props) {
  const { hideModal, handleSignoutModal, handleStaySignIn } = props;

  return (
    <Modal show={props.show} handleClose={hideModal}>
      <div>
        <h1 id='govuk-timeout-heading' className='govuk-heading-m push--top'>
          You’re about to signed out
        </h1>
        <p className='govuk-body' aria-hidden='true'>
          You still need to save your progress. If you sign out without saving, your progress will
          be lost.
        </p>
        <p className='govuk-body' aria-hidden='true'>
          To save your progress, select the &apos;Save and come back later&apos; link.
        </p>
        <div className='govuk-button-group govuk-!-padding-top-4'>
          <Button
            type="button"
            id='modal-signout-btn'
            attributes={{className:'govuk-button govuk-button--warning'}}
            onClick={handleSignoutModal}
          >
            Sign out
          </Button>

          <a id='modal-staysignin-btn' className='govuk-link ' href='#' onClick={handleStaySignIn}>
            Stay signed in
          </a>
        </div>
      </div>
    </Modal>
  );
}

LogoutPopup.propTypes = {
  show: PropTypes.bool,
  hideModal: PropTypes.func,
  handleSignoutModal: PropTypes.func,
  handleStaySignIn: PropTypes.func
};
