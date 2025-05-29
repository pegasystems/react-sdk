/* eslint-disable @typescript-eslint/no-shadow */
import React, { useCallback, useEffect, useState } from 'react';
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
} from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import { useTheme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import useMediaQuery from '@mui/material/useMediaQuery';

import { Utils } from '@pega/react-sdk-components/lib/components/helpers/utils';
import { PConnProps } from '@pega/react-sdk-components/lib/types/PConnProps';

import './ToDo.css';

const fetchMyWorkList = (datapage, fields, numberOfRecords, includeTotalCount, context) => {
  return PCore.getDataPageUtils()
    .getDataAsync(
      datapage,
      context,
      {},
      {
        pageNumber: 1,
        pageSize: numberOfRecords
      },
      {
        select: Object.keys(fields).map(key => ({ field: PCore.getAnnotationUtils().getPropertyName(fields[key]) }))
      },
      {
        invalidateCache: true,
        additionalApiParams: {
          includeTotalCount
        }
      }
    )
    .then(response => {
      return {
        ...response,
        data: (Array.isArray(response?.data) ? response.data : []).map(row =>
          Object.keys(fields).reduce((obj, key) => {
            obj[key] = row[PCore.getAnnotationUtils().getPropertyName(fields[key])];
            return obj;
          }, {})
        )
      };
    });
};

interface ToDoProps extends PConnProps {
  // If any, enter additional props that only exist on this component
  datasource?: any;
  myWorkList?: any;

  caseInfoID?: string;
  headerText?: string;

  itemKey?: string;
  showTodoList?: boolean;
  type?: string;

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
    paddingBottom: theme.spacing(1),
    // borderLeft: '6px solid',
    borderLeftColor: theme.palette.primary.light
  },
  avatar: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.getContrastText(theme.palette.primary.light)
  },
  todoWrapper: {
    // borderLeft: '6px solid',
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
    textTransform: 'none',
    '&:hover': {
      background: '#fa2c2551',
      color: '#333'
    }
  }
}));

export default function ToDo(props: ToDoProps) {
  const {
    getPConnect,
    context,
    datasource = [],
    headerText = 'To do',
    showTodoList = true,
    myWorkList = {},
    type = 'worklist',
    isConfirm = false
  } = props;

  const CONSTS = PCore.getConstants();

  const bLogging = true;
  const currentUser = PCore.getEnvironmentInfo().getOperatorName();
  const currentUserInitials = Utils.getInitials(currentUser);
  const assignmentsSource = datasource?.source || myWorkList?.source;

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
  const [count, setCount] = useState(0);

  const {
    WORK_BASKET: { MY_WORK_LIST }
  } = PCore.getConstants();

  function initAssignments(): any[] {
    if (assignmentsSource) {
      return topThreeAssignments(assignmentsSource);
    }
    // turn off todolist
    return [];
  }

  const deferLoadWorklistItems = useCallback(
    responseData => {
      setCount(responseData.totalCount);
      setAssignments(responseData.data);
    },
    [MY_WORK_LIST]
  );

  useEffect(() => {
    if (Object.keys(myWorkList).length && myWorkList.datapage) {
      fetchMyWorkList(myWorkList.datapage, getPConnect().getComponentConfig()?.myWorkList.fields, 3, true, context).then(responseData => {
        deferLoadWorklistItems(responseData);
      });
    }
  }, []);

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

  function handleSnackbarClose(event: React.SyntheticEvent<any> | Event, reason?: string) {
    if (reason === 'clickaway') {
      return;
    }
    setShowSnackbar(false);
  }

  function _showMore() {
    setBShowMore(false);
    if (type === CONSTS.WORKLIST && count && count > assignments.length && !assignmentsSource) {
      fetchMyWorkList(myWorkList.datapage, getPConnect().getComponentConfig()?.myWorkList.fields, count, false, context).then(response => {
        setAssignments(response.data);
      });
    } else {
      setAssignments(assignmentsSource);
    }
  }

  function _showLess() {
    setBShowMore(true);
    setAssignments(assignments => assignments.slice(0, 3));
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
      return <Button size='small' color='primary'>{`${assignment.name} ${getID(assignment)}`}</Button>;
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
          {type === CONSTS.WORKLIST && assignment.status ? <span className='psdk-todo-assignment-status'>{assignment.status}</span> : undefined}
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

  // eslint-disable-next-line no-nested-ternary
  const getCount = () => (assignmentsSource ? assignmentsSource.length : type === CONSTS.WORKLIST ? count : 0);

  const toDoContent = (
    <>
      {showTodoList && (
        <CardHeader
          title={
            <Badge badgeContent={getCount()} overlap='rectangular' color='primary'>
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
                <IconButton id='go-btn' onClick={() => clickGo(assignment)} size='large'>
                  <ArrowForwardIosOutlinedIcon />
                </IconButton>
              </div>
            )}
          </div>
        ))}
      </List>
    </>
  );

  const modifiedAssignments = assignments?.length > 0 ? [assignments?.[0]] : [];

  return (
    <>
      {/* {type === CONSTS.WORKLIST && (
        <Card className={classes.root}>
          {showTodoList && (
            <CardHeader
              title={
                <Badge badgeContent={getCount()} overlap='rectangular' color='primary'>
                  <Typography variant='h6'>{headerText}&nbsp;&nbsp;&nbsp;</Typography>
                </Badge>
              }
              avatar={<Avatar className={classes.avatar}>{currentUserInitials}</Avatar>}
            />
          )}
          <CardContent>
            <List>
              {assignments.map(assignment => (
                <ListItem key={getAssignmentId(assignment)} dense divider onClick={() => clickGo(assignment)}>
                  <ListItemText primary={getAssignmentName(assignment)} secondary={getListItemComponent(assignment)} />
                  <ListItemSecondaryAction>
                    <IconButton onClick={() => clickGo(assignment)} size='large'>
                      <ArrowForwardIosOutlinedIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}

      {type === CONSTS.TODO && !isConfirm && <Card className={classes.todoWrapper}>{toDoContent}</Card>}
      {type === CONSTS.TODO && isConfirm && <>{toDoContent}</>}

      {getCount() > 3 && (
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

      {type === CONSTS.WORKLIST && modifiedAssignments?.length > 0 && (
        <Card className={classes.root} style={{ paddingBottom: 0, marginBottom: '1.2em' }}>
          {showTodoList && <CardHeader style={{ padding: '0.5em 1rem' }} title={<Typography variant='h6'>{headerText}</Typography>} />}
          <CardContent style={{ padding: '0 1em' }}>
            <List>
              {modifiedAssignments.map(assignment => (
                <ListItem key={getAssignmentId(assignment)} dense>
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
              {/* {assignments?.length === 0 && <Typography style={{ textAlign: 'center' }}>No results found.</Typography>} */}
            </List>
          </CardContent>
        </Card>
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
    </>
  );
}
