import React from 'react';
import PropTypes from 'prop-types';
import '../../../../assets/css/appStyles.scss';

export default function Modal(props) {
  const { handleClose, show, children } = props;
  const showHideClassName = show
    ? 'govuk-!-display-block hmrc-timeout-dialog'
    : 'govuk-!-display-none';

  return (
    show && (
      <>
        <div className='hmrc-timeout-overlay'></div>
        <div className={showHideClassName} tabIndex={-1} role='dialog' aria-modal='true'>
          <section>
            <a
              className='govuk-link signout-modal'
              href='#'
              onClick={handleClose}

            >
              Close
            </a>
            {children}
          </section>
        </div>
      </>
    )
  );
}

Modal.propTypes = {
  show: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  handleClose: PropTypes.func
};
