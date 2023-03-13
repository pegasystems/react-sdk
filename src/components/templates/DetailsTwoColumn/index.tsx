import React, { createElement } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import createPConnectComponent from '../../../bridge/react_pconnect';
import FieldGroup from '../../designSystemExtensions/FieldGroup';

export default function DetailsTwoColumn(props) {
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
        {children.map(child => (
          <Grid item xs={6}>
            {child}
          </Grid>
        ))}
      </Grid>
    </FieldGroup>
  );
}

DetailsTwoColumn.defaultProps = {
  label: undefined,
  showLabel: true
};

DetailsTwoColumn.propTypes = {
  showLabel: PropTypes.bool,
  label: PropTypes.string,
  getPConnect: PropTypes.func.isRequired
};
