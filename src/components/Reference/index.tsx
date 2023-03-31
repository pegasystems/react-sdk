import React from "react";
import PropTypes from "prop-types";

export default function Reference(props) {
  const { visibility, context, getPConnect, readOnly, displayMode, displayOrder } = props;

  const pConnect = getPConnect();
  const referenceConfig = { ...pConnect.getComponentConfig() } || {};

  delete referenceConfig?.name;
  delete referenceConfig?.type;
  delete referenceConfig?.visibility;

  const viewMetadata = pConnect.getReferencedView();

  if (!viewMetadata) {
    // console.log("View not found ", pConnect.getComponentConfig());
    return null;
  }

  const viewObject = {
    ...viewMetadata,
    config: {
      ...viewMetadata.config,
      ...referenceConfig
    }
  };

  const viewComponent = pConnect.createComponent(viewObject, null, null, {
    pageReference: context,
    ...pConnect.getStateProps(),
    displayOrder,
  });

  viewComponent.props.getPConnect().setInheritedConfig({
    ...referenceConfig,
    readOnly,
    displayMode
  });

  if (visibility !== false) {
    return <React.Fragment>{viewComponent}</React.Fragment>;
  }
  return null;
}

Reference.defaultProps = {
  visibility: true,
  context: null,
  readOnly: false,
  displayMode: null
};

Reference.propTypes = {
  getPConnect: PropTypes.func.isRequired,
  visibility: PropTypes.bool,
  context: PropTypes.string,
  readOnly: PropTypes.bool,
  displayMode: PropTypes.string
};
