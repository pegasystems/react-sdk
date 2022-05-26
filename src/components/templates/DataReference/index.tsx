import React, { useMemo } from "react";
import PropTypes from "prop-types";

const SELECTION_MODE = { SINGLE: 'single', MULTI: 'multi' };
declare const PCore: any;
export default function DataReference(props) {
  const {
    children,
    getPConnect,
    label,
    showLabel,
    displayMode,
    allowAndPersistChangesInReviewMode,
    referenceType,
    selectionMode,
    displayAs,
   // ruleClass,
    parameters,
    hideLabel
  } = props;
  let childrenToRender = children;
  const pConn = getPConnect();
  const dropDownDataSource = null;
  // const [dropDownDataSource, setDropDownDataSource] = useState(null);
  const propsToUse = { label, showLabel, ...pConn.getInheritedProps() };
  if (propsToUse.showLabel === false) {
    propsToUse.label = '';
  }
  const rawViewMetadata = pConn.getRawMetadata();
  const viewName = rawViewMetadata.name;
  const [firstChildMeta] = rawViewMetadata.children;
  const refList = rawViewMetadata.config.referenceList;
  const canBeChangedInReviewMode =
    allowAndPersistChangesInReviewMode && (displayAs === 'autocomplete' || displayAs === 'dropdown');
  let propName;
  const isDisplayModeEnabled = ['LABELS_LEFT', 'STACKED_LARGE_VAL'].includes(displayMode);

  if (firstChildMeta?.type !== 'Region') {
    const firstChildPConnect = getPConnect().getChildren()[0].getPConnect;
    /* remove refresh When condition from those old view so that it will not be used for runtime */
    if (firstChildMeta.config?.readOnly) {
      delete firstChildMeta.config.readOnly;
    }
    if (firstChildMeta?.type === 'Dropdown') {
      firstChildMeta.config.datasource.source = rawViewMetadata.config?.parameters
        ? dropDownDataSource
        : '@DATASOURCE '.concat(refList).concat('.pxResults');
    } else if (firstChildMeta?.type === 'AutoComplete') {
      firstChildMeta.config.datasource = refList;

      /* Insert the parameters to the component only if present */
      if (rawViewMetadata.config?.parameters) {
        firstChildMeta.config.parameters = parameters;
      }
    }
    // set displayMode conditionally
    if (!canBeChangedInReviewMode) {
      firstChildMeta.config.displayMode = displayMode;
    }
    if (firstChildMeta.type === 'SimpleTableSelect' && selectionMode === SELECTION_MODE.MULTI) {
      propName = PCore.getAnnotationUtils().getPropertyName(firstChildMeta.config.selectionList);
    } else {
      propName = PCore.getAnnotationUtils().getPropertyName(firstChildMeta.config.value);
    }

    const handleSelection = (event) => {
      const caseKey = pConn.getCaseInfo().getKey();
      const refreshOptions = { autoDetectRefresh: true };
      if (canBeChangedInReviewMode && pConn.getValue('__currentPageTabViewName')) {
        getPConnect()
          .getActionsApi()
          .refreshCaseView(caseKey, pConn.getValue('__currentPageTabViewName'), null, refreshOptions);
        PCore.getDeferLoadManager().refreshActiveComponents(pConn.getContextName());
      } else {
        const pgRef = pConn.getPageReference().replace('caseInfo.content', '');
        getPConnect().getActionsApi().refreshCaseView(caseKey, viewName, pgRef, refreshOptions);
      }

      // AutoComplete sets value on event.id whereas Dropdown sets it on event.target.value
      const propValue = event?.id || event?.target.value;
      if (propValue && canBeChangedInReviewMode && isDisplayModeEnabled) {
        PCore.getDataApiUtils()
          .getCaseEditLock(caseKey)
          .then((caseResponse) => {
            const pageTokens = pConn.getPageReference().replace('caseInfo.content', '').split('.');
            let curr = {};
            const commitData = curr;

            pageTokens.forEach((el) => {
              if (el !== '') {
                curr[el] = {};
                curr = curr[el];
              }
            });

            // expecting format like {Customer: {pyID:"C-100"}}
            const propArr = propName.split('.');
            propArr.forEach((element, idx) => {
              if (idx + 1 === propArr.length) {
                curr[element] = propValue;
              } else {
                curr[element] = {};
                curr = curr[element];
              }
            });

            PCore.getDataApiUtils()
              .updateCaseEditFieldsData(
                caseKey,
                { [caseKey]: commitData },
                caseResponse.headers.etag,
                pConn.getContextName()
              )
              .then((response) => {
                PCore.getContainerUtils().updateChildContainersEtag(pConn.getContextName(), response.headers.etag);
              });
          });
      }
    };

    // Re-create first child with overridden props
    // Memoized child in order to stop unmount and remount of the child component when data reference
    // rerenders without any actual change
    const recreatedFirstChild = useMemo(() => {
      const { type, config } = firstChildMeta;

      pConn.clearErrorMessages({
        property: propName
      });
      if (!canBeChangedInReviewMode && isDisplayModeEnabled && selectionMode === SELECTION_MODE.SINGLE) {
        return null;
        // return (
        //   <SingleReferenceReadonly
        //     config={config}
        //     getPConnect={firstChildPConnect}
        //     label={propsToUse.label}
        //     type={type}
        //     displayAs={displayAs}
        //     displayMode={displayMode}
        //     ruleClass={ruleClass}
        //     referenceType={referenceType}
        //     hideLabel={hideLabel}
        //     dataRelationshipContext={
        //       rawViewMetadata.config.contextClass && rawViewMetadata.config.name ? rawViewMetadata.config.name : null
        //     }
        //   />
        // );
      }

      if (isDisplayModeEnabled && selectionMode === SELECTION_MODE.MULTI) {
        return null;
        // return (
        //   <MultiReferenceReadonly
        //     config={config}
        //     getPConnect={firstChildPConnect}
        //     displayAs={displayAs}
        //     label={propsToUse.label}
        //     hideLabel={hideLabel}
        //   />
        // );
      }

      // In the case of a datasource with parameters you cannot load the dropdown before the parameters
      if (type === 'Dropdown' && rawViewMetadata.config?.parameters && dropDownDataSource === null) {
        return null;
      }

      return firstChildPConnect().createComponent({
        type,
        config: {
          ...config,
          required: propsToUse.required,
          visibility: propsToUse.visibility,
          disabled: propsToUse.disabled,
          label: propsToUse.label,
          viewName: getPConnect().getCurrentView(),
          parameters: rawViewMetadata.config.parameters,
          readOnly: false,
          localeReference: rawViewMetadata.config.localeReference,
          ...(selectionMode === SELECTION_MODE.SINGLE ? { referenceType } : ''),
          dataRelationshipContext:
            rawViewMetadata.config.contextClass && rawViewMetadata.config.name ? rawViewMetadata.config.name : null,
          hideLabel,
          onRecordChange: handleSelection
        }
      });
    }, [
      firstChildMeta.config?.datasource?.source,
      parameters,
      dropDownDataSource,
      propsToUse.required,
      propsToUse.disabled
    ]);

    // Only include the views region for rendering when it has content
    const viewsRegion = rawViewMetadata.children[1];
    if (viewsRegion?.name === 'Views' && viewsRegion.children.length) {
      childrenToRender = [recreatedFirstChild, ...children.slice(1)];
    } else {
      childrenToRender = [recreatedFirstChild];
    }
  }

  return childrenToRender.length === 1 ? (
    childrenToRender[0] ?? null
  ) : (
    <div>
      {childrenToRender.map((child, i) => (
        <React.Fragment key={i}>{child}</React.Fragment>
      ))}
    </div>
  );

}

DataReference.defaultProps = {
  label: undefined,
  showLabel: undefined,
  displayMode: undefined,
  allowAndPersistChangesInReviewMode: false,
  referenceType: '',
  selectionMode: '',
  displayAs: '',
  // ruleClass: '',
  parameters: undefined,
  hideLabel: false
};

DataReference.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
  getPConnect: PropTypes.func.isRequired,
  label: PropTypes.string,
  showLabel: PropTypes.func,
  displayMode: PropTypes.string,
  allowAndPersistChangesInReviewMode: PropTypes.bool,
  referenceType: PropTypes.string,
  selectionMode: PropTypes.string,
  displayAs: PropTypes.string,
  // ruleClass: PropTypes.string,
  parameters: PropTypes.arrayOf(PropTypes.string), // need to fix
  hideLabel: PropTypes.bool
};
