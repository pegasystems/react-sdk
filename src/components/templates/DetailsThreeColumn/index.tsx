import React from 'react';
// import PropTypes from "prop-types";
import Grid from '@material-ui/core/Grid';
import DetailsFields from '../../designSystemExtensions/DetailsFields';

export default function DetailsThreeColumn(props) {
  const { children } = props;
  const arFields: Array<any> = [];

  for (const child of children) {
    const theChildPConn = child.props.getPConnect();
    const theChildrenOfChild = theChildPConn.getChildren();
    arFields.push(theChildrenOfChild);
  }

  if (arFields.length !== 3) {
    // eslint-disable-next-line no-console
    console.error(`DetailsThreeColumn expects 3 children and received ${arFields.length}`);
  }

  return (
    <div id='DetailsThreeColumn'>
      <Grid container spacing={1}>
        <Grid item xs={4}>
          <DetailsFields fields={arFields[0]} />
        </Grid>
        <Grid item xs={4}>
          <DetailsFields fields={arFields[1]} />
        </Grid>
        <Grid item xs={4}>
          <DetailsFields fields={arFields[2]} />
        </Grid>
      </Grid>
    </div>
  );
}

DetailsThreeColumn.propTypes = {
  // showLabel: PropTypes.bool,
  // label: PropTypes.string,
  // getPConnect: PropTypes.func.isRequired,
  // template: PropTypes.string.isRequired
};
