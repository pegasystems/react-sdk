import { useMemo } from 'react';

import Grid2 from '@mui/material/Grid2';

import { SELECTION_MODE, generateColumns, getDataRelationshipContextFromKey } from './utils';
import { getComponentFromMap } from '@pega/react-sdk-components/lib/bridge/helpers/sdk_component_map';
import type { PConnFieldProps } from '@pega/react-sdk-components/lib/types/PConnProps';

interface ObjectReferenceProps extends Omit<PConnFieldProps, 'value'> {
  // If any, enter additional props that only exist on ObjectReference here
  getPConnect: any;
  displayMode;
  allowAndPersistChangesInReviewMode: any;
  targetObjectType: any;
  mode: string;
  parameters: object;
  hideLabel: boolean;
  inline: boolean;
  showPromotedFilters: boolean;
  additionalFields: any;
}

export default function ObjectReference(props: ObjectReferenceProps) {
  const {
    getPConnect,
    displayMode,
    allowAndPersistChangesInReviewMode: editableInReview = false,
    targetObjectType,
    mode = '',
    parameters,
    hideLabel = false,
    inline = false,
    showPromotedFilters = false,
    additionalFields
  } = props;

  const SingleReferenceReadonly = getComponentFromMap('SingleReferenceReadOnly');

  // Configs
  const pConn = getPConnect();
  const referenceType = targetObjectType === 'case' ? 'Case' : 'Data';
  const rawViewMetadata = pConn.getRawMetadata();
  const refFieldMetadata = pConn.getFieldMetadata(rawViewMetadata?.config?.value?.split('.', 2)[1]);

  // Destructured properties
  const propsToUse = { ...pConn.getInheritedProps(), ...props };

  // Computed variables
  const isDisplayModeEnabled = displayMode === 'DISPLAY_ONLY';
  const canBeChangedInReviewMode = editableInReview && ['Autocomplete', 'Dropdown'].includes(rawViewMetadata.config.componentType);

  // Editable first child on change handler
  const onRecordChange = event => {
    const caseKey = pConn.getCaseInfo().getKey();
    const refreshOptions = { autoDetectRefresh: true, propertyName: '' };
    refreshOptions.propertyName = rawViewMetadata.config?.value;

    if (!canBeChangedInReviewMode || !pConn.getValue('__currentPageTabViewName')) {
      const pgRef = pConn.getPageReference().replace('caseInfo.content', '');
      const viewName = rawViewMetadata.name;
      if (viewName && viewName.length > 0) {
        getPConnect().getActionsApi().refreshCaseView(caseKey, viewName, pgRef, refreshOptions);
      }
    }

    // AutoComplete sets value on event.id whereas Dropdown sets it on event.target.value if event.id is unset
    // When value is empty propValue will be undefined here and no value will be set for the reference
    const propValue = event?.id || event?.target?.value;
    const propName =
      rawViewMetadata.type === 'SimpleTableSelect' && mode === SELECTION_MODE.MULTI
        ? PCore.getAnnotationUtils().getPropertyName(rawViewMetadata.config.selectionList)
        : PCore.getAnnotationUtils().getPropertyName(rawViewMetadata.config?.value);

    if (propValue && canBeChangedInReviewMode && isDisplayModeEnabled) {
      PCore.getCaseUtils()
        .getCaseEditLock(caseKey, '')
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

          PCore.getCaseUtils()
            .updateCaseEditFieldsData(caseKey, { [caseKey]: commitData }, caseResponse.headers.etag, pConn.getContextName())
            .then(response => {
              PCore.getContainerUtils().updateParentLastUpdateTime(pConn.getContextName(), (response.data as any).data.caseInfo.lastUpdateTime);
              PCore.getContainerUtils().updateRelatedContextEtag(pConn.getContextName(), response.headers.etag);
            });
        });
    }
  };

  // Prepare first child
  const recreatedFirstChild = useMemo(() => {
    const type = rawViewMetadata.config.componentType;

    /* Read-only variants */
    if (type === 'SemanticLink' && !canBeChangedInReviewMode) {
      const config = {
        ...rawViewMetadata.config,
        primaryField: rawViewMetadata.config.displayField
      };
      config.caseClass = rawViewMetadata.config.targetObjectClass;
      config.text = config.primaryField;
      config.caseID = config.value;
      config.contextPage = `@P .${
        rawViewMetadata.config?.displayField ? getDataRelationshipContextFromKey(rawViewMetadata.config.displayField) : null
      }`;
      config.resourceParams = {
        workID: config.value
      };
      config.resourcePayload = {
        caseClassName: config.caseClass
      };

      return getPConnect().createComponent({
        type: 'SemanticLink',
        config: {
          ...config,
          displayMode,
          referenceType,
          hideLabel,
          dataRelationshipContext: rawViewMetadata.config?.displayField
            ? getDataRelationshipContextFromKey(rawViewMetadata.config.displayField)
            : null
        }
      });
    }
    if (isDisplayModeEnabled && !canBeChangedInReviewMode) {
      return (
        <SingleReferenceReadonly
          config={{
            ...rawViewMetadata.config,
            primaryField: rawViewMetadata.config.displayField
          }}
          getPConnect={getPConnect}
          label={propsToUse.label}
          type={type}
          displayAs='readonly'
          displayMode={displayMode}
          activeViewRuleClass={rawViewMetadata.config.targetObjectClass} // for older views which may not have context class set, fall back to previous behavior
          referenceType={referenceType}
          hideLabel={hideLabel}
          dataRelationshipContext={
            rawViewMetadata.config?.displayField ? getDataRelationshipContextFromKey(rawViewMetadata.config.displayField) : null
          }
          additionalFields={additionalFields}
        />
      );
    }

    // 1) Set datasource
    generateColumns(rawViewMetadata.config, pConn, referenceType);
    rawViewMetadata.config.deferDatasource = true;
    rawViewMetadata.config.listType = 'datapage';
    if (['Dropdown', 'AutoComplete'].includes(type) && !rawViewMetadata.config.placeholder) {
      rawViewMetadata.config.placeholder = '@L Select...';
    }

    // 2) Pass through configs
    rawViewMetadata.config.showPromotedFilters = showPromotedFilters;

    if (!canBeChangedInReviewMode) {
      rawViewMetadata.config.displayMode = displayMode;
    }

    // 3) Define field meta
    let fieldMetaData: any = null;

    fieldMetaData = {
      datasourceMetadata: {
        datasource: {
          parameters: {}
        }
      }
    };
    if (rawViewMetadata.config?.parameters) {
      fieldMetaData.datasourceMetadata.datasource.parameters = parameters;
    }
    fieldMetaData.datasourceMetadata.datasource.propertyForDisplayText = rawViewMetadata?.config?.datasource?.fields?.text.startsWith('@P')
      ? rawViewMetadata?.config?.datasource?.fields?.text?.substring(3)
      : rawViewMetadata?.config?.datasource?.fields?.text;
    fieldMetaData.datasourceMetadata.datasource.propertyForValue = rawViewMetadata?.config?.datasource?.fields?.value.startsWith('@P')
      ? rawViewMetadata?.config?.datasource?.fields?.value?.substring(3)
      : rawViewMetadata?.config?.datasource?.fields?.value;
    fieldMetaData.datasourceMetadata.datasource.name = rawViewMetadata.config?.referenceList;

    return getPConnect().createComponent({
      type,
      config: {
        ...rawViewMetadata.config,
        descriptors: mode === SELECTION_MODE.SINGLE ? refFieldMetadata?.descriptors : null,
        datasourceMetadata: fieldMetaData?.datasourceMetadata,
        required: propsToUse.required,
        visibility: propsToUse.visibility,
        disabled: propsToUse.disabled,
        label: propsToUse.label,
        parameters: rawViewMetadata.config.parameters,
        readOnly: false,
        localeReference: rawViewMetadata.config.localeReference,
        ...(mode === SELECTION_MODE.SINGLE ? { referenceType } : ''),
        contextClass: rawViewMetadata.config.targetObjectClass,
        primaryField: rawViewMetadata.config?.displayField,
        dataRelationshipContext: rawViewMetadata.config?.displayField ? getDataRelationshipContextFromKey(rawViewMetadata.config.displayField) : null,
        hideLabel,
        onRecordChange,
        inline
      }
    });
  }, [rawViewMetadata.config?.datasource?.source, parameters, propsToUse.required, propsToUse.disabled, getPConnect().getPageReference()]);

  // Prepare children to render
  return (
    <Grid2 container>
      <Grid2>{recreatedFirstChild}</Grid2>
    </Grid2>
  );
}
