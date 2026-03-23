const LOCALIZATON_ANNOTATION = '@L ';
const PROPERTY_ANNOTATION = '@P .';
const USER_ANNOTATION = '@USER .';
const ASSOCIATED_ANNOTATION = '@ASSOCIATED .';
const ASSOCIATION_ANNOTATION = '@CA ';

const getDefaultConfig = (fieldMeta, classID, show) => {
  const {
    name,
    label,
    fieldID,
    fieldType,
    dataType,
    type,
    classID: fieldMetaClassID,
    displayAs,
    displayAsLink,
    category,
    associationClassID,
    associationID
  } = fieldMeta;
  return {
    value: (associationClassID ? ASSOCIATION_ANNOTATION : PROPERTY_ANNOTATION).concat(fieldID),
    label: LOCALIZATON_ANNOTATION.concat(name || label),
    fieldType,
    propertyType: dataType || type,
    classID: classID || fieldMetaClassID,
    displayAs,
    displayAsLink,
    category,
    show,
    ...(associationClassID ? { associationLabel: LOCALIZATON_ANNOTATION.concat(category) } : {}),
    associationID
  };
};

export default function getDefaultViewMeta(fieldMeta, classID, showField) {
  const { type, name, displayAs, fieldID, isUserReference, associationID, datasource, label, fieldType } = fieldMeta;
  const mapperKey = type && displayAs ? type.concat(':').concat(displayAs) : type;
  const defaultConfig = getDefaultConfig(fieldMeta, classID, showField);
  let viewMeta;
  switch (mapperKey) {
    case 'True-False:pxCheckbox':
      viewMeta = {
        type: 'Checkbox',
        config: {
          ...defaultConfig,
          trueLabel: '@L Yes',
          falseLabel: '@L No',
          caption: LOCALIZATON_ANNOTATION.concat(name || label),
          label: undefined
        }
      };
      break;
    case 'Decimal:pxCurrency':
      viewMeta = {
        type: 'Currency',
        config: defaultConfig
      };
      break;
    case 'Date Time:pxDateTime':
    case 'Date & time:pxDateTime':
      viewMeta = {
        type: 'DateTime',
        config: defaultConfig
      };
      break;
    case 'Date:pxDateTime':
    case 'Date only:pxDateTime':
      viewMeta = {
        type: 'Date',
        config: defaultConfig
      };
      break;
    case 'Decimal:pxNumber':
      viewMeta = {
        type: 'Decimal',
        config: defaultConfig
      };
      break;
    case 'Text:pxEmail':
      viewMeta = {
        type: 'Email',
        config: defaultConfig
      };
      break;
    case 'Integer:pxInteger':
      viewMeta = {
        type: 'Integer',
        config: defaultConfig
      };
      break;
    case 'Decimal:pxPercentage':
      viewMeta = {
        type: 'Percentage',
        config: defaultConfig
      };
      break;
    case 'Text:pxPhone':
      viewMeta = {
        type: 'Phone',
        config: {
          ...defaultConfig,
          datasource: {
            source: '@DATASOURCE D_pyCountryCallingCodeList.pxResults',
            fields: {
              value: '@P .pyCallingCode'
            }
          }
        }
      };
      break;
    case 'TimeOfDay:pxDateTime':
      viewMeta = {
        type: 'Time',
        config: defaultConfig
      };
      break;
    case 'Text:pxURL':
    case 'Text:pxUrl':
      viewMeta = {
        type: 'URL',
        config: defaultConfig
      };
      break;
    case 'Text:pxTextArea':
      viewMeta = {
        type: 'TextArea',
        config: defaultConfig
      };
      break;
    case 'Text:pxRichTextEditor':
      viewMeta = {
        type: 'RichText',
        config: defaultConfig
      };
      break;
    case 'Text:pxAutoComplete':
      if (isUserReference || fieldType === 'User reference') {
        viewMeta = {
          type: 'UserReference',
          config: {
            ...defaultConfig,
            value: USER_ANNOTATION.concat(fieldID),
            placeholder: 'Select...',
            displayAs: 'Search box',
            associationID,
            associationLabel: undefined
          }
        };
      } else {
        const { tableType = '' } = datasource || {};
        viewMeta = {
          type: 'AutoComplete',
          config: {
            ...defaultConfig,
            placeholder: 'Select...',
            listType: 'associated',
            datasource: ASSOCIATED_ANNOTATION.concat(fieldID),
            deferDatasource: tableType === 'DataPage'
          }
        };
      }
      break;
    case 'Text:pxDropdown':
      if (isUserReference || fieldType === 'User reference') {
        viewMeta = {
          type: 'UserReference',
          config: {
            ...defaultConfig,
            value: USER_ANNOTATION.concat(fieldID),
            placeholder: 'Select...',
            displayAs: 'Drop-down list',
            associationID,
            associationLabel: undefined
          }
        };
      } else {
        const { tableType = '' } = datasource || {};
        viewMeta = {
          type: 'Dropdown',
          config: {
            ...defaultConfig,
            placeholder: 'Select...',
            listType: 'associated',
            datasource: ASSOCIATED_ANNOTATION.concat(fieldID),
            deferDatasource: tableType === 'DataPage'
          }
        };
      }
      break;
    case 'Text:pxRadioButtons':
      {
        const { tableType = '' } = datasource || {};
        viewMeta = {
          type: 'RadioButtons',
          config: {
            ...defaultConfig,
            placeholder: 'Select...',
            listType: 'associated',
            datasource: ASSOCIATED_ANNOTATION.concat(fieldID),
            deferDatasource: tableType === 'DataPage'
          }
        };
      }
      break;
    case 'Text:pxTextInput':
      viewMeta = {
        type: 'TextInput',
        config: defaultConfig
      };
      break;
    default:
      viewMeta = {
        type,
        config: defaultConfig
      };
  }
  return viewMeta;
}
