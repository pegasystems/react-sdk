import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from '@material-ui/lab';

const SEVERITY_MAP = {
  urgent: 'error',
  warning: 'warning',
  success: 'success',
  info: 'info'
};

export default function AlertBanner(props) {
  const { id, variant, messages, onDismiss } = props;
  let additionalProps = {};

  if (onDismiss) {
    additionalProps = {
      onClose: onDismiss
    };
  }

  return (
    <div id={id}>
      {messages.map(message => (
        <Alert
          key={message}
          variant='outlined'
          severity={SEVERITY_MAP[variant]}
          {...additionalProps}
        >
          {message}
        </Alert>
      ))}
    </div>
  );
}

AlertBanner.propTypes = {
  id: PropTypes.string,
  variant: PropTypes.string,
  messages: PropTypes.arrayOf(PropTypes.string),
  onDismiss: PropTypes.any
};
