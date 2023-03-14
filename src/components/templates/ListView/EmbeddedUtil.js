
export const AT_FILTEREDLIST = '@FILTERED_LIST';
export const AT_PROPERTY = '@P';

/**
 * [preparePropertyValue]
 * Description    -        Preparing pageList value from FILTERED_LIST annotation to Property annotation
 * @ignore
 * @param {string} value   Pagelist value starts with FILTERED_LIST annotation
 * @returns {string}       returns converted string starting with Property annotation
 *
 * @example <caption>Example for preparePropertyValue </caption>
 * preparePropertyValue('@FILTERED_LIST .Employees[].Name') return '@P .Employees.Name'
 */
// FIXME #EmbeddedPropertyPatch
// TODO: Remove this utility when we have nested response for queryable pageList and supports @FILTERED_LIST annotation
export function preparePropertyValue(value) {
  if (value.startsWith(AT_FILTEREDLIST)) {
    value = value.substring(value.indexOf(' ') + 1);
    value = value.substring(0, value.indexOf('[')) + value.substring(value.indexOf(']') + 1);
    value = `${AT_PROPERTY} ${value}`;
  }
  return value;
}

/**
 * [updatePageListFieldsConfig]
 * Description    -        updating configured pageList property's type and value
 * @ignore
 * @param {Array} configFields  configured fields
 *
 * @example <caption>Modified config pageListField </caption>
 *
    {
      "type": "ScalarList",
      "config": {
        "value": "@FILTERED_LIST .Employees[].Name",
        "label": "@L Emp_Name",
        "componentType": "TextInput",
        "readOnly": true
      }
    }
    modified to
    {
      "type": "TextInput",
      "config": {
        "value": "@P .Employees.Name",
        "label": "@L Emp_Name",
        "componentType": "TextInput",
        "readOnly": true
      }
    }
 */
// FIXME #EmbeddedPropertyPatch
// TODO: Remove this utility when we have nested response for queryable pageList and supports scalarList component
export function updatePageListFieldsConfig(configFields) {
  return configFields.forEach((item) => {
    if (item.type === 'ScalarList') {
      item.type = item.config.componentType;
      item.config.value = preparePropertyValue(item.config.value);
    }
  });
}
