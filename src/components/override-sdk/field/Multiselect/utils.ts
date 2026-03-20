import { useRef } from 'react';
import equal from 'fast-deep-equal';
import cloneDeep from 'lodash.clonedeep';
import { updateNewInstuctions, insertInstruction, deleteInstruction } from '@pega/react-sdk-components/lib/components/helpers/instructions-utils';

export const setVisibilityForList = (c11nEnv, visibility) => {
  const { selectionMode, selectionList, renderMode, referenceList } = c11nEnv.getComponentConfig();
  // usecase:multiselect, fieldgroup, editable table
  if ((selectionMode === PCore.getConstants().LIST_SELECTION_MODE.MULTI && selectionList) || (renderMode === 'Editable' && referenceList)) {
    c11nEnv.getListActions().setVisibility(visibility);
  }
};

const useDeepMemo = (memoFn, key) => {
  const ref: any = useRef();
  if (!ref.current || !equal(key, ref.current.key)) {
    ref.current = { key, value: memoFn() };
  }
  return ref.current.value;
};

const preProcessColumns = columns => {
  return columns?.map(col => {
    const tempColObj = { ...col };
    tempColObj.value = col.value && col.value.startsWith('.') ? col.value.substring(1) : col.value;
    if (tempColObj.setProperty) {
      tempColObj.setProperty = col.setProperty && col.setProperty.startsWith('.') ? col.setProperty.substring(1) : col.setProperty;
    }
    return tempColObj;
  });
};

const getDisplayFieldsMetaData = columns => {
  const displayColumns = columns?.filter(col => col.display === 'true');
  const metaDataObj: any = {
    key: '',
    primary: '',
    secondary: []
  };
  const keyCol = columns?.filter(col => col.key === 'true');
  metaDataObj.key = keyCol?.length > 0 ? keyCol[0].value : 'auto';
  const itemsRecordsColumn = columns?.filter(col => col.itemsRecordsColumn === 'true');
  if (itemsRecordsColumn?.length > 0) {
    metaDataObj.itemsRecordsColumn = itemsRecordsColumn[0].value;
  }
  const itemsGroupKeyColumn = columns?.filter(col => col.itemsGroupKeyColumn === 'true');
  if (itemsGroupKeyColumn?.length > 0) {
    metaDataObj.itemsGroupKeyColumn = itemsGroupKeyColumn[0].value;
  }
  for (let index = 0; index < displayColumns?.length; index += 1) {
    if (displayColumns[index].secondary === 'true') {
      metaDataObj.secondary.push(displayColumns[index].value);
    } else if (displayColumns[index].primary === 'true') {
      metaDataObj.primary = displayColumns[index].value;
    }
  }
  return metaDataObj;
};

const createSingleTreeObejct = (entry, displayFieldMeta, showSecondaryData, selected) => {
  const secondaryArr: any = [];
  displayFieldMeta.secondary.forEach(col => {
    secondaryArr.push(entry[col]);
  });
  const isSelected = selected.some(item => item.id === entry[displayFieldMeta.key]);

  return {
    id: entry[displayFieldMeta.key],
    primary: entry[displayFieldMeta.primary],
    secondary: showSecondaryData ? secondaryArr : [],
    selected: isSelected
  };
};

const putItemsDataInItemsTree = (listObjData, displayFieldMeta, itemsTree, showSecondaryInSearchOnly, selected) => {
  let newTreeItems = itemsTree.slice();
  const showSecondaryData = !showSecondaryInSearchOnly;
  for (const obj of listObjData) {
    const items = obj[displayFieldMeta.itemsRecordsColumn].map(entry => createSingleTreeObejct(entry, displayFieldMeta, showSecondaryData, selected));

    newTreeItems = newTreeItems.map(caseObject => {
      if (caseObject.id === obj[displayFieldMeta.itemsGroupKeyColumn]) {
        caseObject.items = [...items];
      }
      return caseObject;
    });
  }
  return newTreeItems;
};

const prepareSearchResults = (listObjData, displayFieldMeta) => {
  const searchResults: any = [];
  for (const obj of listObjData) {
    searchResults.push(...obj[displayFieldMeta.itemsRecordsColumn]);
  }
  return searchResults;
};

