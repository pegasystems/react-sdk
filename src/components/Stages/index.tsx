import React from "react";
// import { Stages as CosmosStages } from "@pega/cosmos-react-work";
import PropTypes from "prop-types";
import { Breadcrumbs, Card, Typography } from "@material-ui/core";
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import DoneIcon from '@material-ui/icons/Done';
import { makeStyles } from '@material-ui/core/styles';

declare const PCore: any;

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
  completedStage: {
    color: theme.palette.text.primary,
  },
  currentStage: {
    color: theme.palette.info.dark,
    fontWeight: 600,
  },
  futureStage: {
    color: theme.palette.text.secondary,
  },
  separatorIcon: {
    color: theme.palette.text.disabled,
  }

}));


/**
 * API to filter out the alternate stages which are not in active and return all other stages
 * @param {Array} stages - Stages of a case type
 *
 * @returns {Array} - Returns stages which are non alternate stages and alternate stage which is active.
 */
function getFilteredStages(stages) {
  if (!Array.isArray(stages)) {
    return [];
  }

  return stages.filter(
    (stage) =>
      stage.type !== "Alternate" ||
      (stage.type === "Alternate" && stage.visited_status === "active")
  );
}

/* TODO - this component should be refactored and not exposed as top level Nebula component -
  the stages should be created as part of the CaseView */
export default function Stages(props) {
  const classes = useStyles();

  const { getPConnect, stages } = props;
  const pConn = getPConnect();

  const filteredStages = getFilteredStages(stages);
  const currentStageID = pConn.getValue(PCore.getConstants().CASE_INFO.STAGEID);
  const stagesObj = filteredStages.map((stage, index, arr) => {
    const theID = stage.ID || stage.id;
    return {
      name: stage.name,
      id: theID,
      complete: stage.visited_status === "completed",
      current: (theID === currentStageID),
      last: (index === arr.length - 1),
    };
  });

  // debugging/investigation help
  // console.log(`Stages: current: ${currentStageID} stagesObj: ${JSON.stringify(stagesObj)}`);

  function getStage(stage, index) {
    //  Removing nested ternary for lint
    // const theClass = stage.current ? classes.currentStage : (stage.complete ? classes.completedStage : classes.futureStage);
    let theClass;
    if (stage.current) {
      theClass = classes.currentStage;
    } else if (stage.complete) {
      theClass = classes.completedStage;
    } else {
      theClass = classes.futureStage;
    }

    return <span key={index}>
        {stage.complete ? <DoneIcon color="disabled" fontSize="small" /> : null}
        <Typography variant="h5" component="span" display="inline" className={theClass}>{stage.name}</Typography>
      </span>;
  }

  function getStages(inStages) {
    return <Breadcrumbs aria-label="stages" separator={<DoubleArrowIcon className={classes.separatorIcon} />}>
      {inStages.map((stage, index) => {
        return getStage(stage, index);
      })}
    </Breadcrumbs>
  }

  return (
    <Card id="Stages" className={classes.root}>
      {/* Stages<br />
      currentStageID: {currentStageID}<br />
      {JSON.stringify(stagesObj)}<br /><br /> */}
      {getStages(stagesObj)}
    </Card>
  )
}

Stages.propTypes = {
  getPConnect: PropTypes.func.isRequired,
  stages: PropTypes.arrayOf(PropTypes.object).isRequired
};
