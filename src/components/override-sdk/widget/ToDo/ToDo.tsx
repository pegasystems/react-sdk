/* eslint-disable @typescript-eslint/no-shadow */
import React, { useState } from 'react';
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
  ListItemSecondaryAction,
  ListItemAvatar,
  ListItemIcon
} from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import ArrowForwardIosOutlinedIcon from '@material-ui/icons/ArrowForwardIosOutlined';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import BuildIcon from '@material-ui/icons/Build';

import { Utils } from '@pega/react-sdk-components/lib/components/helpers/utils';
import { PConnProps } from '@pega/react-sdk-components/lib/types/PConnProps';

import './ToDo.css';

interface ToDoProps extends PConnProps {
  // If any, enter additional props that only exist on this component
  datasource?: any;
  myWorkList?: any;
  // eslint-disable-next-line react/no-unused-prop-types
  caseInfoID?: string;
  headerText?: string;
  // eslint-disable-next-line react/no-unused-prop-types
  itemKey?: string;
  showTodoList?: boolean;
  type?: string;
  // eslint-disable-next-line react/no-unused-prop-types
  context?: string;
  isConfirm?: boolean;
}

const isChildCase = assignment => {
  return assignment.isChild;
};

function topThreeAssignments(assignmentsSource: any[]): any[] {
  return Array.isArray(assignmentsSource) ? assignmentsSource.slice(0, 3) : [];
}

function getID(assignment: any) {
  if (assignment.value) {
    const refKey = assignment.value;
    return refKey.substring(refKey.lastIndexOf(' ') + 1);
  }
  const refKey = assignment.ID;
  const arKeys = refKey.split('!')[0].split(' ');
  return arKeys[2];
}

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    paddingBottom: theme.spacing(1)
    // borderLeft: '6px solid',
    // borderLeftColor: theme.palette.primary.light
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

