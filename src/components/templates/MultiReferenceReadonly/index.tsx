import PropTypes from "prop-types";
import React from "react";

declare const PCore;
export default function MultiReferenceReadonly(props) {
  const { getPConnect, label, hideLabel, config } = props;
  const { referenceList, readonlyContextList } = config;

  // When referenceList does not contain selected values, it should be replaced with readonlyContextList while calling SimpleTableManual
  let readonlyContextObject;
  if ( !PCore.getAnnotationUtils().isProperty(referenceList)) {
    readonlyContextObject = {
      referenceList: readonlyContextList
    };
  }

  const component =  getPConnect().createComponent({
    type: "SimpleTable",
    config: {
      ...config,
      ...readonlyContextObject,
      label,
      hideLabel
    }
  });

   return (
    <React.Fragment>{component}</React.Fragment>
  )
}

MultiReferenceReadonly.defaultProps = {
  label: "",
  hideLabel: false
};

MultiReferenceReadonly.propTypes = {
  config: PropTypes.object.isRequired,
  getPConnect: PropTypes.func.isRequired,
  label: PropTypes.string,
  hideLabel: PropTypes.bool
};
