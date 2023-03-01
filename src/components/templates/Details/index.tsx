import React from 'react';
import PropTypes from "prop-types";
import Grid from '@material-ui/core/Grid';
import DetailsFields from '../../designSystemExtensions/DetailsFields';

export default function Details(props) {
  const { children, label, showLabel, getPConnect } = props;
  const arFields: Array<any> = [];

  // Get the inherited props from the parent to determine label settings
  const propsToUse = { label, showLabel, ...getPConnect().getInheritedProps() };

  for (const child of children) {
    const theChildPConn = child.props.getPConnect();
    theChildPConn.setInheritedProp('displayMode', 'LABELS_LEFT');
    theChildPConn.setInheritedProp('readOnly', true);
    const theChildrenOfChild = theChildPConn.getChildren();
    arFields.push(theChildrenOfChild);
  }

  return (
    <div id='DetailsOneColumn'>
      {propsToUse.showLabel && (
        <div className='template-title-container'>
          <span>{propsToUse.label}</span>
        </div>
      )}
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <DetailsFields fields={arFields[0]} />
        </Grid>
      </Grid>
    </div>
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
};
