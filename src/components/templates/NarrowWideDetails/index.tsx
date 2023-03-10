import React, { createElement } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { GridSize } from '@material-ui/core/Grid';
import createPConnectComponent from '../../../bridge/react_pconnect';
import FieldGroup from '../../designSystemExtensions/FieldGroup';

const COLUMN_WIDTHS = [4, 8];

export default function NarrowWideDetails(props) {
  const { label, showLabel, getPConnect } = props;

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
        {children.map((child, i) => (
          <Grid item xs={COLUMN_WIDTHS[i] as GridSize}>
            {child}
          </Grid>
        ))}
      </Grid>
    </FieldGroup>
  );
}

NarrowWideDetails.defaultProps = {
  label: undefined,
  showLabel: true
};

NarrowWideDetails.propTypes = {
  showLabel: PropTypes.bool,
  label: PropTypes.string,
  getPConnect: PropTypes.func.isRequired
};