export default function ToDo(props: ToDoProps) {
  const { getPConnect, datasource = [], headerText = 'To do', showTodoList = true, myWorkList = {}, type = 'worklist', isConfirm = false } = props;

  const CONSTS = PCore.getConstants();

  const bLogging = true;
  let assignmentCount = 0;
  const currentUser = PCore.getEnvironmentInfo().getOperatorName();
  const currentUserInitials = Utils.getInitials(currentUser);
  let assignmentsSource = datasource?.source || myWorkList?.source;
  assignmentsSource = assignmentsSource.slice(0, 1);

  const [bShowMore, setBShowMore] = useState(true);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage]: any = useState('');
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const [assignments, setAssignments] = useState<any[]>(initAssignments());

  const thePConn = getPConnect();
  const classes = useStyles();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const localizedVal = PCore.getLocaleUtils().getLocaleValue;
  const localeCategory = 'Todo';
  const showlessLocalizedValue = localizedVal('show_less', 'CosmosFields');
  const showMoreLocalizedValue = localizedVal('show_more', 'CosmosFields');
  const canPerform = assignments?.[0]?.canPerform === 'true' || assignments?.[0]?.canPerform === true;
  // const { setOpen } = useNavBar();

  function initAssignments(): any[] {
    if (assignmentsSource) {
      assignmentCount = assignmentsSource.length;
      return topThreeAssignments(assignmentsSource);
    }
    // turn off todolist
    return [];
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

    const options: any = {
      containerName: sTargetContainerName,
      channelName: ''
    };

    if (classname === null || classname === '') {
      classname = thePConn.getCaseInfo().getClassName();
    }

    if (sTarget === 'workarea') {
      options.isActionFromToDoList = true;
      options.target = '';
      options.context = null;
      options.isChild = isChildCase(assignment);
    } else {
      options.isActionFromToDoList = false;
      options.target = sTarget;
    }

    // thePConn
    //   .getActionsApi()
    //   .openAssignment(id, classname, options)
    //   .then(() => {
    //     if (bLogging) {
    //       // eslint-disable-next-line no-console
    //       console.log(`openAssignment completed`);
    //     }
    //   })
    //   .catch(() => {
    //     showToast(`Submit failed!`);
    //   });

    // options.containerName = 'primary';

    options.pageName = 'pyEmbedAssignment';

    PCore.getMashupApi()
      .openAssignment(id, 'app/primary', options)
      .then(() => {
        if (bLogging) {
          //       // eslint-disable-next-line no-console
          //       console.log(`openAssignment completed`);
        }
      })
      .catch(() => {
        showToast('Submit Failed.');
      });
  }

  const renderTaskId = (type, getPConnect, showTodoList, assignment) => {
    const displayID = getID(assignment);

    if ((showTodoList && type !== CONSTS.TODO) || assignment.isChild === true) {
      /* Supress link for todo inside flow step */
      return <Typography>{`${assignment.name} ${getID(assignment)}`}</Typography>;
    }
    return displayID;
  };

  const getListItemComponent = assignment => {
    if (isDesktop) {
      return (
        <>
          {/* {localizedVal('Task in', localeCategory)} */}
          {renderTaskId(type, getPConnect, showTodoList, assignment)}
          {/* {type === CONSTS.WORKLIST && assignment.status ? `\u2022 ` : undefined} */}
          {/* {type === CONSTS.WORKLIST && assignment.status ? <span className='psdk-todo-assignment-status'>{assignment.status}</span> : undefined} */}
          {/* {` \u2022  ${localizedVal('Urgency', localeCategory)}  ${getPriority(assignment)}`} */}
        </>
      );
    }
    return `${assignment.name} ${getID(assignment)}`;
  };

  const toDoContent = (
    <>
      {showTodoList && (
        <CardHeader
          title={
            <Badge badgeContent={assignmentCount} overlap='rectangular' color='primary'>
              <Typography variant='h6'>{headerText}&nbsp;&nbsp;&nbsp;</Typography>
            </Badge>
          }
        />
      )}
      <List>
        {assignments.map(assignment => (
          <div className='psdk-todo-avatar-header' key={getAssignmentId(assignment)}>
            <Avatar className={classes.avatar} style={{ marginRight: '16px' }}>
              {currentUserInitials}
            </Avatar>
            <div style={{ display: 'block' }}>
              <Typography variant='h6'>{assignment?.name}</Typography>
              {`${localizedVal('Task in', localeCategory)} ${renderTaskId(type, getPConnect, showTodoList, assignment)} \u2022  ${localizedVal(
                'Urgency',
                localeCategory
              )}  ${getPriority(assignment)}`}
            </div>
            {(!isConfirm || canPerform) && (
              <div style={{ marginLeft: 'auto' }}>
                <IconButton id='go-btn' onClick={() => clickGo(assignment)}>
                  <ArrowForwardIosOutlinedIcon />
                </IconButton>
              </div>
            )}
          </div>
        ))}
      </List>
    </>
  );

  const show = false;

  return (
    <>
      {type === CONSTS.WORKLIST && assignments?.length > 0 && show && (
        <Card className={classes.root} style={{ paddingBottom: 0, marginBottom: '2em' }}>
          {showTodoList && (
            <CardHeader
              style={{ padding: '0 2rem' }}
              title={
                // <Badge badgeContent={assignmentCount} overlap='rectangular' color='primary'>
                <Typography variant='h6'>Please let us know how we did!</Typography>
                // </Badge>
              }
              // avatar={<Avatar className={classes.avatar}>{currentUserInitials}</Avatar>}
            />
          )}
          <CardContent style={{ padding: '0 1em' }}>
            <List>
              {assignments.map(assignment => (
                <ListItem key={getAssignmentId(assignment)} dense onClick={() => clickGo(assignment)}>
                  {/* <BuildIcon style={{ color: '#fff', backgroundColor: '#CE2525' }} shapeRendering='circle' /> */}
                  <IconButton className='todo-icon'>
                    <img src='assets/img/ToDoIcon.png' />
                  </IconButton>
                  <ListItemText
                    className='list-text'
                    style={{ marginLeft: '1em' }}
                    primary={getAssignmentName(assignment)}
                    secondary={`${assignment.name} ${getID(assignment)}`}
                  />
                  <ListItemSecondaryAction>
                    <Button className={classes.primaryButton} onClick={() => clickGo(assignment)}>
                      Get started
                    </Button>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
              {assignments?.length === 0 && <Typography style={{ textAlign: 'center' }}>No results found.</Typography>}
            </List>
          </CardContent>
        </Card>
      )}

      {/* {type === CONSTS.TODO && !isConfirm && <Card className={classes.todoWrapper}>{toDoContent}</Card>} */}
      {/* {type === CONSTS.TODO && isConfirm && <>{toDoContent}</>} */}

      {/* {assignmentCount > 3 && (
        <Box display='flex' justifyContent='center'>
          {bShowMore ? (
            <Button color='primary' onClick={_showMore}>
              {showMoreLocalizedValue === 'show_more' ? 'Show more' : showMoreLocalizedValue}
            </Button>
          ) : (
            <Button onClick={_showLess}>{showlessLocalizedValue === 'show_less' ? 'Show less' : showlessLocalizedValue}</Button>
          )}
        </Box>
      )} */}

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
