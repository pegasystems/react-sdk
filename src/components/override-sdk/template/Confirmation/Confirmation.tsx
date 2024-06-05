/* eslint-disable no-nested-ternary */
import { PropsWithChildren, useState } from 'react';
import { Button, Card, makeStyles } from '@material-ui/core';

import { getToDoAssignments } from '@pega/react-sdk-components/lib/components/infra/Containers/FlowContainer/helpers';
import { getComponentFromMap } from '@pega/react-sdk-components/lib/bridge/helpers/sdk_component_map';
import { PConnProps } from '@pega/react-sdk-components/lib/types/PConnProps';

interface ConfirmationProps extends PConnProps {
  // If any, enter additional props that only exist on this component
  datasource: { source: any };
  label: string;
  showLabel: boolean;
  showTasks: boolean;
}

const useStyles = makeStyles(theme => ({
  root: {
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    // paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  primaryButton: {
    padding: '0px 5px',
    background: '#CE2525',
    borderRadius: '100px',
    // margin: '0 auto',
    width: '119px',
    height: '40px',
    color: '#fff',
    textTransform: 'none'
  }
}));

export default function Confirmation(props: PropsWithChildren<ConfirmationProps>) {
  // Get emitted components from map (so we can get any override that may exist)
  const ToDo = getComponentFromMap('Todo'); // NOTE: ConstellationJS Engine uses "Todo" and not "ToDo"!!!
  const Details = getComponentFromMap('Details');

  const classes = useStyles();
  const CONSTS = PCore.getConstants();
  const [showConfirmView, setShowConfirmView] = useState(true);
  const { showTasks, getPConnect } = props;
  // Get the inherited props from the parent to determine label settings
  // Not using whatsNext at the moment, need to figure out the use of it
  // const whatsNext = datasource?.source;
  // const items = whatsNext.length > 0 ? whatsNext.map(item => item.label) : '';
  const activeContainerItemID = PCore.getContainerUtils().getActiveContainerItemName(getPConnect().getTarget());
  const rootInfo = PCore.getContainerUtils().getContainerItemData(getPConnect().getTarget(), activeContainerItemID);
  const onConfirmViewClose = () => {
    setShowConfirmView(false);
    PCore.getPubSubUtils().publish(PCore.getConstants().PUB_SUB_EVENTS.CASE_EVENTS.CLOSE_CONFIRM_VIEW, rootInfo);
  };
  const todoProps = { ...props, renderTodoInConfirm: true };
  const toDoList = getToDoAssignments(getPConnect());
  const detailProps = { ...props, showLabel: false };
  const showDetails = detailProps?.children?.[0]?.props?.getPConnect()?.getChildren()?.length > 0;
  return showConfirmView ? (
    <Card className={classes.root} style={{ width: '90%' }}>
      {props.showLabel && <h2 id='confirm-label'>{props.label}</h2>}
      {showDetails ? <Details {...detailProps} /> : undefined}
      {showTasks ? (
        toDoList && toDoList.length > 0 ? (
          <ToDo {...todoProps} datasource={{ source: toDoList }} getPConnect={getPConnect} type={CONSTS.TODO} headerText='Open Tasks' isConfirm />
        ) : undefined
      ) : undefined}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button className={classes.primaryButton} onClick={onConfirmViewClose}>
          Done
        </Button>
      </div>
    </Card>
  ) : toDoList && toDoList.length > 0 && props.showLabel ? (
    <Card className={classes.root}>
      <ToDo {...props} datasource={{ source: toDoList }} getPConnect={getPConnect} type={CONSTS.TODO} headerText='Tasks' isConfirm />
    </Card>
  ) : null;
}
