import React, { useState } from 'react';
import { Button, Grid2, IconButton, Snackbar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import type { PConnFieldProps } from '@pega/react-sdk-components/lib/types/PConnProps';
import './CancelAlert.css';

interface CancelAlertProps extends PConnFieldProps {
  // If any, enter additional props that only exist on CancelAlert here
  heading: string;
  content: string;
  itemKey: string;
  hideDelete: boolean;
  isDataObject: boolean;
  skipReleaseLockRequest: any;
  dismiss: Function;
}

export default function CancelAlert(props: CancelAlertProps) {
  const { heading, content, getPConnect, itemKey: containerItemID, hideDelete, isDataObject, skipReleaseLockRequest, dismiss } = props;
  const actionsAPI = getPConnect().getActionsApi();
  const containerManagerAPI = getPConnect().getContainerManager();
  const isLocalAction = getPConnect().getValue(PCore.getConstants().CASE_INFO.IS_LOCAL_ACTION);
  // @ts-ignore - Property 'options' is private and only accessible within class 'C11nEnv'.
  const isBulkAction = getPConnect()?.options?.isBulkAction;
  const localizedVal = PCore.getLocaleUtils().getLocaleValue;
  const broadCastUtils: any = PCore.getCoexistenceManager().getBroadcastUtils();
  const isReverseCoexistence = broadCastUtils.isReverseCoexistenceCaseLoaded();
  const localeCategory = 'ModalContainer';
  const btnIds = {
    SAVE_AND_CLOSE: 'saveAndClose',
    CONTINUE_WORKING: 'continueWorking',
    DELETE: 'delete'
  };

  const [buttonsState, setButtonsState] = useState({
    [btnIds.SAVE_AND_CLOSE]: false,
    [btnIds.DELETE]: false
  });

  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  function disableButton(id) {
    setButtonsState(prevState => ({
      ...prevState,
      [id]: true
    }));
  }

  function enableButton(id) {
    setButtonsState(prevState => ({
      ...prevState,
      [id]: false
    }));
  }

  function cancelHandler() {
    if (isReverseCoexistence) {
      dismiss(true);
      PCore.getPubSubUtils().publish(PCore.getConstants().PUB_SUB_EVENTS.REVERSE_COEXISTENCE_EVENTS.HANDLE_DISCARD);
    } else if (!isDataObject && !isLocalAction && !isBulkAction) {
      disableButton(btnIds.DELETE);
      actionsAPI
        .deleteCaseInCreateStage(containerItemID, hideDelete)
        .then(() => {
          PCore.getPubSubUtils().publish(PCore.getConstants().PUB_SUB_EVENTS.EVENT_CANCEL);
        })
        .catch(() => {
          setSnackbarMessage(localizedVal('Delete failed.', localeCategory));
          setShowSnackbar(true);
        })
        .finally(() => {
          enableButton(btnIds.DELETE);
          dismiss(true);
        });
    } else if (isLocalAction) {
      dismiss(true);
      actionsAPI.cancelAssignment(containerItemID, false);
    } else if (isBulkAction) {
      dismiss(true);
      actionsAPI.cancelBulkAction(containerItemID);
    } else {
      dismiss(true);
      containerManagerAPI.removeContainerItem({ containerItemID, skipReleaseLockRequest });
    }
  }

  function handleSnackbarClose(event: React.SyntheticEvent<any> | Event, reason?: string) {
    if (reason === 'clickaway') {
      return;
    }
    setShowSnackbar(false);
  }

  const leftButton = (
    <Button
      name={btnIds.CONTINUE_WORKING}
      variant='contained'
      color='secondary'
      onClick={() => {
        dismiss();
        if (isReverseCoexistence) {
          broadCastUtils.setCallBackFunction(null);
          broadCastUtils.setIsDirtyDialogActive(false);
        }
      }}
    >
      {localizedVal('Go back', localeCategory)}
    </Button>
  );

  const rightButton = (
    <Button name={btnIds.DELETE} variant='contained' color='primary' disabled={buttonsState[btnIds.DELETE]} onClick={cancelHandler}>
      {localizedVal('Discard', localeCategory)}
    </Button>
  );

  return (
    <>
      <div className='cancel-alert-background'>
        <div className='cancel-alert-top'>
          <h3>{localizedVal(heading, localeCategory)}</h3>
          <div>
            <p>{localizedVal(content, localeCategory)}</p>
          </div>
          <div className='action-controls'>
            <Grid2 container spacing={4} justifyContent='space-between'>
              <Grid2>{leftButton}</Grid2>
              <Grid2>{rightButton}</Grid2>
            </Grid2>
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
}
