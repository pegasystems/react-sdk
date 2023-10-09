import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import FocusTrap from 'focus-trap-react';
import '../../../../assets/css/appStyles.scss';

export default function Modal(props) {
  const { handleClose, show, children, id='modal-id'} = props;
  const showHideClassName = show
    ? 'govuk-!-display-block hmrc-timeout-dialog'
    : 'govuk-!-display-none';
  const { t } = useTranslation();

  useEffect(() => {
    if (show) {
      const a: any = document.getElementById(id);
      a.focus();
    }
  }, [show]);

  return (
    <>
    {show && (
      <>
        <div className='hmrc-timeout-overlay'></div>
        <FocusTrap>
          <div className={showHideClassName} tabIndex={-1} role='dialog' aria-modal='true' id={id}>
            <section>
              {children}
              {handleClose && <a className='govuk-link signout-modal' href='#' onClick={handleClose}>
                {t('Close')}
                <span className='govuk-visually-hidden'> {t('SIGN_OUT_MESSAGE')}</span>
              </a>}
            </section>
          </div>
        </FocusTrap>
      </>
    )}
  </>
  );
}

Modal.propTypes = {
  id: PropTypes.string,
  show: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  handleClose: PropTypes.func
};
