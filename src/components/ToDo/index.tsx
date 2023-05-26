/* eslint-disable no-shadow */
/* eslint-disable @typescript-eslint/no-shadow */
import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { Utils } from '../../helpers/utils';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Typography,
  Badge,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import ArrowForwardIosOutlinedIcon from '@material-ui/icons/ArrowForwardIosOutlined';
import { makeStyles } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import './ToDo.css';

declare const PCore: any;

const isChildCase = assignment => {
  return assignment.isChild;
};

function topThreeAssignments(assignmentsSource: Array<any>): Array<any> {
  return Array.isArray(assignmentsSource) ? assignmentsSource.slice(0, 3) : [];
}

function getID(assignment: any) {
  if (assignment.value) {
    const refKey = assignment.value;
    return refKey.substring(refKey.lastIndexOf(' ') + 1);
  } else {
    const refKey = assignment.ID;
    const arKeys = refKey.split('!')[0].split(' ');
    return arKeys[2];
  }
}

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    borderLeft: '6px solid',
    borderLeftColor: theme.palette.primary.light
  },
  avatar: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.getContrastText(theme.palette.primary.light)
  },
  todoWrapper: {
    borderLeft: '6px solid',
    borderLeftColor: theme.palette.primary.light,
    padding: theme.spacing(1),
    margin: theme.spacing(1)
  }
}));

