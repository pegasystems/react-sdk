import PropTypes from "prop-types";

export default function SingleReferenceReadonly(props) {
  const {
    getPConnect,
    displayAs,
    ruleClass,
    label,
    type,
    displayMode,
    referenceType,
    hideLabel,
    dataRelationshipContext,
    config
  } = props;
  const editableComponents = ["AutoComplete", "SimpleTableSelect", "Dropdown"];

  if (editableComponents.includes(type)) {
    config.caseClass = ruleClass;
    config.text = config.primaryField;
    config.caseID = config.value;
    config.contextPage = `@P .${dataRelationshipContext}`;
    config.resourceParams = {
      "workID": displayAs === "table" ? config.selectionKey : config.value
    };
    config.resourcePayload = {
      "caseClassName": ruleClass
    };
  }

  return getPConnect().createComponent({
    type: 'SemanticLink',
    config: {
      ...config,
      label,
      displayMode,
      referenceType,
      hideLabel,
      dataRelationshipContext
    }
  });
}

SingleReferenceReadonly.defaultProps = {
  displayAs: "",
  ruleClass: "",
  label: "",
  displayMode: "",
  type: "",
  referenceType: "",
  hideLabel: false,
  dataRelationshipContext: null
};

SingleReferenceReadonly.propTypes = {
  config: PropTypes.object,
  getPConnect: PropTypes.func.isRequired,
  displayAs: PropTypes.string,
  ruleClass: PropTypes.string,
  label: PropTypes.string,
  displayMode: PropTypes.string,
  type: PropTypes.string,
  referenceType: PropTypes.string,
  hideLabel: PropTypes.bool,
  dataRelationshipContext: PropTypes.string
};
