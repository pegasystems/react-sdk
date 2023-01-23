import React from "react";
// import PropTypes from "prop-types";
import Grid from '@material-ui/core/Grid';
import DetailsFields from '../../designSystemExtensions/DetailsFields';

export default function Details(props) {
  const { children } = props;
  const arFields: Array<any> = [];

  for (const child of children) {
    const theChildPConn = child.props.getPConnect();
    theChildPConn.setInheritedProp('displayMode', 'LABELS_LEFT');
    theChildPConn.setInheritedProp('readOnly', true);
    const theChildrenOfChild = theChildPConn.getChildren();
    arFields.push(theChildrenOfChild);
  }

  return (
      <div id="DetailsOneColumn">
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <DetailsFields fields={arFields[0]} />
          </Grid>
        </Grid>
      </div>
    );
}

Details.defaultProps = {
  // children: []
}

Details.propTypes = {
  // children: PropTypes.arrayOf(PropTypes.node)
};
