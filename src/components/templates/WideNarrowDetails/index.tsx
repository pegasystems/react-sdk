import React from "react";
// import PropTypes from "prop-types";
// import Grid from '@material-ui/core/Grid';
import DetailsFields from '../../designSystemExtensions/DetailsFields';

export default function WideNarrowDetails(props) {
  const { a, b, children } = props;
  const arFields: Array<any> = [];

  for (const child of children) {
    const theChildPConn = child.props.getPConnect();
    const theChildrenOfChild = theChildPConn.getChildren();
    arFields.push(theChildrenOfChild);
  }

  if (arFields.length !== 2) {
    // eslint-disable-next-line no-console
    console.error(`WideNarrowDetails expects 2 children and received ${arFields.length}`);
  }


  return (
    <React.Fragment>
    {children && children.length === 2 &&
      <div className="psdk-wide-narrow-column">
        <div className="psdk-wide-column-column">
          <DetailsFields fields={arFields[0]} />
        </div>
        <div className="psdk-narrow-column-column">
          <DetailsFields fields={arFields[1]} />
        </div>
      </div>
    }
    {a && b &&
      <div className="psdk-wide-narrow-column">
        <div className="psdk-wide-column-column">
          {a}
        </div>
        <div className="psdk-narrow-column-column">
          {b}
        </div>
      </div>
    }
    </React.Fragment>
  )

}

WideNarrowDetails.propTypes = {
  // showLabel: PropTypes.bool,
  // label: PropTypes.string,
  // getPConnect: PropTypes.func.isRequired,
  // template: PropTypes.string.isRequired
};
