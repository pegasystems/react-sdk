import React, {useState} from "react";
import TextField from '@material-ui/core/TextField';
import Popover from '@material-ui/core/Popover';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { makeStyles } from '@material-ui/core/styles';

import Utils from '@pega/react-sdk-components/lib/components/helpers/utils';
import StyledHmrcOdxGdsTaskListWrapper from './styles';
import type { PConnProps } from '@pega/react-sdk-components/lib/types/PConnProps';


interface HmrcOdxGdsTaskListProps extends PConnProps {
  // If any, enter additional props that only exist on this componentName
  // eslint-disable-next-line react/no-unused-prop-types
  label: string,
  createDateTime: string,
  createLabel: string,
  createOperator: { userName: string, userId: string },
  updateDateTime: string,
  updateLabel: string,
  updateOperator: { userName: string, userId: string }
}


const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(1),
    margin: theme.spacing(1),
  },
  popover: {
    padding: theme.spacing(1),
    margin: theme.spacing(1),
  }
}));

// Duplicated runtime code from React SDK

// Page Case Widget example

// props passed in combination of props from property panel (config.json) and run time props from Constellation
// any default values in config.pros should be set in defaultProps at bottom of this file
export default function HmrcOdxGdsTaskList(props: HmrcOdxGdsTaskListProps) {
  // const componentName = "Operator";
  const classes = useStyles();

  // const versionAr = pCoreVersion.split(".");
  // let fieldLabel;
  let caseOpLabel = "---";
  let caseOpName = "---";
  let caseOpId = "";
  let caseTime = "";

  let updateOpLabel = "---";
  let updateOpName = "---";
  let updateOpId = "";
  let updateTime = "";

  // fieldLabel = props.fieldLabel;
  caseOpLabel = props.createLabel;
  caseOpName = props.createOperator.userName;
  caseTime = props.createDateTime;
  caseOpId = props.createOperator.userId;

  updateOpLabel = props.updateLabel;
  updateOpName = props.updateOperator.userName;
  updateTime = props.updateDateTime;
  updateOpId = props.updateOperator.userId;




  // Popover-related
  const [popoverAnchorEl, setPopoverAnchorEl] = useState(null);
  const [popoverFields, setPopoverFields] = useState<Array<any>>([]);

  const popoverOpen = Boolean(popoverAnchorEl);
  const popoverId = popoverOpen ? 'operator-details-popover' : undefined;

  const handlePopoverClose = (() => {
    setPopoverAnchorEl(null);
  })

  function showOperatorDetails(event) {

    const operatorPreviewPromise = PCore.getUserApi().getOperatorDetails(caseOpId);
    const localizedVal = PCore.getLocaleUtils().getLocaleValue;
    const localeCategory = 'Operator';

    operatorPreviewPromise.then((res) => {
      const fillerString = "---";
      let fields: any = [];
      if (
        res.data &&
        res.data.pyOperatorInfo &&
        res.data.pyOperatorInfo.pyUserName
      ) {
        fields = [
          {
            id: "pyPosition",
            name: localizedVal("Position", localeCategory),
            value: res.data.pyOperatorInfo.pyPosition ? res.data.pyOperatorInfo.pyPosition : fillerString
          },
          {
            id: "pyOrganization",
            name: localizedVal("Organization", localeCategory),
            value: res.data.pyOperatorInfo.pyOrganization ? res.data.pyOperatorInfo.pyOrganization : fillerString
          },
          {
            id: "ReportToUserName",
            name: localizedVal('Reports to', localeCategory),
            value: res.data.pyOperatorInfo.pyReportToUserName ? res.data.pyOperatorInfo.pyReportToUserName : fillerString
          },
          {
            id: "pyTelephone",
            name: localizedVal('Telephone', localeCategory),
            value: res.data.pyOperatorInfo.pyTelephone ? <a href={`tel:${res.data.pyOperatorInfo.pyTelephone}`}>{res.data.pyOperatorInfo.pyTelephone}</a> : fillerString
          },
          {
            id: "pyEmailAddress",
            name: localizedVal('Email address', localeCategory),
            value: res.data.pyOperatorInfo.pyEmailAddress ? <a href={`mailto:${res.data.pyOperatorInfo.pyEmailAddress}`}>{res.data.pyOperatorInfo.pyEmailAddress}</a> : fillerString
          }
        ];
      } else {
        // eslint-disable-next-line no-console
        console.log(`Operator: PCore.getUserApi().getOperatorDetails(${caseOpId}); returned empty res.data.pyOperatorInfo.pyUserName - adding default`);
        fields = [
          {
            id: "pyPosition",
            name: localizedVal("Position", localeCategory),
            value: fillerString
          },
          {
            id: "pyOrganization",
            name: localizedVal("Organization", localeCategory),
            value: fillerString
          },
          {
            id: "ReportToUserName",
            name: localizedVal('Reports to', localeCategory),
            value: fillerString
          },
          {
            id: "pyTelephone",
            name: localizedVal('Telephone', localeCategory),
            value: fillerString
          },
          {
            id: "pyEmailAddress",
            name: localizedVal('Email address', localeCategory),
            value: fillerString
          }
        ];
      }
      // Whatever the fields are, update the component's popoverFields
      setPopoverFields(fields);
    });

    setPopoverAnchorEl(event.currentTarget);
  }

  function showUpdateOperatorDetails(event) {

    const operatorPreviewPromise = PCore.getUserApi().getOperatorDetails(updateOpId);
    const localizedVal = PCore.getLocaleUtils().getLocaleValue;
    const localeCategory = 'Operator';

    operatorPreviewPromise.then((res) => {
      const fillerString = "---";
      let fields: any = [];
      if (
        res.data &&
        res.data.pyOperatorInfo &&
        res.data.pyOperatorInfo.pyUserName
      ) {
        fields = [
          {
            id: "pyPosition",
            name: localizedVal("Position", localeCategory),
            value: res.data.pyOperatorInfo.pyPosition ? res.data.pyOperatorInfo.pyPosition : fillerString
          },
          {
            id: "pyOrganization",
            name: localizedVal("Organization", localeCategory),
            value: res.data.pyOperatorInfo.pyOrganization ? res.data.pyOperatorInfo.pyOrganization : fillerString
          },
          {
            id: "ReportToUserName",
            name: localizedVal('Reports to', localeCategory),
            value: res.data.pyOperatorInfo.pyReportToUserName ? res.data.pyOperatorInfo.pyReportToUserName : fillerString
          },
          {
            id: "pyTelephone",
            name: localizedVal('Telephone', localeCategory),
            value: res.data.pyOperatorInfo.pyTelephone ? <a href={`tel:${res.data.pyOperatorInfo.pyTelephone}`}>{res.data.pyOperatorInfo.pyTelephone}</a> : fillerString
          },
          {
            id: "pyEmailAddress",
            name: localizedVal('Email address', localeCategory),
            value: res.data.pyOperatorInfo.pyEmailAddress ? <a href={`mailto:${res.data.pyOperatorInfo.pyEmailAddress}`}>{res.data.pyOperatorInfo.pyEmailAddress}</a> : fillerString
          }
        ];
      } else {
        // eslint-disable-next-line no-console
        console.log(`Operator: PCore.getUserApi().getOperatorDetails(${caseOpId}); returned empty res.data.pyOperatorInfo.pyUserName - adding default`);
        fields = [
          {
            id: "pyPosition",
            name: localizedVal("Position", localeCategory),
            value: fillerString
          },
          {
            id: "pyOrganization",
            name: localizedVal("Organization", localeCategory),
            value: fillerString
          },
          {
            id: "ReportToUserName",
            name: localizedVal('Reports to', localeCategory),
            value: fillerString
          },
          {
            id: "pyTelephone",
            name: localizedVal('Telephone', localeCategory),
            value: fillerString
          },
          {
            id: "pyEmailAddress",
            name: localizedVal('Email address', localeCategory),
            value: fillerString
          }
        ];
      }
      // Whatever the fields are, update the component's popoverFields
      setPopoverFields(fields);
    });

    setPopoverAnchorEl(event.currentTarget);
  }

  function getPopoverGrid() {
    // return popoverFields.map((field) => {
    //   return <div className={classes.popover}>{field.name}: {field.value}</div>
    // })

    if (popoverFields.length === 0) {
      return;
    }

    // There are fields, so build the grid.
    return <Grid container className={classes.popover} spacing={1}>
      <Grid item xs={12}><Typography variant="h6">{caseOpName}</Typography></Grid>
      {popoverFields.map((field) => {
        return <React.Fragment key={field.id}>
          <Grid container item xs={12} spacing={1}>
            <Grid item xs={6}><Typography variant="caption">{field.name}</Typography></Grid>
            <Grid item xs={6}><Typography variant="subtitle2">{field.value}</Typography></Grid>
          </Grid>
        </React.Fragment>
      })}
    </Grid>

  }

  // End of popover-related


  return <StyledHmrcOdxGdsTaskListWrapper><React.Fragment>
    <Grid container spacing={2}>
      <Grid item>
      <TextField
        defaultValue={caseOpName}
        label={caseOpLabel}
        onClick={showOperatorDetails}

        InputProps={{
          readOnly: true,
          disableUnderline: true,
          inputProps: {style: {cursor: 'pointer'}}
        }}

      />
      <br />
      {Utils.generateDateTime(caseTime, "DateTime-Since")}
     </Grid>
     <Grid item>
      <TextField
        defaultValue={updateOpName}
        label={updateOpLabel}
        onClick={showUpdateOperatorDetails}

        InputProps={{
          readOnly: true,
          disableUnderline: true,
          inputProps: {style: {cursor: 'pointer'}}
        }}

      />
      <br />
      {Utils.generateDateTime(updateTime, "DateTime-Since")}
     </Grid>
    </Grid>

      <Popover
        id={popoverId}
        open={popoverOpen}
        anchorEl={popoverAnchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center'}}
        transformOrigin={{ vertical: 'top', horizontal: 'center'}}
        PaperProps={{ style: {maxWidth: '45ch'}}}
      >
        {getPopoverGrid()}
      </Popover>
    </React.Fragment>
	</StyledHmrcOdxGdsTaskListWrapper>;

}
