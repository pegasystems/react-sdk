import React, { useEffect, useCallback } from 'react';
import Modal from '../../BaseComponents/Modal/Modal';
import PropTypes from 'prop-types';

export default function TimeoutPopup({ show, id, staySignedIn, children }) {
  const staySignedInCallback = useCallback(
    event => {
      if (event.key === 'Escape') staySignedIn();
    },
    [staySignedIn]
  );

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

  return (
    <Modal show={show} id={id}>
      {children}
    </Modal>
  );
}

TimeoutPopup.propTypes = {
  show: PropTypes.bool,
  id: PropTypes.string,
  staySignedIn: PropTypes.func,
  children: PropTypes.node
};
