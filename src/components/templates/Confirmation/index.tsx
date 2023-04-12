/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable no-nested-ternary */
import { useState } from 'react';
import PropTypes from 'prop-types';
import React from 'react';
import { getToDoAssignments } from '../../FlowContainer/helpers';
import ToDo from '../../ToDo';
import Details from '../Details';
import { Button, Card, makeStyles } from '@material-ui/core';

declare const PCore;

const useStyles = makeStyles((theme) => ({
  root: {
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

function Confirmation(props) {
  const classes = useStyles();
  const CONSTS = PCore.getConstants();
  const [showConfirmView, setShowConfirmView] = useState(true);
  const { showTasks, getPConnect, datasource } = props;
  // Get the inherited props from the parent to determine label settings
  // Not using whatsNext at the moment, need to figure out the use of it
  const whatsNext = datasource?.source;
  const items = whatsNext.length > 0 ? whatsNext.map(item => item.label) : '';
  const activeContainerItemID = PCore.getContainerUtils().getActiveContainerItemName(
    getPConnect().getTarget()
  );
  const rootInfo = PCore.getContainerUtils().getContainerItemData(
    getPConnect().getTarget(),
    activeContainerItemID
  );
  const onConfirmViewClose = () => {
    setShowConfirmView(false);
    PCore.getPubSubUtils().publish(
      PCore.getConstants().PUB_SUB_EVENTS.CASE_EVENTS.CLOSE_CONFIRM_VIEW,
      rootInfo
    );
  };
  const todoProps = { ...props, renderTodoInConfirm: true };
  const toDoList = getToDoAssignments(getPConnect());
  const detailProps = { ...props, showLabel: false };
  const showDetails = detailProps?.children?.[0]?.props?.getPConnect()?.getChildren()?.length > 0;
  return showConfirmView ? (
    <Card className={classes.root}>
      <h2 id='confirm-label'>{props.showLabel ? props.label : ''}</h2>
      {showDetails ? <Details {...detailProps} /> : undefined}
      {showTasks ? (
        toDoList && toDoList.length > 0 ? (
          <ToDo
            {...todoProps}
            datasource={{ source: toDoList }}
            getPConnect={getPConnect}
            type={CONSTS.TODO}
            headerText='Open Tasks'
            isConfirm
          />
        ) : undefined
      ) : undefined}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant='contained' color='primary' onClick={onConfirmViewClose}>
          Done
        </Button>
      </div>
    </Card>
  ) : toDoList && toDoList.length > 0 ? (
    <Card className={classes.root}>
    <ToDo
      {...props}
      datasource={{ source: toDoList }}
      getPConnect={getPConnect}
      type={CONSTS.TODO}
      headerText='Tasks'
      isConfirm
    />
    </Card>
  ) : null;
}

Confirmation.defaultProps = {
  datasource: undefined,
  label: '',
  showLabel: true
};

Confirmation.propTypes = {
  getPConnect: PropTypes.func.isRequired,
  datasource: PropTypes.objectOf(PropTypes.any),
  label: PropTypes.string,
  showLabel: PropTypes.bool
};

export default Confirmation;
