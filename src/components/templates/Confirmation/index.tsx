/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable no-nested-ternary */
import { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import React from 'react';
import { getToDoAssignments } from '../../FlowContainer/helpers';
import ToDo from '../../ToDo';
import Details from '../Details';
import { Button } from '@material-ui/core';

declare const PCore;

function Confirmation(props) {
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
    <Fragment>
      <h2>{props.showLabel ? props.label : ''}</h2>
      {showDetails ? <Details {...detailProps} /> : undefined}
      {showTasks ? (
        toDoList && toDoList.length > 0 ? (
          <ToDo
            {...todoProps}
            datasource={{ source: toDoList }}
            getPConnect={getPConnect}
            type={CONSTS.TODO}
            headerText='Open Tasks'
          />
        ) : undefined
      ) : undefined}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant='contained' color='primary' onClick={onConfirmViewClose}>
          Done
        </Button>
      </div>
    </Fragment>
  ) : toDoList && toDoList.length > 0 ? (
    <ToDo
      {...props}
      datasource={{ source: toDoList }}
      getPConnect={getPConnect}
      type={CONSTS.TODO}
      headerText='Tasks'
    />
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
