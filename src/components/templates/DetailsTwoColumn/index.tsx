import React from "react";
// import PropTypes from "prop-types";
import Grid from '@material-ui/core/Grid';
import DetailsFields from '../../designSystemExtensions/DetailsFields';

export default function DetailsTwoColumn(props) {
  const { children } = props;
  const arFields: Array<any> = [];

  for (const child of children) {
    const theChildPConn = child.props.getPConnect();
    theChildPConn.setInheritedProp('displayMode', 'LABELS_LEFT');
    theChildPConn.setInheritedProp('readOnly', true);
    const theChildrenOfChild = theChildPConn.getChildren();
    arFields.push(theChildrenOfChild);
  }

  if (arFields.length !== 2) {
    // eslint-disable-next-line no-console
    console.error(`DetailsTwoColumn expects 2 children and received ${arFields.length}`);
  }


  return (
    <div id="DetailsTwoColumn">
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <DetailsFields fields={arFields[0]} />
        </Grid>
        <Grid item xs={6}>
          <DetailsFields fields={arFields[1]} />
        </Grid>
      </Grid>
    </div>
  )
}

DetailsTwoColumn.propTypes = {
  // showLabel: PropTypes.bool,
  // label: PropTypes.string,
  // getPConnect: PropTypes.func.isRequired,
  // template: PropTypes.string.isRequired
};
