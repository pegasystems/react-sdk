import { PropsWithChildren, ReactElement, useEffect, useMemo, useState } from 'react';

import { getComponentFromMap } from '@pega/react-sdk-components/lib/bridge/helpers/sdk_component_map';
import { PConnProps } from '@pega/react-sdk-components/lib/types/PConnProps';
import useIsMount from './useIsMount';

// ReferenceProps can't be used until getComponentConfig() is NOT private
interface DataReferenceProps extends PConnProps {
  // If any, enter additional props that only exist on this component
  label: string;
  showLabel: any;
  displayMode: string;
  allowAndPersistChangesInReviewMode: boolean;
  referenceType: string;
  selectionMode: string;
  displayAs: string;
  ruleClass: string;
  parameters: string[]; // need to fix
  hideLabel: boolean;
  imagePosition: any;
  showImageDescription: any;
  showPromotedFilters: any;
}

const SELECTION_MODE = { SINGLE: 'single', MULTI: 'multi' };

export default function DataReference(props: PropsWithChildren<DataReferenceProps>) {
  // Get emitted components from map (so we can get any override that may exist)
  const SingleReferenceReadonly = getComponentFromMap('SingleReferenceReadOnly');
  const MultiReferenceReadonly = getComponentFromMap('MultiReferenceReadOnly');

  const {
    children,
    getPConnect,
    label,
    showLabel,
    displayMode,
    allowAndPersistChangesInReviewMode: editableInReview,
    referenceType,
    selectionMode,
    displayAs,
    ruleClass,
    parameters,
    hideLabel,
    imagePosition,
    showImageDescription,
    showPromotedFilters
  } = props;

  const isMounted = useIsMount();

  let childrenToRender = children as ReactElement[];
  const pConn = getPConnect();
  const [dropDownDataSource, setDropDownDataSource] = useState(null);
  const propsToUse: any = { label, showLabel, ...pConn.getInheritedProps() };
  if (propsToUse.showLabel === false) {
    propsToUse.label = '';
  }
  const rawViewMetadata: any = pConn.getRawMetadata();
  const refFieldMetadata = pConn.getFieldMetadata(rawViewMetadata.config?.authorContext);
  const viewName = rawViewMetadata.name;
  const [firstChildMeta] = rawViewMetadata.children;
  const refList = rawViewMetadata.config.referenceList;
  const canBeChangedInReviewMode = editableInReview && ['autocomplete', 'dropdown'].includes(displayAs);
  const isDDSourceDeferred =
    (firstChildMeta?.type === 'Dropdown' && selectionMode === SELECTION_MODE.SINGLE && refFieldMetadata?.descriptors) ||
    firstChildMeta.config.deferDatasource;

  if (['Checkbox', 'RadioButtons'].includes(firstChildMeta?.type) && firstChildMeta.config.variant === 'card') {
    firstChildMeta.config.imagePosition = imagePosition;
    firstChildMeta.config.showImageDescription = showImageDescription;
  }
  let propName;
  const isDisplayModeEnabled = ['STACKED_LARGE_VAL', 'DISPLAY_ONLY'].includes(displayMode);
  let firstChildPConnect;

  /* Only for dropdown when it has param use data api to get the data back and add it to datasource */
  useEffect(() => {
    if (rawViewMetadata.config?.parameters && !isDDSourceDeferred && ['Checkbox', 'Dropdown', 'RadioButtons'].includes(firstChildMeta?.type)) {
      const { value, key, text } = firstChildMeta.config.datasource.fields;

      if (firstChildMeta.config.variant !== 'card' || (firstChildMeta.config.variant === 'card' && !isMounted)) {
        PCore.getDataApiUtils()
          .getData(refList, {
            dataViewParameters: parameters
          })
          .then(res => {
            if (res.data.data !== null) {
              const ddDataSource = firstChildMeta.config.datasource.filterDownloadedFields
                ? res.data.data
                : res.data.data
                    .map(listItem => ({
                      key: listItem[key.split(' .', 2)[1]],
                      text: listItem[text.split(' .', 2)[1]],
                      value: listItem[value.split(' .', 2)[1]]
                    }))
                    .filter(item => item.key); // Filtering out undefined entries
              setDropDownDataSource(ddDataSource);
            } else {
              setDropDownDataSource([] as any);
            }
          })
          .catch(err => {
            // eslint-disable-next-line no-console
            console.error(err?.stack);
            return Promise.resolve({
              data: { data: [] }
            });
          });
      }
    }
  }, [firstChildMeta, rawViewMetadata, parameters]);

  if (firstChildMeta?.type !== 'Region') {
    firstChildPConnect = getPConnect().getChildren()?.[0].getPConnect;
    /* remove refresh When condition from those old view so that it will not be used for runtime */
    if (firstChildMeta.config?.readOnly) {
      delete firstChildMeta.config.readOnly;
    }
    if (
      ['Dropdown', 'Checkbox', 'RadioButtons'].includes(firstChildMeta?.type) &&
      !firstChildMeta.config.deferDatasource &&
      firstChildMeta.config.datasource
    ) {
      firstChildMeta.config.datasource.source =
        (firstChildMeta.config.variant === 'card' && dropDownDataSource) ||
        (firstChildMeta.config.variant !== 'card' && rawViewMetadata.config?.parameters)
          ? dropDownDataSource
          : '@DATASOURCE '.concat(refList).concat('.pxResults');
    } else if (firstChildMeta?.type === 'AutoComplete') {
      firstChildMeta.config.datasource = refList;

      /* Insert the parameters to the component only if present */
      if (rawViewMetadata.config?.parameters) {
        firstChildMeta.config.parameters = parameters;
      }
    }

    if (firstChildMeta.config) {
      firstChildMeta.config.showPromotedFilters = showPromotedFilters;
      if (!canBeChangedInReviewMode) {
        firstChildMeta.config.displayMode = displayMode;
      }
    }

    // 4) Define field meta
    let fieldMetaData: any = null;
    if (isDDSourceDeferred && !firstChildMeta.config.deferDatasource) {
      fieldMetaData = {
        datasourceMetadata: refFieldMetadata
      };
      if (rawViewMetadata.config?.parameters) {
        fieldMetaData.datasourceMetadata.datasource.parameters = parameters;
      }
      fieldMetaData.datasourceMetadata.datasource.propertyForDisplayText = firstChildMeta?.config?.datasource?.fields?.text.startsWith('@P')
        ? firstChildMeta?.config?.datasource?.fields?.text?.substring(3)
        : firstChildMeta?.config?.datasource?.fields?.text;
      fieldMetaData.datasourceMetadata.datasource.propertyForValue = firstChildMeta?.config?.datasource?.fields?.value.startsWith('@P')
        ? firstChildMeta?.config?.datasource?.fields?.value?.substring(3)
        : firstChildMeta?.config?.datasource?.fields?.value;
      fieldMetaData.datasourceMetadata.datasource.name = rawViewMetadata.config?.referenceList;
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
    if (canBeChangedInReviewMode && pConn.getValue('__currentPageTabViewName', '')) {
      // 2nd arg empty string until typedef marked correctly
      getPConnect().getActionsApi().refreshCaseView(caseKey, pConn.getValue('__currentPageTabViewName', ''), '', refreshOptions); // 2nd arg empty string until typedef marked correctly
      PCore.getDeferLoadManager().refreshActiveComponents(pConn.getContextName());
    } else {
      const pgRef = pConn.getPageReference().replace('caseInfo.content', '');
      getPConnect().getActionsApi().refreshCaseView(caseKey, viewName, pgRef, refreshOptions);
    }

    // AutoComplete sets value on event.id whereas Dropdown sets it on event.target.value
    const propValue = event?.id || event?.target.value;
    if (propValue && canBeChangedInReviewMode && isDisplayModeEnabled) {
      (PCore.getDataApiUtils().getCaseEditLock(caseKey, '') as Promise<any>).then(caseResponse => {
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

        (
          PCore.getDataApiUtils().updateCaseEditFieldsData(
            caseKey,
            { [caseKey]: commitData },
            caseResponse.headers.etag,
            pConn.getContextName()
          ) as Promise<any>
        ).then(response => {
          PCore.getContainerUtils().updateParentLastUpdateTime(pConn.getContextName(), response.data.data.caseInfo.lastUpdateTime);
          PCore.getContainerUtils().updateRelatedContextEtag(pConn.getContextName(), response.headers.etag);
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
        // Need to add empty string for category and context to match typdef
        property: propName,
        category: '',
        context: ''
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
            dataRelationshipContext={rawViewMetadata.config.contextClass && rawViewMetadata.config.name ? rawViewMetadata.config.name : null}
          />
        );
      }

      if (isDisplayModeEnabled && selectionMode === SELECTION_MODE.MULTI) {
        return <MultiReferenceReadonly config={config} getPConnect={firstChildPConnect} label={propsToUse.label} hideLabel={hideLabel} />;
      }

      // In the case of a datasource with parameters you cannot load the dropdown before the parameters
      if (type === 'Dropdown' && rawViewMetadata.config?.parameters && dropDownDataSource === null) {
        return null;
      }

      return firstChildPConnect().createComponent(
        {
          type,
          config: {
            ...config,
            required: propsToUse.required,
            visibility: propsToUse.visibility,
            disabled: propsToUse.disabled,
            label: propsToUse.label,
            displayAs,
            viewName: getPConnect().getCurrentView(),
            parameters: rawViewMetadata.config.parameters,
            readOnly: false,
            localeReference: rawViewMetadata.config.localeReference,
            ...(selectionMode === SELECTION_MODE.SINGLE ? { referenceType } : ''),
            dataRelationshipContext: rawViewMetadata.config.contextClass && rawViewMetadata.config.name ? rawViewMetadata.config.name : null,
            hideLabel,
            onRecordChange: handleSelection
          }
        },
        '',
        '',
        {}
      ); // 2nd, 3rd, and 4th args empty string/object/null until typedef marked correctly as optional);
    }
  }, [firstChildMeta.config?.datasource?.source, parameters, dropDownDataSource, propsToUse.required, propsToUse.disabled]);

  // Only include the views region for rendering when it has content
  if (firstChildMeta?.type !== 'Region') {
    const viewsRegion = rawViewMetadata.children[1];
    if (viewsRegion?.name === 'Views' && viewsRegion.children.length) {
      childrenToRender = [recreatedFirstChild, ...(children as ReactElement[]).slice(1)];
    } else {
      childrenToRender = [recreatedFirstChild];
    }
  }

  return childrenToRender.length === 1 ? (
    (childrenToRender[0] ?? null)
  ) : (
    <div>
      {childrenToRender.map(child => (
        <>{child}</>
      ))}
    </div>
  );
}
