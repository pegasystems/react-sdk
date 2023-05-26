import React, { useState } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Popover from '@material-ui/core/Popover';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { makeStyles } from '@material-ui/core/styles';

import Utils from '../../../helpers/utils';

declare const PCore: any;

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(1),
    margin: theme.spacing(1)
  },
  popover: {
    padding: theme.spacing(1),
    margin: theme.spacing(1)
  }
}));

export default function Operator(props) {
  // const componentName = "Operator";
  const { caseOpConfig } = props;
  const classes = useStyles();

  const fieldLabel = caseOpConfig.label.toLowerCase();
  let caseOpLabel = '---';
  let caseOpName = '---';
  let caseOpId = '';
  let caseTime = null;

  if (fieldLabel === 'create operator') {
    caseOpLabel = caseOpConfig.createLabel;
    caseOpName = caseOpConfig.createOperator.userName;
    caseTime = caseOpConfig.createDateTime;
    caseOpId = caseOpConfig.createOperator.userId;
  } else if (fieldLabel === 'update operator') {
    caseOpLabel = caseOpConfig.updateLabel;
    caseOpName = caseOpConfig.updateOperator.userName;
    caseTime = caseOpConfig.updateDateTime;
    caseOpId = caseOpConfig.updateOperator.userId;
  }

  // Popover-related
  const [popoverAnchorEl, setPopoverAnchorEl] = useState(null);
  const [popoverFields, setPopoverFields] = useState<Array<any>>([]);

  const popoverOpen = Boolean(popoverAnchorEl);
  const popoverId = popoverOpen ? 'operator-details-popover' : undefined;

  const handlePopoverClose = () => {
    setPopoverAnchorEl(null);
  };

  function showOperatorDetails(event) {
    const operatorPreviewPromise = PCore.getUserApi().getOperatorDetails(caseOpId);
    const localizedVal = PCore.getLocaleUtils().getLocaleValue;
    const localeCategory = 'Operator';

    operatorPreviewPromise.then(res => {
      const fillerString = '---';
      let fields: any = [];
      if (res.data && res.data.pyOperatorInfo && res.data.pyOperatorInfo.pyUserName) {
        fields = [
          {
            id: 'pyPosition',
            name: localizedVal('Position', localeCategory),
            value: res.data.pyOperatorInfo.pyPosition
              ? res.data.pyOperatorInfo.pyPosition
              : fillerString
          },
          {
            id: 'pyOrganization',
            name: localizedVal('Organization', localeCategory),
            value: res.data.pyOperatorInfo.pyOrganization
              ? res.data.pyOperatorInfo.pyOrganization
              : fillerString
          },
          {
            id: 'ReportToUserName',
            name: localizedVal('Reports to', localeCategory),
            value: res.data.pyOperatorInfo.pyReportToUserName
              ? res.data.pyOperatorInfo.pyReportToUserName
              : fillerString
          },
          {
            id: 'pyTelephone',
            name: localizedVal('Telephone', localeCategory),
            value: res.data.pyOperatorInfo.pyTelephone ? (
              <a href={`tel:${res.data.pyOperatorInfo.pyTelephone}`}>
                {res.data.pyOperatorInfo.pyTelephone}
              </a>
            ) : (
              fillerString
            )
          },
          {
            id: 'pyEmailAddress',
            name: localizedVal('Email address', localeCategory),
            value: res.data.pyOperatorInfo.pyEmailAddress ? (
              <a href={`mailto:${res.data.pyOperatorInfo.pyEmailAddress}`}>
                {res.data.pyOperatorInfo.pyEmailAddress}
              </a>
            ) : (
              fillerString
            )
          }
        ];
      } else {
        // eslint-disable-next-line no-console
        console.log(
          `Operator: PCore.getUserApi().getOperatorDetails(${caseOpId}); returned empty res.data.pyOperatorInfo.pyUserName - adding default`
        );
        fields = [
          {
            id: 'pyPosition',
            name: localizedVal('Position', localeCategory),
            value: fillerString
          },
          {
            id: 'pyOrganization',
            name: localizedVal('Organization', localeCategory),
            value: fillerString
          },
          {
            id: 'ReportToUserName',
            name: localizedVal('Reports to', localeCategory),
            value: fillerString
          },
          {
            id: 'pyTelephone',
            name: localizedVal('Telephone', localeCategory),
            value: fillerString
          },
          {
            id: 'pyEmailAddress',
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
    return (
      <Grid container className={classes.popover} spacing={1}>
        <Grid item xs={12}>
          <Typography variant='h6'>{caseOpName}</Typography>
        </Grid>
        {popoverFields.map(field => {
          return (
            <React.Fragment key={field.id}>
              <Grid container item xs={12} spacing={1}>
                <Grid item xs={6}>
                  <Typography variant='caption'>{field.name}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant='subtitle2'>{field.value}</Typography>
                </Grid>
              </Grid>
            </React.Fragment>
          );
        })}
      </Grid>
    );
  }

  // End of popover-related

  return (
    <React.Fragment>
      <TextField
        defaultValue={caseOpName}
        label={caseOpLabel}
        onClick={showOperatorDetails}
        InputProps={{
          readOnly: true,
          disableUnderline: true,
          inputProps: { style: { cursor: 'pointer' } }
        }}
      />
      <br />
      {Utils.generateDateTime(caseTime, 'DateTime-Since')}

      <Popover
        id={popoverId}
        open={popoverOpen}
        anchorEl={popoverAnchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        PaperProps={{ style: { maxWidth: '45ch' } }}
      >
        {getPopoverGrid()}
      </Popover>
    </React.Fragment>
  );
}

Operator.defaultProps = {};

Operator.propTypes = {
  caseOpConfig: PropTypes.object.isRequired
};
