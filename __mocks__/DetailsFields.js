/* eslint-disable react/no-array-index-key */
import React, { createElement, isValidElement } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { format } from "@pega/react-sdk-components/lib/components/helpers/formatters/index";

import createPConnectComponent from "./react_pconnect";


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
    const fieldComponents = [];
        fields?.forEach((field, index) => {
        const thePConn = field.getPConnect();
        const theCompType = thePConn.getComponentName().toLowerCase();
        const { label } = thePConn.getConfigProps();
        const configObj = thePConn?.getReferencedView();
        configObj.config.readOnly = true;
        configObj.config.displayMode = 'LABELS_LEFT';
        const propToUse = { ...thePConn.getInheritedProps() };
        configObj.config.label = theCompType === 'reference' ? propToUse?.label : label;
        fieldComponents.push({
            type: theCompType,
            label,
            value: (React.createElement(React.Fragment, { key: index }, createElement(createPConnectComponent(), thePConn.getReferencedViewPConnect())))
        });
    });
    function getGridItemLabel(field, keyVal) {
        const dispValue = field.label;
        return (React.createElement(Grid, { item: true, xs: 6, key: keyVal },
            React.createElement(Typography, { variant: 'body2', component: 'span', className: `${classes.fieldLabel}` }, dispValue)));
    }
    function formatItemValue(inField) {
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
    function getGridItemValue(field, keyVal) {
        const formattedValue = formatItemValue(field);
        return (React.createElement(Grid, { item: true, xs: 6, key: keyVal },
            React.createElement(Typography, { variant: 'body2', component: 'span', className: classes.fieldValue }, formattedValue)));
    }
    function getGridItem(field, keyVal) {
      //const formattedValue = formatItemValue(field);
        return (React.createElement(Grid, { item: true, xs: 12, key: keyVal },
            React.createElement(Typography, { variant: 'body2', component: 'span', className: classes.fieldValue }, field?.value)));
    }
    function getGridItems() {
        const gridItems = fieldComponents.map((field, index) => {
            if (field?.type === 'reference') {
                return field?.value;
            }
            else if (isValidElement(field?.value)) {
                return (React.createElement(Grid, { container: true, spacing: 1, style: { padding: '4px 0px' }, key: index }, getGridItem(field, `${index}-item`)));
            }
            else {
                return (React.createElement(Grid, { container: true, spacing: 1, style: { padding: '4px 0px' }, key: index },
                    getGridItemLabel(field, `${index}-label`),
                    getGridItemValue(field, `${index}-value`)));
            }
        });
        return gridItems;
    }
    return React.createElement(React.Fragment, null, getGridItems());
}
DetailsFields.defaultProps = {
    fields: []
};
DetailsFields.propTypes = {
    fields: PropTypes.arrayOf(PropTypes.any)
};
//# sourceMappingURL=DetailsFields.js.map

export function decorator(story) {
  return story();
}
