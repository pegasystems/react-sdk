import React from "react";
// import { FieldValueList, Text, URLDisplay } from "@pega/cosmos-react-core";
import PropTypes from "prop-types";
import semanticUtils from "./utils";
import URLComponent from '../URL';

declare const PCore: any;

export default function SemanticLink(props) {
  console.log('SemanticLink props', props);
  const {
    text,
    resourcePayload = {},
    resourceParams,
    getPConnect,
    previewKey,
    onClick,
    testId,
    displayMode,
    label,
    referenceType,
    previewable,
    variant,
    hideLabel,
    dataRelationshipContext,
    ...restProps
  } = props;

  const { ACTION_OPENWORKBYHANDLE, ACTION_SHOWDATA } =
    PCore.getSemanticUrlUtils().getActions();
  const pConnect = getPConnect();
  const {
    RESOURCE_TYPES: { DATA },
    WORKCLASS,
    CASE_INFO: {CASE_INFO_CLASSID}
  } = PCore.getConstants();

  let linkURL = "";
  let payload: any = {};
  let dataContext;
  let linkComponentProps: any = {
    href: linkURL,
    previewable: false
  };
  /* TODO : In case of duplicate search case the classID is Work- need to set it to
  the current case class ID */
  if(resourcePayload.caseClassName === WORKCLASS){
    resourcePayload.caseClassName = pConnect.getValue(CASE_INFO_CLASSID);
  }
  function onPreview() {
    const actionsAPI = getPConnect().getActionsApi();
    if (referenceType && referenceType.toUpperCase() === DATA) {
      actionsAPI.showDataPreview(dataContext, payload);
    } else {
      actionsAPI.showCasePreview(encodeURI(previewKey), {
        caseClassName: resourcePayload.caseClassName
      });
    }
  }

  if (referenceType && referenceType.toUpperCase() === DATA) {
    try {
      const dataRefContext = semanticUtils.getDataReferenceInfo(pConnect, dataRelationshipContext);
      dataContext = dataRefContext.dataContext;
      payload = dataRefContext.dataContextParameters;
      if (dataContext && payload) {
        linkURL = PCore.getSemanticUrlUtils().getResolvedSemanticURL(
          ACTION_SHOWDATA,
          { pageName: "pyDetails", dataContext },
          {
            dataContext,
            ...payload
          }
        );
      }
    } catch (error) {
      console.log("Error in getting the data reference info", error);
    }
  } else {
    // BUG-678282 fix to handle scenario when workID was not populated.
    // Check renderParentLink in Caseview / CasePreview
    resourceParams.workID = (resourceParams.workID === "" && typeof previewKey === "string") ? previewKey.split(" ")[1] : resourceParams.workID;
    linkURL = PCore.getSemanticUrlUtils().getResolvedSemanticURL(
      ACTION_OPENWORKBYHANDLE,
      resourcePayload,
      resourceParams
    );
  }

  linkComponentProps = {
    ...linkComponentProps,
    href: linkURL
  };

  if (previewable) {
    linkComponentProps = {
      ...linkComponentProps,
      previewable: true,
      onPreview
    };
  }
  console.log('linkComponentProps', linkComponentProps);
  console.log('restProps', restProps);
  // Link component is replaced with URLDisplay to support double em dash incase text is empty.
  // Link component didn't have support for dash. URLDisplay will inherently call Link so all functionalities are intact
  const linkComponent = (
    <span>
      <URLComponent
      {...linkComponentProps}
      {...restProps}
      value={semanticUtils.isLinkTextEmpty(text) ? "" : linkURL}
      onClick={onClick}
      data-testid={testId}
      displayText={text}
    />
    </span>
  );

  // if (displayMode === "LABELS_LEFT" || (displayMode === null && label !== undefined)) {
  //   return (
  //     <FieldValueList
  //       variant={(hideLabel || (displayMode === null && label !== undefined)) ? "stacked" : variant}
  //       fields={[{ id: "1234", name: hideLabel ? '' : label, value: linkComponent }]}
  //     />
  //   );
  // }

  // if (displayMode === "STACKED_LARGE_VAL") {
  //   return (
  //     <FieldValueList
  //       variant="stacked"
  //       data-testid={testId}
  //       fields={[
  //         {
  //           id: "5678",
  //           name: hideLabel ? '' :label,
  //           value: <Text variant="h1" as="span">{linkComponent}</Text>
  //         }
  //       ]}
  //     />
  //   );
  // }

  return linkComponent;
}

SemanticLink.defaultProps = {
  onClick: undefined,
  testId: null,
  resourceParams: {},
  displayMode: null,
  previewable: true,
  variant: 'inline',
  hideLabel: false,
  dataRelationshipContext: null
};

SemanticLink.propTypes = {
  getPConnect: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  resourceParams: PropTypes.objectOf(PropTypes.any),
  resourcePayload: PropTypes.objectOf(PropTypes.any).isRequired,
  previewKey: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  testId: PropTypes.string,
  displayMode: PropTypes.string,
  label: PropTypes.string,
  previewable: PropTypes.bool,
  variant: PropTypes.string,
  hideLabel: PropTypes.bool,
  dataRelationshipContext: PropTypes.string
};
