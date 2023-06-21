/* eslint-disable react/no-array-index-key */
import React, { createElement, isValidElement } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
// import { green } from "@material-ui/core/colors";
import createPConnectComponent from '../../../bridge/react_pconnect';
import { format } from '../../../helpers/formatters/';

const useStyles = makeStyles(theme => ({
  root: {
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
    // borderLeft: "6px solid",
    // borderLeftColor: green[300]
  },
  fieldLabel: {
    display: 'block',
    fontWeight: 400,
    color: theme.palette.text.secondary
  },
  fieldValue: {
    fontWeight: 400,
    color: theme.palette.text.primary
  }
}));

export default function DetailsFields(props) {
  // const componentName = "DetailsFields";
  const { fields } = props;
  const classes = useStyles();
  const fieldComponents: Array<any> = [];

  fields?.forEach((field, index) => {
    const thePConn = field.getPConnect();
    const theCompType = thePConn.getComponentName().toLowerCase();
    const { label, value } = thePConn.getConfigProps();
    // If value is "" then also we would have to get viewMetadata using getReferencedView.
    if (theCompType === 'reference' || value === '') {
      const configObj = thePConn?.getReferencedView();
      if(configObj){
        configObj.config.readOnly = theCompType === 'reference';
        configObj.config.displayMode = 'LABELS_LEFT';
        const propToUse = { ...thePConn.getInheritedProps() };
        configObj.config.label = theCompType === 'reference' ? propToUse?.label : label;

      fieldComponents.push({
        type: theCompType,
        label,
        value: (
          <React.Fragment key={index}>
            {createElement(createPConnectComponent(), thePConn.getReferencedViewPConnect())}
          </React.Fragment>
        )
      });
    }
    } else {
      fieldComponents.push({ type: theCompType, value, label });
    }
  });

  function getGridItemLabel(field: any, keyVal: string) {
    const dispValue = field.label;

    return (
      <Grid item xs={6} key={keyVal}>
        <Typography variant='body2' component='span' className={`${classes.fieldLabel}`}>
          {dispValue}
        </Typography>
      </Grid>
    );
  }

  function formatItemValue(inField: any) {
    const { type, value } = inField;
    let formattedVal = value;

    // eslint-disable-next-line sonarjs/no-small-switch
    switch (type) {
      case 'date':
        formattedVal = format(value, type);
        break;

      default:
        // No match means we return the value as we received it
        break;
    }

    // Finally, if the value is undefined or an empty string, we want to display it as "---"
    if (formattedVal === undefined || formattedVal === '') {
      formattedVal = '---';
    }

    return formattedVal;
  }

  function getGridItemValue(field: any, keyVal: string) {
    const formattedValue = formatItemValue(field);

    return (
      <Grid item xs={6} key={keyVal}>
        <Typography variant='body2' component='span' className={classes.fieldValue}>
          {formattedValue}
        </Typography>
      </Grid>
    );
  }

  function getGridItem(field: any, keyVal: string) {

    return (
      <Grid item xs={12} key={keyVal}>
        <Typography variant='body2' component='span' className={classes.fieldValue}>
          {field?.value}
        </Typography>
      </Grid>
    );
  }

  function getGridItems() {
    const gridItems: Array<any> = fieldComponents.map((field, index) => {
      if (field?.type === 'reference') {
        return field?.value;
      } else if (isValidElement(field?.value)) {
        return (
          <Grid container spacing={1} style={{ padding: '4px 0px' }} key={index}>
            {getGridItem(field, `${index}-item`)}
          </Grid>
        );
      } else {
        return (
          <Grid container spacing={1} style={{ padding: '4px 0px' }} key={index}>
            {getGridItemLabel(field, `${index}-label`)}
            {getGridItemValue(field, `${index}-value`)}
          </Grid>
        );
      }
    });
    return gridItems;
  }

  return <React.Fragment>{getGridItems()}</React.Fragment>;
}

DetailsFields.defaultProps = {
  fields: []
};

DetailsFields.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.any)
};
