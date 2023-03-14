import { useEffect } from 'react';
import { getContext, readContextResponse } from './utils';

export default function useInit(props) {
  const PCore = window.PCore;
  const {
    referenceList,
    getPConnect,
    personalizationId,
    parameters,
    compositeKeys,
    isSearchable,
    allowBulkActions,
    ref,
    showDynamicFields,
    isDataObject,
    xRayUid,
    cosmosTableRef
  } = props;
  let { editing, selectionMode } = props;
  // Todo: once BUG-556742 is fixed we no longer need to read metadata directly
  // Currently literal string with dot is getting resolved from redux even when it doesn't have @P annotation

  const runtimeParams = PCore.getRuntimeParamsAPI().getRuntimeParams();
  // context to know if ListView is in TabbedPage or not
  // const { inTabbedPage } = useContext(LayoutContext);

  // const useBulkActionsHook = useBulkActions();
  let selectionCountThreshold;
  useEffect(() => {
    let isCompStillMounted = true; // react hooks cleanup function will toggle this flag and use it before setting a state variable

    (async function init() {
      const xRayInfo = {
        visibleColumns: {
          personalisations: {}
        },
        totalColumns: 0,
        count: 0
      };
      // promise to fetch metadata
      const metaDataPromise = PCore.getAnalyticsUtils().getDataViewMetadata(referenceList, showDynamicFields);

      const promisesArray = [metaDataPromise];

      // promise to fetch report configured columns
      const reportColumnsPromise = PCore.getAnalyticsUtils()
        .getFieldsForDataSource(referenceList, false, getPConnect().getContextName())
        .catch(() => {
          return Promise.resolve({
            data: { data: [] }
          });
        });
      promisesArray.push(reportColumnsPromise);

      const fetchEditDetails = async (metadata) => {
        const {
          data: { isQueryable }
        } = metadata;
        /* BUG-636789 : in case of hybrid set editing to false */
        if (!isDataObject) {
          if (!isQueryable) {
            editing = false; /* Force editing to false if DP is non queryable */
          }

          const { MULTI_ON_HOVER, MULTI } = PCore.getConstants().LIST_SELECTION_MODE;
          if (allowBulkActions && isQueryable) {
            /** enable bulk actions only if DP is queryable */
            selectionMode = MULTI_ON_HOVER;
          }
          if ([MULTI_ON_HOVER, MULTI].includes(selectionMode)) {
            selectionCountThreshold = 250; // Results count should not be greater than threshold to display SelectAll checkbox.
          }

          // if (editing) {
          //   // Promise to fetch editable fields if editable=true
          //   return fetchEditableFields(parameters, props, runtimeParams, referenceList);
          // }
        }
        return Promise.resolve();
      };

      const editPromise = metaDataPromise.then((metadata) => fetchEditDetails(metadata));
      promisesArray.push(editPromise);
      getContext({
        tableSource: referenceList,
        ListId: personalizationId,
        runtimeParams: parameters ?? runtimeParams,
        promisesArray,
        getPConnect,
        compositeKeys,
        isSearchable,
        isCacheable: true,
        xRayUid
      })
        .then(async (context) => {
          if (isCompStillMounted) {
            return readContextResponse(context, {
              ...props,
              editing,
              selectionCountThreshold,
              ref,
              selectionMode,
              xRayInfo,
              xRayUid,
              cosmosTableRef
            });
          }
        });
    })();

    return () => {
      isCompStillMounted = false;
    };
  }, []);
}
