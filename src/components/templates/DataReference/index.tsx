import React, { useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import SingleReferenceReadonly from '../SingleReferenceReadonly';
import MultiReferenceReadonly from '../MultiReferenceReadonly';

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
    ruleClass,
    parameters,
    hideLabel
  } = props;
  let childrenToRender = children;
  const pConn = getPConnect();
  const [dropDownDataSource, setDropDownDataSource] = useState(null);
  const propsToUse = { label, showLabel, ...pConn.getInheritedProps() };
  if (propsToUse.showLabel === false) {
    propsToUse.label = '';
  }
  const rawViewMetadata = pConn.getRawMetadata();
  const viewName = rawViewMetadata.name;
  const [firstChildMeta] = rawViewMetadata.children;
  const refList = rawViewMetadata.config.referenceList;
  const canBeChangedInReviewMode = allowAndPersistChangesInReviewMode && (displayAs === 'autocomplete' || displayAs === 'dropdown');
  let propName;
  const isDisplayModeEnabled = ['LABELS_LEFT', 'STACKED_LARGE_VAL'].includes(displayMode);
  let firstChildPConnect;

  /* Only for dropdown when it has param use data api to get the data back and add it to datasource */
  useEffect(() => {
    if (
      firstChildMeta?.type === "Dropdown" &&
      rawViewMetadata.config?.parameters
    ) {
      const { value, key, text } = firstChildMeta.config.datasource.fields;
      PCore.getDataApiUtils()
        .getData(refList, {
          dataViewParameters: parameters
        })
        .then((res) => {
          if (res.data.data !== null) {
            const ddDataSource = res.data.data
              .map((listItem) => ({
                key: listItem[key.split(" .", 2)[1]],
                text: listItem[text.split(" .", 2)[1]],
                value: listItem[value.split(" .", 2)[1]]
              }))
              .filter((item) => item.key);
            // Filtering out undefined entries that will break preview
            setDropDownDataSource(ddDataSource);
          } else {
            const ddDataSource: any = []
            setDropDownDataSource(ddDataSource);
          }
        })
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.error(err?.stack);
          return Promise.resolve({
            data: { data: [] }
          });
        });
    }
  }, [firstChildMeta, rawViewMetadata, parameters]);

  if (firstChildMeta?.type !== 'Region') {
    firstChildPConnect = getPConnect().getChildren()[0].getPConnect;
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
  }

  const handleSelection = event => {
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
        .then(caseResponse => {
          const pageTokens = pConn.getPageReference().replace('caseInfo.content', '').split('.');
          let curr = {};
          const commitData = curr;

          pageTokens.forEach(el => {
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
            .then(response => {
              PCore.getContainerUtils().updateChildContainersEtag(
                pConn.getContextName(),
                response.headers.etag
              );
            });
        });
    }
  };

  // Re-create first child with overridden props
  // Memoized child in order to stop unmount and remount of the child component when data reference
  // rerenders without any actual change
  const recreatedFirstChild = useMemo(() => {
    const { type, config } = firstChildMeta;
    if (firstChildMeta?.type !== 'Region') {
      pConn.clearErrorMessages({
        property: propName
      });
      if (!canBeChangedInReviewMode && isDisplayModeEnabled && selectionMode === SELECTION_MODE.SINGLE) {
        return (
          <SingleReferenceReadonly
            config={config}
            getPConnect={firstChildPConnect}
            label={propsToUse.label}
            type={type}
            displayAs={displayAs}
            displayMode={displayMode}
            ruleClass={ruleClass}
            referenceType={referenceType}
            hideLabel={hideLabel}
            dataRelationshipContext={
              rawViewMetadata.config.contextClass && rawViewMetadata.config.name ? rawViewMetadata.config.name : null
            }
          />
        );
      }

      if (isDisplayModeEnabled && selectionMode === SELECTION_MODE.MULTI) {
        return (
          <MultiReferenceReadonly
            config={config}
            getPConnect={firstChildPConnect}
            label={propsToUse.label}
            hideLabel={hideLabel}
          />
        );
      }

      // In the case of a datasource with parameters you cannot load the dropdown before the parameters
      if (
        type === 'Dropdown' &&
        rawViewMetadata.config?.parameters &&
        dropDownDataSource === null
      ) {
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
            rawViewMetadata.config.contextClass && rawViewMetadata.config.name
              ? rawViewMetadata.config.name
              : null,
          hideLabel,
          onRecordChange: handleSelection
        }
      });
    }
  }, [
    firstChildMeta.config?.datasource?.source,
    parameters,
    dropDownDataSource,
    propsToUse.required,
    propsToUse.disabled
  ]);

  // Only include the views region for rendering when it has content
  if (firstChildMeta?.type !== 'Region') {
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
      {childrenToRender.map(child => (
        <React.Fragment>{child}</React.Fragment>
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
  ruleClass: '',
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
  ruleClass: PropTypes.string,
  parameters: PropTypes.arrayOf(PropTypes.string), // need to fix
  hideLabel: PropTypes.bool
};