const doSearch = async (
  searchText,
  clickedGroup,
  initialCaseClass,
  displayFieldMeta,
  dataApiObj, // deep clone of the dataApiObj
  itemsTree,
  isGroupData,
  showSecondaryInSearchOnly,
  selected
) => {
  let searchTextForUngroupedData = '';
  if (dataApiObj) {
    // creating dataApiObject in grouped data cases
    if (isGroupData) {
      dataApiObj = cloneDeep(dataApiObj);
      dataApiObj.fetchedNQData = false;
      dataApiObj.cache = {};

      // if we have no search text and no group selected, return the original tree
      if (searchText === '' && clickedGroup === '') {
        return itemsTree;
      }

      // setting the inital search text & search classes in ApiObject
      dataApiObj.parameters[Object.keys(dataApiObj.parameters)[1]] = searchText;
      dataApiObj.parameters[Object.keys(dataApiObj.parameters)[0]] = initialCaseClass;

      // if we have a selected group
      if (clickedGroup) {
        // check if the data for this group is already present and no search text
        if (searchText === '') {
          const containsData = itemsTree.find(item => item.id === clickedGroup);
          // do not make API call when items of respective group are already fetched
          if (containsData?.items?.length) return itemsTree;
        }

        dataApiObj.parameters[Object.keys(dataApiObj.parameters)[0]] = JSON.stringify([clickedGroup]);
      }
    } else {
      searchTextForUngroupedData = searchText;
    }

    // search API call
    const response = await dataApiObj.fetchData(searchTextForUngroupedData).catch(() => {
      return itemsTree;
    });

    let listObjData = response.data;
    let newItemsTree = [];
    if (isGroupData) {
      if (searchText) {
        listObjData = prepareSearchResults(listObjData, displayFieldMeta);
      } else {
        newItemsTree = putItemsDataInItemsTree(listObjData, displayFieldMeta, itemsTree, showSecondaryInSearchOnly, selected);
        return newItemsTree;
      }
    }
    const showSecondaryData = showSecondaryInSearchOnly ? !!searchText : true;
    if (listObjData !== undefined && listObjData.length > 0) {
      newItemsTree = listObjData.map(entry => createSingleTreeObejct(entry, displayFieldMeta, showSecondaryData, selected));
    }
    return newItemsTree;
  }

  return itemsTree;
};

const setValuesToPropertyList = (searchText, assocProp, items, columns, actions, updatePropertyInRedux = true) => {
  const setPropertyList = columns
    ?.filter(col => col.setProperty)
    .map(col => {
      return {
        source: col.value,
        target: col.setProperty,
        key: col.key,
        primary: col.primary
      };
    });
  const valueToSet: any = [];
  if (setPropertyList.length > 0) {
    setPropertyList.forEach(prop => {
      items.forEach(item => {
        if (prop.key === 'true' && item) {
          valueToSet.push(item.id);
        } else if (prop.primary === 'true' || !item) {
          valueToSet.push(searchText);
        }
      });

      if (updatePropertyInRedux) {
        // BUG-666851 setting options so that the store values are replaced and not merged
        const options = {
          isArrayDeepMerge: false
        };
        if (prop.target === 'Associated property') {
          actions.updateFieldValue(assocProp, valueToSet, options);
        } else {
          actions.updateFieldValue(`.${prop.target}`, valueToSet, options);
        }
      }
    });
  }
  return valueToSet;
};

const getGroupDataForItemsTree = (groupDataSource, groupsDisplayFieldMeta, showSecondaryInSearchOnly) => {
  return groupDataSource?.map(group => {
    const secondaryArr: any = [];
    groupsDisplayFieldMeta.secondary.forEach(col => {
      secondaryArr.push(group[col]);
    });
    return {
      id: group[groupsDisplayFieldMeta.key],
      primary: group[groupsDisplayFieldMeta.primary],
      secondary: showSecondaryInSearchOnly ? [] : secondaryArr,
      items: []
    };
  });
};

export {
  useDeepMemo,
  preProcessColumns,
  getDisplayFieldsMetaData,
  doSearch,
  setValuesToPropertyList,
  getGroupDataForItemsTree,
  updateNewInstuctions,
  insertInstruction,
  deleteInstruction
};
