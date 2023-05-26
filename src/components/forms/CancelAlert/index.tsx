import React, { useState } from 'react';
import { Button, Grid, IconButton, Snackbar } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import './cancel-alert.css';

declare const PCore;

const CancelAlert = props => {
  const { pConn, updateAlertState } = props;
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const itemKey = pConn.getContextName();
  const caseInfo = pConn.getCaseInfo();
  const caseName = caseInfo.getName();
  const ID = caseInfo.getID();
  const localizedVal = PCore.getLocaleUtils().getLocaleValue;
  const localeCategory = 'ModalContainer';

  function showToast(message: string) {
    setSnackbarMessage(message);
    setShowSnackbar(true);
  }

  const dismissCancelAlertOnly = () => {
    updateAlertState(true);
  };

  const dismissModal = () => {
    updateAlertState(false);
  };

  function handleSnackbarClose(event: React.SyntheticEvent | React.MouseEvent, reason?: string) {
    if (reason === 'clickaway') {
      return;
    }
    setShowSnackbar(false);
  }

  const buttonClick = action => {
    const actionsAPI = pConn.getActionsApi();

    switch (action) {
      case 'save':
        // eslint-disable-next-line no-case-declarations
        const savePromise = actionsAPI.saveAndClose(itemKey);

        savePromise
          .then(() => {
            dismissModal();

            PCore.getPubSubUtils().publish(
              PCore.getConstants().PUB_SUB_EVENTS.CASE_EVENTS.CASE_CREATED
            );
          })
          .catch(() => {
            showToast(localizedVal('Save failed', localeCategory));
          });
        break;

      case 'continue':
        dismissCancelAlertOnly();
        break;

      case 'delete':
        // eslint-disable-next-line no-case-declarations
        const deletePromise = actionsAPI.deleteCaseInCreateStage(itemKey);

        deletePromise
          .then(() => {
            dismissModal();
            PCore.getPubSubUtils().publish(PCore.getConstants().PUB_SUB_EVENTS.EVENT_CANCEL);
          })
          .catch(() => {
            showToast(localizedVal('Delete failed.', localeCategory));
          });
        break;

      default:
        break;
    }
  };

  return (
    <>
      <div className='cancel-alert-background'>
        <div className='cancel-alert-top'>
          <h3>{`Delete ${caseName}(${ID})`}</h3>
          <div>
            <p>{`${localizedVal(
              'Are you sure you want to delete',
              localeCategory
            )} ${caseName} (${ID})?`}</p>
            <p>
              {localizedVal(
                'Alternatively, you can continue working or save your work for later.',
                localeCategory
              )}
            </p>
          </div>
          <div className='action-controls'>
            <Grid container spacing={4} justifyContent='space-between'>
              <Grid item>
                <Button variant='outlined' color='primary' onClick={() => buttonClick('save')}>
                  {localizedVal('Save for later', localeCategory)}
                </Button>
              </Grid>
              <Grid item>
                <Button variant='outlined' color='primary' onClick={() => buttonClick('continue')}>
                  {localizedVal('Continue Working', localeCategory)}
                </Button>
                <Button variant='contained' color='primary' onClick={() => buttonClick('delete')}>
                  {localizedVal('Delete', localeCategory)}
                </Button>
              </Grid>
            </Grid>
          </div>
        </div>
      </div>
      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        action={
          <IconButton size='small' aria-label='close' color='inherit' onClick={handleSnackbarClose}>
            <CloseIcon fontSize='small' />
          </IconButton>
        }
      />
    </>
  );
};

export default CancelAlert;
