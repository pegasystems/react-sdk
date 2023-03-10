import React, { createElement } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import createPConnectComponent from '../../../bridge/react_pconnect';
import FieldGroup from '../../designSystemExtensions/FieldGroup';

const COLUMNS_WIDTHS = {
  Details: [12],
  DetailsTwoColumn: [6, 6],
  DetailsThreeColumn: [4, 4, 4],
  NarrowWideDetails: [4, 8],
  WideNarrowDetails: [8, 4]
};

export default function Details(props) {
  const { label, showLabel, getPConnect, template } = props;

  const cols = COLUMNS_WIDTHS[template];

  // Get the inherited props from the parent to determine label settings
  const propsToUse = { label, showLabel, ...getPConnect().getInheritedProps() };

  // Set display mode prop and re-create the children so this part of the dom tree renders
  // in a readonly (display) mode instead of a editable
  getPConnect().setInheritedProp('displayMode', 'LABELS_LEFT');
  getPConnect().setInheritedProp('readOnly', true);
  const children = getPConnect()
    .getChildren()
    .map((configObject, index) =>
      createElement(createPConnectComponent(), {
        ...configObject,
        // eslint-disable-next-line react/no-array-index-key
        key: index.toString()
      })
    );

  return (
    <FieldGroup name={propsToUse.showLabel ? propsToUse.label : ''}>
      <Grid container spacing={1}>
        {children.map((child, index) => (
          <Grid item xs={cols[index]}>
            {child}
          </Grid>
        ))}
      </Grid>
    </FieldGroup>
  );
}

Details.defaultProps = {
  label: undefined,
  showLabel: true
};

Details.propTypes = {
  showLabel: PropTypes.bool,
  label: PropTypes.string,
  getPConnect: PropTypes.func.isRequired,
  template: PropTypes.string.isRequired
};
