import React, { useState } from "react";
import PropTypes from "prop-types";
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
  ListItemSecondaryAction,
} from "@material-ui/core";
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import ArrowForwardIosOutlinedIcon from '@material-ui/icons/ArrowForwardIosOutlined';
import { makeStyles } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import './ToDo.css';

// import { useNavBar } from "../templates/AppShell";

function getCaseInfoAssignment(assignmentsSource: Array<any>, caseInfoID: string) {
  const result: Array<any> = [];
  for (const source of assignmentsSource) {
    if (source.ID.indexOf(caseInfoID) >= 0) {
      const listRow = JSON.parse(JSON.stringify(source));
      // urgency becomes priority
      listRow['priority'] = listRow.urgency || undefined;
      // mimic regular list
      listRow['id'] = listRow['ID'] || undefined;
      result.push(listRow);
    }
  }

  return result;
}

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    borderLeft: "6px solid",
    borderLeftColor: theme.palette.primary.light
  },
  avatar: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.getContrastText(theme.palette.primary.light),
  }
}));

declare const PCore: any;

export default function ToDo(props) {
  const {
    caseInfoID,
    datasource,
    getPConnect,
    headerText,
    showTodoList,
    myWorkList
  } = props;

  const bLogging = true;
  const [bShowMore, setBShowMore] = useState( true );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const[currentUser, setCurrentUser] = useState(PCore.getEnvironmentInfo().getOperatorName());
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const[currentUserInitials, setCurrentUserInitials] = useState(Utils.getInitials(currentUser));
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage]: any = useState("");


  const thePConn = getPConnect();
  let assignmentCount = 0;
  const assignmentsSource = datasource?.source || myWorkList?.source;
  // let arAssignments : Array<any> = [];
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const[arAssignments, setArAssignments] = useState<Array<any>>( initAssignments() );
  const classes = useStyles();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  // const { setOpen } = useNavBar();

  function topThreeAssignments(arList: Array<any>): Array<any> {
    const arList3: Array<any> = new Array<any>();

    if (arList && typeof(arList) === "object") {
      let len = arList.length;
      if (len > 3) len = 3;

      for (let i =0; i < len; i+=1) {
        arList3.push(arList[i]);
      }
    }
    return arList3;
  }

  function getID(assignment: any) {
    let sID = "";
    if (assignment.value) {
      const refKey = assignment.value;
      sID = refKey.substring(refKey.lastIndexOf(" ") + 1);
    }
    else {
      const refKey = assignment.ID;
      const arKeys = refKey.split("!")[0].split(" ");
      sID = arKeys[2];
    }
    return sID;
  }


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
  };


  function _showMore() {
    setBShowMore(false);
    setArAssignments(assignmentsSource);
  }


  function _showLess() {
    setBShowMore(true);
    setArAssignments(topThreeAssignments(assignmentsSource));
  }


  function clickGo(inAssignmentArray: any) {
    //
    // By Sherif
    // Disable closing the side bar per standup vote
    //
    // setOpen(false);

    const { id } = inAssignmentArray[0];
    let { classname = "" } = inAssignmentArray[0];
    const sTarget = thePConn.getContainerName();
    const sTargetContainerName = sTarget;

    const options = { "containerName": sTargetContainerName};

    if (classname === null || classname === "") {
      classname = thePConn.getCaseInfo().getClassName();
    }

    if (sTarget === "workarea") {
      options["isActionFromToDoList"] = true;
      options["target"] = "";
      options["context"] = null;
      options["isChild"] = undefined;
    }
    else {
      options["isActionFromToDoList"] = false;
      options["target"] = sTarget;
    }

    thePConn.getActionsApi().openAssignment(id, classname, options).then(() => {
      if (bLogging) {
        // eslint-disable-next-line no-console
        console.log(`openAssignment completed`);
      }
    })
    .catch(() => {
      showToast( `Submit failed!`);
    });

  }


  function initAssignments() : Array<any> {
    if (showTodoList) {
      if (assignmentsSource) {
        assignmentCount = (assignmentsSource !== null) ? assignmentsSource.length : 0;
        return topThreeAssignments(assignmentsSource);
      }else {
        // turn off todolist
        return [];
      }
    }
    else if (caseInfoID !== undefined) {
      // get caseInfoId assignment.
        return getCaseInfoAssignment(assignmentsSource, caseInfoID);
    }
    return [];
  }

  const getListItemComponent = assignment => {
    if (isDesktop) {
      return (
        <>
          Task in
          <Button size="small" color="primary">{`${assignment.name} ${getID(assignment)}`}</Button>
          {` \u2022 `}<span className="psdk-todo-assignment-status">{assignment.status}</span>
          {` \u2022  Priority ${assignment.priority}`}
        </>
      )
    } return (
      <>
        <Button size="small" color="primary">{`${assignment.name} ${getID(assignment)}`}</Button>
        {` \u2022  Priority ${assignment.priority}`}
      </>
    )
  }

  return (
    <React.Fragment>
      <Card className={classes.root}>
            {
              showTodoList && (
                <CardHeader
                  title={
                      <Badge badgeContent={assignmentCount} color="primary">
                        <Typography variant="h6">{headerText}&nbsp;&nbsp;&nbsp;</Typography>
                      </Badge>
                    }
                  avatar={
                    <Avatar className={classes.avatar}>
                      {currentUserInitials}
                    </Avatar>
                  }
                ></CardHeader>
              )
            }
            <CardContent>
              <List>
                {
                  arAssignments.map(assignment => (
                    <ListItem
                      key={assignment.id}
                      dense
                      divider
                      onClick={() => clickGo([assignment])}
                    >
                      <ListItemText
                        primary={assignment.stepName}
                        secondary={getListItemComponent(assignment)}
                      />
                      <ListItemSecondaryAction>
                          <IconButton onClick={() => clickGo([assignment])}>
                            <ArrowForwardIosOutlinedIcon />
                          </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))
                }
              </List>
            </CardContent>
              {
                  showTodoList && (
                    <Box
                      display="flex"
                      justifyContent="center"
                    >
                      {
                        bShowMore ? <Button color="primary" onClick={_showMore}>Show more</Button>
                          : <Button onClick={_showLess}>Show less</Button>
                      }
                    </Box>
                  )
              }
      </Card>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        action={
          <IconButton size="small" aria-label="close" color="inherit" onClick={handleSnackbarClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </React.Fragment>
  );
}

ToDo.propTypes = {
  datasource: PropTypes.instanceOf(Object),
  myWorkList: PropTypes.instanceOf(Object),
  caseInfoID: PropTypes.string,
  // buildName: PropTypes.string,
  getPConnect: PropTypes.func.isRequired,
  headerText: PropTypes.string,
  // eslint-disable-next-line react/no-unused-prop-types
  itemKey: PropTypes.string,
  showTodoList: PropTypes.bool,
  // target: PropTypes.string,
  // eslint-disable-next-line react/no-unused-prop-types
  type: PropTypes.string,
  // pageMessages: PropTypes.arrayOf(PropTypes.any),
  // eslint-disable-next-line react/no-unused-prop-types
  context: PropTypes.string,
  // hideActionButtons: PropTypes.bool
};

ToDo.defaultProps = {
  caseInfoID: "",
  datasource: [],
  myWorkList: {},
  // buildName: "",
  headerText: "To do",
  itemKey: "",
  showTodoList: true,
  // target: "",
  type: "worklist",
  // pageMessages: null,
  context: "",
  // hideActionButtons: false
};
