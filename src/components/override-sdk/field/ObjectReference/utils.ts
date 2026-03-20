import { Utils } from '@pega/react-sdk-components/lib/components/helpers/utils';

export const SELECTION_MODE = { SINGLE: 'single', MULTI: 'multi' };

const getLeafNameFromPropertyName = property => property?.substr(property.lastIndexOf('.'));

const isSelfReferencedProperty = (param, referenceProp) => param === referenceProp?.split('.', 2)[1];

export const AT_FILTEREDLIST = '@FILTERED_LIST';
export const AT_PROPERTY = '@P';
export const SQUARE_BRACKET_START = '[';
export const SQUARE_BRACKET_END = ']';

export const SIMPLE_TABLE_MANUAL_READONLY = 'SimpleTableManualReadOnly';
export const PAGE = '!P!';
export const PAGELIST = '!PL!';
export const PERIOD = '.';
const AT = '@';

export function updatePageListPropertyValue(value) {
  value = value.substring(0, value.indexOf(SQUARE_BRACKET_START)) + value.substring(value.indexOf(SQUARE_BRACKET_END) + 1);
  return value;
}

export function getPropertyValue(value) {
  if (value.startsWith(AT)) {
    value = value.substring(value.indexOf(' ') + 1);
    if (value.startsWith(PERIOD)) value = value.substring(1);
  }
  if (value.includes(SQUARE_BRACKET_START)) {
    value = updatePageListPropertyValue(value);
  }
  return value;
}

const getCompositeKeys = (c11nEnv, property) => {
  const { datasource: { parameters = {} } = {} } = c11nEnv.getFieldMetadata(property) || {};
  return Object.values(parameters).reduce((compositeKeys: any, param) => {
    if (isSelfReferencedProperty(property, param)) {
      let propName = getPropertyValue(param);
      propName = propName.substring(propName.indexOf('.'));
      compositeKeys.push(propName);
    }
    return compositeKeys;
  }, []);
};

export const generateColumns = (config, pConn, referenceType) => {
  const displayField = getLeafNameFromPropertyName(config.displayField);
  const referenceProp = config.value.split('.', 2)[1];
  const compositeKeys: any = getCompositeKeys(pConn, referenceProp);
  let value = getLeafNameFromPropertyName(config.value);

  const columns: any = [];
  if (displayField) {
    columns.push({
      value: displayField,
      display: 'true',
      useForSearch: true,
      primary: 'true'
    });
  }
  if (value && compositeKeys.indexOf(value) !== -1) {
    columns.push({
      value,
      setProperty: 'Associated property',
      key: 'true'
    });
  } else {
    const actualValue = compositeKeys.length > 0 ? compositeKeys[0] : value;
    config.value = `@P .${referenceProp}${actualValue}`;
    value = actualValue;
    columns.push({
      value: actualValue,
      setProperty: 'Associated property',
      key: 'true'
    });
  }

  config.datasource = {
    fields: {
      key: getLeafNameFromPropertyName(config.value),
      text: getLeafNameFromPropertyName(config.displayField),
      value: getLeafNameFromPropertyName(config.value)
    }
  };

  if (referenceType === 'Case') {
    columns.push({
      secondary: 'true',
      display: 'true',
      value: Utils.getMappedKey('pyID'),
      useForSearch: true
    });
  }

  compositeKeys.forEach(key => {
    if (value !== key)
      columns.push({
        value: key,
        display: 'false',
        secondary: 'true',
        useForSearch: false,
        setProperty: `.${referenceProp}${key}`
      });
  });

  config.columns = columns;
};

export const getDataRelationshipContextFromKey = key => key.split('.', 2)[1];
