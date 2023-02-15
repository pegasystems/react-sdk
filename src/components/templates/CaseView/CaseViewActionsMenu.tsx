import React, { useState } from 'react';
import PropTypes from "prop-types";
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

export default function CaseViewActionsMenu(props) {
  const {getPConnect, availableActions, availableProcesses} = props;
  const thePConn = getPConnect();


  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const arMenuItems: Array<any> = [];


  function _actionMenuActionsClick(data) {

    const actionsAPI = thePConn.getActionsApi();
    const openLocalAction = actionsAPI.openLocalAction.bind(actionsAPI);

    openLocalAction( data.ID, { ...data, containerName: 'modal', type: 'express'});
    // after doing the action, close the menu...
    handleClose();

  }


  availableActions.forEach( (action) => {
    arMenuItems.push( <MenuItem key={action.ID} onClick={() => _actionMenuActionsClick(action)}>{action.name}</MenuItem> )
  });

  availableProcesses.forEach( (process) => {
    arMenuItems.push( <MenuItem onClick={handleClose}>{process.name}</MenuItem> )
  });


  return (
    <React.Fragment>
      <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
        Actions...
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {arMenuItems}
      </Menu>
    </React.Fragment>
  );
}

CaseViewActionsMenu.defaultProps = {
  availableActions: [],
  availableProcesses: []
}

CaseViewActionsMenu.propTypes = {
  getPConnect: PropTypes.func.isRequired,
  availableActions: PropTypes.arrayOf(PropTypes.object),
  availableProcesses: PropTypes.arrayOf(PropTypes.any)
};