export default function ToDo(props) {
  const { datasource, getPConnect, headerText, showTodoList, myWorkList, type, isConfirm } = props;

  const CONSTS = PCore.getConstants();

  const bLogging = true;
  let assignmentCount = 0;
  const currentUser = PCore.getEnvironmentInfo().getOperatorName();
  const currentUserInitials = Utils.getInitials(currentUser);
  const assignmentsSource = datasource?.source || myWorkList?.source;

  const [bShowMore, setBShowMore] = useState(true);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage]: any = useState('');
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const [assignments, setAssignments] = useState<Array<any>>(initAssignments());

  const thePConn = getPConnect();
  const classes = useStyles();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const localizedVal = PCore.getLocaleUtils().getLocaleValue;
  const localeCategory = 'Todo';
  const showlessLocalizedValue = localizedVal('show_less', 'CosmosFields');
  const showMoreLocalizedValue = localizedVal('show_more', 'CosmosFields');
  // const { setOpen } = useNavBar();

  function initAssignments(): Array<any> {
    if (assignmentsSource) {
      assignmentCount = assignmentsSource.length;
      return topThreeAssignments(assignmentsSource);
    } else {
      // turn off todolist
      return [];
    }
  }

  const getAssignmentId = assignment => {
    return type === CONSTS.TODO ? assignment.ID : assignment.id;
  };

  const getPriority = assignment => {
    return type === CONSTS.TODO ? assignment.urgency : assignment.priority;
  };

  const getAssignmentName = assignment => {
    return type === CONSTS.TODO ? assignment.name : assignment.stepName;
  };

  function showToast(message: string) {
    const theMessage = `Assignment: ${message}`;
    // eslint-disable-next-line no-console
    console.error(theMessage);
    setSnackbarMessage(message);
    setShowSnackbar(true);
  }

  function handleSnackbarClose(event: React.SyntheticEvent | React.MouseEvent, reason?: string) {
    if (reason === 'clickaway') {
      return;
    }
    setShowSnackbar(false);
  }

  function _showMore() {
    setBShowMore(false);
    setAssignments(assignmentsSource);
  }

  function _showLess() {
    setBShowMore(true);
    setAssignments(topThreeAssignments(assignmentsSource));
  }

  function clickGo(assignment) {
    const id = getAssignmentId(assignment);
    let { classname = '' } = assignment;
    const sTarget = thePConn.getContainerName();
    const sTargetContainerName = sTarget;

    const options = { containerName: sTargetContainerName };

    if (classname === null || classname === '') {
      classname = thePConn.getCaseInfo().getClassName();
    }

    if (sTarget === 'workarea') {
      options['isActionFromToDoList'] = true;
      options['target'] = '';
      options['context'] = null;
      options['isChild'] = isChildCase(assignment);
    } else {
      options['isActionFromToDoList'] = false;
      options['target'] = sTarget;
    }

    thePConn
      .getActionsApi()
      .openAssignment(id, classname, options)
      .then(() => {
        if (bLogging) {
          // eslint-disable-next-line no-console
          console.log(`openAssignment completed`);
        }
      })
      .catch(() => {
        showToast(`Submit failed!`);
      });
  }

  const renderTaskId = (type, getPConnect, showTodoList, assignment) => {
    const displayID = getID(assignment);

    if ((showTodoList && type !== CONSTS.TODO) || assignment.isChild === true) {
      /* Supress link for todo inside flow step */
      return (
        <Button size='small' color='primary'>{`${assignment.name} ${getID(assignment)}`}</Button>
      );
    }
    return displayID;
  };

  const getListItemComponent = assignment => {
    if (isDesktop) {
      return (
        <>
          {localizedVal('Task in', localeCategory)}
          {renderTaskId(type, getPConnect, showTodoList, assignment)}
          {type === CONSTS.WORKLIST && assignment.status ? `\u2022 ` : undefined}
          {type === CONSTS.WORKLIST && assignment.status ? (
            <span className='psdk-todo-assignment-status'>{assignment.status}</span>
          ) : undefined}
          {` \u2022  ${localizedVal('Urgency', localeCategory)}  ${getPriority(assignment)}`}
        </>
      );
    }
    return (
      <>
        <Button size='small' color='primary'>{`${assignment.name} ${getID(assignment)}`}</Button>
        {` \u2022 ${localizedVal('Urgency', localeCategory)}  ${getPriority(assignment)}`}
      </>
    );
  };

  const toDoContent = (
    <>
      {showTodoList && (
        <CardHeader
          title={
            <Badge badgeContent={assignmentCount} color='primary'>
              <Typography variant='h6'>{headerText}&nbsp;&nbsp;&nbsp;</Typography>
            </Badge>
          }
        ></CardHeader>
      )}
      <List>
        {assignments.map(assignment => (
          <div key={getAssignmentId(assignment)} className='psdk-todo-avatar-header'>
            <Avatar className={classes.avatar} style={{ marginRight: '16px' }}>
              {currentUserInitials}
            </Avatar>
            <div style={{ display: 'block' }}>
              <Typography variant='h6'>{assignment?.name}</Typography>
              {`${localizedVal('Task in', localeCategory)} ${renderTaskId(
                type,
                getPConnect,
                showTodoList,
                assignment
              )} \u2022  ${localizedVal('Urgency', localeCategory)}  ${getPriority(assignment)}`}
            </div>
            {!isConfirm && (
              <div style={{ marginLeft: 'auto' }}>
                <IconButton onClick={() => clickGo(assignment)}>
                  <ArrowForwardIosOutlinedIcon />
                </IconButton>
              </div>
            )}
          </div>
        ))}
      </List>
    </>
  );
  return (
    <React.Fragment>
      {type === CONSTS.WORKLIST && (
        <Card className={classes.root}>
          {showTodoList && (
            <CardHeader
              title={
                <Badge badgeContent={assignmentCount} color='primary'>
                  <Typography variant='h6'>{headerText}&nbsp;&nbsp;&nbsp;</Typography>
                </Badge>
              }
              avatar={<Avatar className={classes.avatar}>{currentUserInitials}</Avatar>}
            ></CardHeader>
          )}
          <CardContent>
            <List>
              {assignments.map(assignment => (
                <ListItem
                  key={getAssignmentId(assignment)}
                  dense
                  divider
                  onClick={() => clickGo(assignment)}
                >
                  <ListItemText
                    primary={getAssignmentName(assignment)}
                    secondary={getListItemComponent(assignment)}
                  />
                  <ListItemSecondaryAction>
                    <IconButton onClick={() => clickGo(assignment)}>
                      <ArrowForwardIosOutlinedIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      {type === CONSTS.TODO && !isConfirm && (
        <Card className={classes.todoWrapper}>{toDoContent}</Card>
      )}
      {type === CONSTS.TODO && isConfirm && <Fragment>{toDoContent}</Fragment>}
      {assignmentCount > 3 && (
        <Box display='flex' justifyContent='center'>
          {bShowMore ? (
            <Button color='primary' onClick={_showMore}>
              {showMoreLocalizedValue ===  'show_more' ? 'Show more': showMoreLocalizedValue}
            </Button>
          ) : (
            <Button onClick={_showLess}>
              {showlessLocalizedValue ===  'show_less' ? 'Show less': showlessLocalizedValue}
            </Button>
          )}
        </Box>
      )}

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
    </React.Fragment>
  );
}

ToDo.propTypes = {
  datasource: PropTypes.instanceOf(Object),
  myWorkList: PropTypes.instanceOf(Object),
  // eslint-disable-next-line react/no-unused-prop-types
  caseInfoID: PropTypes.string,
  // buildName: PropTypes.string,
  getPConnect: PropTypes.func.isRequired,
  headerText: PropTypes.string,
  // eslint-disable-next-line react/no-unused-prop-types
  itemKey: PropTypes.string,
  showTodoList: PropTypes.bool,
  // target: PropTypes.string,
  type: PropTypes.string,
  // pageMessages: PropTypes.arrayOf(PropTypes.any),
  // eslint-disable-next-line react/no-unused-prop-types
  context: PropTypes.string,
  // hideActionButtons: PropTypes.bool
  isConfirm: PropTypes.bool
};

ToDo.defaultProps = {
  caseInfoID: '',
  datasource: [],
  myWorkList: {},
  // buildName: "",
  headerText: 'To do',
  itemKey: '',
  showTodoList: true,
  // target: "",
  type: 'worklist',
  // pageMessages: null,
  context: '',
  // hideActionButtons: false
  isConfirm: false
};
