import React from "react";
import PropTypes from "prop-types";

import CaseSummaryFields from '../../designSystemExtensions/CaseSummaryFields';

export default function CaseSummary(props) {
  const { getPConnect, children } = props;
  const thePConn = getPConnect();
  const theConfigProps = thePConn.getConfigProps();
  const { status, showStatus } = theConfigProps;

  // from Nebula
  // get the primary and secondary fields with the raw data (which has the non-resolved property values)
  // const regionsRaw = getPConnect().getRawMetadata().children;
  // const primaryFieldsRaw = regionsRaw[0].children;
  // const secondaryFieldsRaw = regionsRaw[1].children;

  // From other SDKs
  // may want to move these into useEffect/useState combo
  let arPrimaryFields:Array<any> = [];
  let arSecondaryFields:Array<any> = [];

  for (const child of children) {
    const childPConn = child.props.getPConnect();
    const childPConnData = childPConn.resolveConfigProps(childPConn.getRawMetadata());
    if (childPConnData.name.toLowerCase() === "primary fields") {
      arPrimaryFields = childPConnData.children;
    } else if (childPConnData.name.toLowerCase() === "secondary fields") {
      arSecondaryFields = childPConnData.children;
    }
  }

  // At this point, should hand off to another component for layout and rendering
  //  of primary and secondary fields in the Case Summary

  // debugging/investigation help
  // console.log(`CaseSummary: arPrimaryFields: ${JSON.stringify(arPrimaryFields)}`);
  // console.log(`CaseSummary: arSecondaryFields: ${JSON.stringify(arSecondaryFields)}`);

  return (
    <div id="CaseSummary">
      <CaseSummaryFields status={status} showStatus={showStatus} theFields={arPrimaryFields} />
      <CaseSummaryFields theFields={arSecondaryFields} />
    </div>
  )
}

CaseSummary.propTypes = {
  getPConnect: PropTypes.func.isRequired
};
