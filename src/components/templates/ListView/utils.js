/* eslint-disable no-undef */
import { updatePageListFieldsConfig } from './EmbeddedUtil';
import getDefaultViewMeta from './DefaultViewMeta';

const USER_REFERENCE = 'UserReference';
const PAGE = '!P!';
const PAGELIST = '!PL!';
export const formatConstants = {
  DateTimeLong: 'DateTime-Long',
  DateTimeShort: 'DateTime-Short',
  DateTimeSince: 'DateTime-Since',
  TimeOnly: 'Time-Only',
  DateDefault: 'Date-Default',
  DateTimeDefault: 'Date-Time-Default',
  TimeDefault: 'Time-Default',
  CheckCross: 'CheckCross',
  YesNo: 'Yes/No',
  TrueFalse: 'True/False',
  TextInput: 'TextInput',
  WorkStatus: 'WorkStatus',
  Email: 'Email',
  Phone: 'Phone',
  URL: 'URL',
  Integer: 'Integer',
  Decimal: 'Decimal',
  DecimalAuto: 'Decimal-Auto',
  Currency: 'Currency',
  CurrencyCode: 'Currency-Code',
  CurrencyCompact: 'Currency-Compact',
  Percentage: 'Percentage',
  RichText: 'RichText',
  Operator: 'Operator',
  WorkLink: 'WorkLink',
  UserReference: 'UserReference',
  AssignmentLink: 'AssignmentLink',
  RowActionMenu: 'RowActionMenu',
  CellAction: 'CellAction',
  RowSelectHandle: 'RowSelectHandle',
  SelectAllCheckbox: 'selectAllCheckboxRenderer',
  RowDragDropHandle: 'RowDragDropHandle',
  NumberDefault: 'Number-Default',
  TextDefault: 'Text-Default',
  BooleanDefault: 'Boolean-Default',
  OpenInModal: 'OpenInModal'
};
export async function getContext(componentConfig) {
  const {
    promisesArray = [], // array of promises which can be invoked paralelly,
  } = componentConfig;
  const promisesResponseArray = await Promise.all(promisesArray);
  // const {
  //   data: { parameters = [], isQueryable = true, isSearchable = configIsSearchable, classID, insightID }
  // } = promisesResponseArray[0];
  return {
    promisesResponseArray,
  };
}

/**
 * [getFieldNameFromEmbeddedFieldName]
 * Description    -               converting embeddedField name starting with !P! or !PL! to normal field
 * @ignore
 * @param {string} propertyName   EmbeddedField name starting with !P! or !PL!
 * @returns {string}              returns converted string without !P! or !PL! and :
 *
 * @example <caption>Example for getFieldNameFromEmbeddedFieldName </caption>
 * getFieldNameFromEmbeddedFieldName('!P!Organisation:Name') return 'Organisation.Name'
 * getFieldNameFromEmbeddedFieldName('!PL!Employees:Name') return 'Employees.Name'
 */
 export function getFieldNameFromEmbeddedFieldName(propertyName) {
  let value = propertyName;
  if (value.startsWith(PAGE) || value.startsWith(PAGELIST)) {
    value = value.substring(value.lastIndexOf('!') + 1);
    value = value.replace(/:/g, '.');
  }
  return value;
}

/**
 * [updateMetaEmbeddedFieldID]
 * Description    -           If the fieldID in meta starts with '!P!' or '!PL!' and contains ':' then replace them with .(dot)
 * @ignore
 * @param {Array} metaFields  Fields metadata Array. Contains metadata of all the fields.
 */
 export function updateMetaEmbeddedFieldID(metaFields) {
  return metaFields.forEach((metaField) => {
    if (metaField.fieldID?.startsWith(PAGE) || metaField.fieldID?.startsWith(PAGELIST)) {
      metaField.fieldID = getFieldNameFromEmbeddedFieldName(metaField.fieldID);
    }
  });
}

export const isEmbeddedField = (field) => {
  if (field?.startsWith('@')) {
    field = field.substring(field.indexOf(' ') + 1);
    if (field[0] === '.') field = field.substring(1);
  }
  return field?.indexOf('.') > 0;
};

/**
 * [getConfigEmbeddedFieldsMeta]
 * Description    -           Get the metadata for configured embedded fields
 * @ignore
 * @param {Set} configFields  Set of config fields
 * @param {string} classID    clasID of datapage
 * @returns {Array}           Metadata of configured embedded fields
 */
export function getConfigEmbeddedFieldsMeta(configFields, classID) {
  const configEmbeddedFieldsMeta = [];
  configFields.forEach((field) => {
    let value = field;
    if (isEmbeddedField(value)) {
      // conversion Page.PageList[].property => Page.PageList.property
      if (value.includes('[')) {
        value = value.substring(0, value.indexOf('[')) + value.substring(value.indexOf(']') + 1);
      }
      const meta = PCore.getMetadataUtils().getEmbeddedPropertyMetadata(value, classID);
      meta.fieldID = field;
      configEmbeddedFieldsMeta.push(meta);
    }
  });
  return configEmbeddedFieldsMeta;
}

/**
 * [mergeConfigEmbeddedFieldsMeta]
 * Description    -           Get the metadata for configured embedded fields
 * @ignore
 * @param {Array} configEmbeddedFieldsMeta  config fields metadata.
 * @param {Array} metaFields  Fields metadata Array. Contains metadata of all the fields
 */
export function mergeConfigEmbeddedFieldsMeta(configEmbeddedFieldsMeta, metaFields) {
  const mergedMetaFields = [...metaFields];
  configEmbeddedFieldsMeta.forEach((configFieldMeta) => {
    const fieldMeta = metaFields.find((metaField) => metaField.fieldID === configFieldMeta.fieldID);
    if (!fieldMeta) mergedMetaFields.push(configFieldMeta);
  });
  return mergedMetaFields;
}

const oldToNewFieldTypeMapping = {
  'Date Time': 'Date & time',
  Date: 'Date only'
};

/**
 * [updateFieldType]
 * Description    -           Updates the field type if its changed in the new implementation. Such mapping is maintained in oldToNewFieldTypeMapping.
 * @ignore
 * @param {Array} metaFields  Fields metadata Array. Contains metadata of all the fields.
 */
 function updateFieldType(metaFields) {
  metaFields.forEach((metaField) => {
    if (metaField.type) metaField.type = oldToNewFieldTypeMapping[metaField.type] || metaField.type;
  });
}

function getPresetMetaAttribute(attribute) {
  const {
    type,
    config: { label, value }
  } = attribute;
  return {
    type,
    name: value.startsWith('@') ? value.substring(4) : value,
    label: label.startsWith('@') ? label.substring(3) : label
  };
}

/**
 * [generateViewMetaData]
 * Description - Returns a list of  metaobjects of the fields provided.
 * @ignore
 * @param   {Array}   rawFields         List of fields to update meta for
 * @param   {string}  classID          Class ID from the response
 * @returns {Array}                    List of fields with updated meta objects.
 */
 function generateViewMetaData(rawFields, classID, showField, isQueryable) {
  return rawFields.map((item) => getDefaultViewMeta(item, classID, showField, isQueryable));
}

/**
 * [getConfigFields]
 * Description - Returns list of config fields with primary fields meta updated.
 * @ignore
 * @param   {Array}   configFields      List of Authored fields
 * @param   {Array}   primaryFields     List of Primary Fields
 * @param   {Array}   metaFields        Metadata of all fields
 * @param   {string}  classID           Class ID from the response
 * @returns {Array}                     List of all fields with their meta updated.
 */
 function getConfigFields(configFields, primaryFields, metaFields, classID, isQueryable) {
  const presetConfigFields = configFields;
  const primaryFieldsViewIndex = presetConfigFields.findIndex((field) => field.config.value === 'pyPrimaryFields');
  if (!primaryFields || !primaryFields.length) {
    if (primaryFieldsViewIndex < 0) return presetConfigFields;

    presetConfigFields.splice(primaryFieldsViewIndex, 1);

    return presetConfigFields;
  }

  if (primaryFieldsViewIndex > -1) {
    // list of uncommon fields - non overlap of primary fields grouped view and independent entity columns of primary type
    const uncommonFieldsList = primaryFields.filter(
      (primaryField) =>
        !presetConfigFields.some((presetConfigField) => presetConfigField.config.value.split('.')[1] === primaryField)
    );
    const uncommonFieldsRawMeta = [];
    uncommonFieldsList.forEach((uncommonField) => {
      const uncommonFieldMeta = metaFields.find((metaField) => metaField.fieldID === uncommonField);
      if (uncommonFieldMeta) uncommonFieldsRawMeta.push(uncommonFieldMeta);
    });
    const uncommonFieldsConfigMeta = generateViewMetaData(uncommonFieldsRawMeta, classID, true, isQueryable);

    presetConfigFields.splice(primaryFieldsViewIndex, 1, ...uncommonFieldsConfigMeta);
  }
  return presetConfigFields;
}

/**
 * [getTableConfigFromPresetMeta]
 * Description - Get the table config from the presets meta.
 * @ignore
 * @param   {object}    presetMeta          Presets meta
 * @param   {boolean}   isMetaWithPresets   true if meta has presets else false
 * @param   {Function}  getPConnect         Callback to get the PConnect object
 * @param   {string}    classID             Class ID from the response
 * @param   {Array}     primaryFields       List of Primary Fields
 * @param   {Array}     metaFields          List of all metafields
 * @returns {object}                        Table config object
 */
 export function getTableConfigFromPresetMeta(
  presetMeta,
  isMetaWithPresets,
  getPConnect,
  classID,
  primaryFields,
  metaFields,
  isQueryable
) {
  let presetId;
  let presetName;
  let cardHeader;
  let secondaryText;
  let timelineDate;
  let timelineTitle;
  let timelineStatus;
  let timelineIcon;
  let { filterExpression } = getPConnect().getRawMetadata().config;
  let fieldsMeta;
  let configFields;
  if (isMetaWithPresets) {
    presetId = presetMeta.id;
    presetName = presetMeta.label;
    cardHeader = presetMeta.cardHeader && getPresetMetaAttribute(presetMeta.cardHeader);
    secondaryText = presetMeta.secondaryText && getPresetMetaAttribute(presetMeta.secondaryText);
    timelineDate = presetMeta.timelineDate && getPresetMetaAttribute(presetMeta.timelineDate);
    timelineTitle = presetMeta.timelineTitle && getPresetMetaAttribute(presetMeta.timelineTitle);
    timelineStatus = presetMeta.timelineStatus && getPresetMetaAttribute(presetMeta.timelineStatus);
    timelineIcon = presetMeta.timelineIcon && getPresetMetaAttribute(presetMeta.timelineIcon);
    filterExpression = presetMeta.config.filterExpression;
    [fieldsMeta] = presetMeta.children;
    if (
      presetMeta.timelineTitle &&
      !fieldsMeta.children.find((fieldMeta) => {
        return fieldMeta?.config?.value === presetMeta.timelineTitle?.config?.value;
      })
    ) {
      const { type, config } = presetMeta.timelineTitle;
      fieldsMeta.children.push({ type, config: { ...config, show: false } });
    }
    if (
      presetMeta.timelineDate &&
      !fieldsMeta.children.find((fieldMeta) => {
        return fieldMeta?.config?.value === presetMeta.timelineDate?.config?.value;
      })
    ) {
      const { type, config } = presetMeta.timelineDate;
      fieldsMeta.children.push({ type, config: { ...config, show: false } });
    }
    configFields = getConfigFields(fieldsMeta.children, primaryFields, metaFields, classID, isQueryable);
  } else {
    fieldsMeta = presetMeta.props;
    configFields = getConfigFields(
      fieldsMeta
        .getPConnect()
        .getChildren()
        ?.map((child) => {
          return child.getPConnect().getRawMetadata();
        }),
      primaryFields,
      metaFields,
      classID,
      isQueryable
    );
  }
  return {
    presetId,
    presetName,
    cardHeader,
    secondaryText,
    timelineDate,
    timelineTitle,
    timelineStatus,
    timelineIcon,
    filterExpression,
    fieldsMeta,
    configFields
  };
}

/**
 * [getReportColumns]
 * Description - Returns a set of columns from the report response.
 * @ignore
 * @param   {object} response -
 * @returns {Set} Set of columns from the report response
 */
 function getReportColumns(response) {
  const {
    data: { data: reportColumns }
  } = response;
  const reportColumnsSet = new Set();
  reportColumns?.forEach((item) => {
    let val = item.pyFieldName;
    // Remove '.' from index 0 only, if '.' is present
    if (val[0] === '.') {
      val = val.substring(1);
    }
    reportColumnsSet.add(val);
  });
  return reportColumnsSet;
}

/**
 * [getConfigFieldValue]
 * Descritpion - Returns a valid value for a configuration field. Remove any annotations and also "."
 * @ignore
 * @param   {object} config
 *                   config.value - Raw value
 * @returns {string} value - Value with out any annotations or "."
 */
 function getConfigFieldValue(config) {
  let { value } = config;
  if (value.startsWith('@')) {
    value = value.substring(value.indexOf(' ') + 1);
    if (value[0] === '.') value = value.substring(1);
  }
  return value;
}

/**
 * [prepareConfigFields]
 * Description - Prepares a set of configuration fields and pushes each config type to a set using the callback parameter.
 * @ignore
 * @param   {object}    configFields          List of Authored fields
 * @param   {Function}  pushToComponentsList Callback to push the field type to a set.
 * @returns {Set}       configFieldSet
 */
function prepareConfigFields(configFields, pushToComponentsList) {
  const configFieldSet = new Set();
  configFields.forEach((item) => {
    pushToComponentsList(item.type);
    const val = getConfigFieldValue(item.config);
    configFieldSet.add(val);
  });
  return configFieldSet;
}

/**
 * [findAuthoredField]
 * Description - Finds an authored field from yhe list of config fields.
 * @ignore
 * @param   {Array}   configFields List of Authored fields
 * @param   {string}  fieldID      Filter
 * @returns {object}              config with its field value equal to fieldID, which means an authored field
 */
 function findAuthoredField(configFields, fieldID) {
  return configFields.find((configField) => {
    const val = getConfigFieldValue(configField.config);
    return val === fieldID;
  });
}

/**
 * [findAndUpdateAuthoredFieldConfig]
 * Description - Find the authored field, and update its config.
 * @ignore
 * @param   {Array}   configFields List of Authored fields
 * @param   {object}  item        Field item to copy displayAs and category information
 * @param   {string}  classId     classID from the response
 */
 function findAndUpdateAuthoredFieldConfig(configFields, item, classId) {
  const authoredField = findAuthoredField(configFields, item.fieldID);
  if (authoredField?.config) {
    if (item.displayAs) {
      authoredField.config.displayAs = item.displayAs;
    }
    authoredField.config.classID = item.classID ?? classId;

    if (authoredField.type === USER_REFERENCE) {
      authoredField.config.associationID = item.associationID || item.fieldID;
    }
    authoredField.config.category = item.category;
    // FieldType identifies whether the field is configured as pickList
    authoredField.config.fieldType = item.fieldType;
    // type defined on the property rule,
    // used for the picklist field to assign the appropriate type
    authoredField.config.propertyType = item.dataType || item.type;
  }
}

/**
 * [isAnExtraField]
 * Description - Returns true if the field is an extra field. Extra field is the one which is not authored but part of the report.
 * @ignore
 * @param   {Array}   configFields      List of Authored fields
 * @param   {Set}     configFieldSet    Set if Authored filed values
 * @param   {Set}     reportColumnsSet Set of columns from the report
 * @param   {object}  item             Config field item
 * @param   {string}  classId          Class ID from the response
 * @param   {boolean} showDynamicFields Flag indicating whether fields are fetched dynamically at runtime
 * @returns {boolean}                  true If the field is an extra field else false.
 */
 function isAnExtraField(configFields, configFieldSet, reportColumnsSet, item, classId, showDynamicFields) {
  // Is the field already present in authoring metadata?
  // Mutates config fields to copy displayAs and category information
  if (configFieldSet.has(item.fieldID)) {
    findAndUpdateAuthoredFieldConfig(configFields, item, classId);
    return false;
  }

  // If field is not authored and not part of report columns then discard it
  return showDynamicFields || !!reportColumnsSet.has(item.fieldID);
}

/**
 * [prepareExtraFields]
 * Description - Returns a list of extra fields with their meta updated.
 * @ignore
 * @param   {Array}   metaFields       List of fields
 * @param   {Array}   configFields      List of Authored fields
 * @param   {Set}     configFieldSet    Set if Authored filed values
 * @param   {Set}     reportColumnsSet Set of columns from the report
 * @param   {string}  classID          Class ID from the response
 * @param   {boolean} showDynamicFields Flag indicating whether fields are fetched dynamically at runtime
 * @returns {Array}                    List of extra fields with their meta updated.
 */
 function prepareExtraFields(
  metaFields,
  configFields,
  configFieldSet,
  reportColumnsSet,
  classID,
  showDynamicFields,
  isQueryable
) {
  // Filter all the extra fields
  const extraFileds = metaFields.filter((item) => {
    return isAnExtraField(configFields, configFieldSet, reportColumnsSet, item, classID, showDynamicFields);
  });
  return generateViewMetaData(extraFileds, classID, false, isQueryable);
  // Update the meta object of each of the extra fields.
}
const columnWidthConfigs = { auto: 'auto', custom: 'custom' };
function getNormalizedTypes(field) {
  let { type } = field;
  const {
    config: { fieldType, propertyType, componentType }
  } = field;
  // honour the property type for the pickList field
  if (fieldType === 'Picklist' && propertyType) {
    type = propertyType;
  }
  let tableFieldType = type;
  switch (type) {
    case 'Text (single line)':
    case 'Text (paragraph)':
      type = 'TextInput';
      break;
    case 'Date only':
      type = 'Date';
      break;
    case 'Date & time':
      type = 'DateTime';
      break;
    case 'Checkbox':
    case 'TrueFalse':
      type = 'Boolean';
      break;
    case 'Time only':
    case 'Time':
    case 'TimeOfDay':
      type = 'Time-Only';
      break;
    case 'User reference':
      type = 'UserReference';
      break;
    default:
  }
  switch (type) {
    case 'TextInput':
    case 'TextArea':
    case 'Email':
    case 'Phone':
    case 'Checkbox':
    case 'Time':
    case 'Dropdown':
    case 'RadioButtons':
    case 'Location':
      tableFieldType = 'text';
      break;
    case 'URL':
      tableFieldType = 'URL';
      type = 'URL';
      break;
    case 'Boolean':
    case 'boolean':
      tableFieldType = 'boolean';
      break;
    case 'Integer':
    case 'Decimal':
    case 'Currency':
    case 'Percentage':
    case 'number':
      tableFieldType = 'number';
      break;
    case 'Date':
    case 'date':
      tableFieldType = 'date';
      break;
    case 'DateTime':
    case 'datetime':
      tableFieldType = 'datetime';
      break;
    case 'Time-Only':
      tableFieldType = 'time';
      break;
    case 'UserReference':
      tableFieldType = 'text';
      break;
    case 'ScalarList': {
      const derivedField = { ...field };
      derivedField.type = componentType;
      const [tableFieldTypeForScalarList] = getNormalizedTypes(derivedField);
      tableFieldType = tableFieldTypeForScalarList;
      type = 'ScalarList';
      break;
    }
    default:
      tableFieldType = 'text';
      type = 'TextInput';
  }
  return [tableFieldType, type];
}
function getNebulaFormatterNameForDefault(fieldType) {
  switch (fieldType) {
    case 'Date':
      return formatConstants.DateDefault;
    case 'DateTime':
      return formatConstants.DateTimeDefault;
    case 'Time-Only':
      return formatConstants.TimeDefault;
    case 'Integer':
    case 'Decimal':
    case 'Currency':
    case 'Percentage':
    case 'number':
      return formatConstants.NumberDefault;
    case 'TextInput':
    case 'TextArea':
    case 'Email':
    case 'Phone':
    case 'Time':
    case 'Dropdown':
    case 'RadioButtons':
    case 'Location':
    case 'RichText':
      return formatConstants.TextDefault;
    case 'Boolean':
      return formatConstants.BooleanDefault;
    case 'URL':
      return formatConstants.URL;
    default:
      return '';
  }
}

function populateFormatter(config, type, formatter, displayAs) {
  // TODO displayAs will never be used as Default formatter will be applied. Need to revisit this.
  let format = formatter || getNebulaFormatterNameForDefault(type) || displayAs;
  if (type === 'ScalarList') {
    format = formatter || config.meta?.config.componentType;
  }
  switch (format) {
    case 'pxCurrency':
      format = formatConstants.Currency;
      break;
    case 'pxInteger':
    case 'pxNumber':
      format = formatConstants.Integer;
      break;
    case 'DateTime-Harness':
    case 'pxDateTime':
    case 'DateTime-Medium':
      format = formatConstants.DateTimeLong;
      break;
    case 'pxCheckbox':
      format = formatConstants.YesNo;
      break;
    case 'RichTextDisplay':
    case 'pxRichTextEditor':
    case 'RichText':
      format = formatConstants.RichText;
      break;
    case 'pxEmail':
      format = formatConstants.Email;
      break;
    case 'pxPhone':
      format = formatConstants.Phone;
      break;
    default:
  }
  if (type === 'UserReference') {
    format = formatConstants.UserReference;
  }
  let cellRenderer = format;
  if (type === 'ScalarList') {
    cellRenderer = 'ScalarList';
  }

  if (config.meta.config.customComponent) {
    cellRenderer = 'customComponent';
  }
  return { ...config, cellRenderer, formatter: format };
}

const AssignDashObjects = ['Assign-Worklist', 'Assign-WorkBasket'];

function populateRenderingOptions(name, config, field) {
  const shouldDisplayAsSemanticLink = 'displayAsLink' in field.config && field.config.displayAsLink;
  if (shouldDisplayAsSemanticLink) {
    config.customObject.isAssignmentLink = AssignDashObjects.includes(field.config.classID);
    if (field.config.value.startsWith('@CA')) {
      config.customObject.isAssociation = true;
    }
    config.cellRenderer = formatConstants.WorkLink;
    config.formatter = formatConstants.WorkLink;
  } else if (name === 'pyStatusWork' || name === 'pyAssignmentStatus') {
    config.cellRenderer = formatConstants.WorkStatus;
    config.formatter = formatConstants.WorkStatus;
    config.filterPickList = 'true';
  } else if (name === 'pxUrgencyWork') {
    config.cellRenderer = formatConstants.Integer;
    config.formatter = formatConstants.Integer;
  } else if (field.config.openInModal && field.config.name) {
    config.cellRenderer = formatConstants.OpenInModal;
    config.meta.config.forceDisplayMode = true;
  }
}
export function initializeColumns(
  fields = [],
  actionsApi,
  pConnect,
  getMappedProperty
) {
  return fields.map((field, originalColIndex) => {
    let name = field.config.value;
    let { tooltip } = field.config;

    if (tooltip && tooltip.startsWith('@')) {
      tooltip = tooltip.substring(4);
    }
    if (name.startsWith('@')) {
      name = name.substring(name.indexOf(' ') + 1);
      if (name[0] === '.') name = name.substring(1);
    }
    name = getMappedProperty?.(name) ?? name;

    let label = field.config.label || field.config.caption;
    const { show = true, displayAs, formatter } = field.config;
    if (label.startsWith('@')) {
      label = label.substring(3);
    }
    const [typeForTable, type] = getNormalizedTypes(field);
    let config = {
      type: typeForTable,
      name,
      fillAvailableSpace: !!field.config.fillAvailableSpace,
      label,
      showTooltip: false,
      showCategoryInHeaderLabel: field.config.showCategoryInHeaderLabel || false,
      tooltip,
      show,
      classID: field.config.classID,
      id: field.id || name || originalColIndex,
      displayAs,
      autosize: field.config.columnWidth ? field.config.columnWidth === columnWidthConfigs.auto : true,
      width: field.config.columnWidth === columnWidthConfigs.custom ? field.config.width : undefined,
      associationID: field.config.associationID,
      ...(field.config.classID && { category: field.config.category }),
      grouping: field.config.grouping,
      sort: field.config.sort,
      filter: field.config.filter,
      customObject: {},
      fieldType: field.config.fieldType,
      meta: {
        ...field
      },
      hideGroupColumnNameLabel: field.config.hideGroupColumnNameLabel,
      hierarchicalInfo: field.config.hierarchicalInfo
    };

    config = populateFormatter(
      config,
      config?.meta?.type === formatConstants.RichText ? config.meta.type : type,
      formatter,
      displayAs
    );

    populateRenderingOptions(name, config, field);

    return config;
  });
}

export const getItemKey = (fields) => {
  let itemKey;
  if (fields.findIndex((field) => field.id === 'pyGUID') > -1) {
    itemKey = 'pyGUID';
  } else {
    itemKey = 'pzInsKey';
  }
  return itemKey;
};

export function isAlternateKeyStorageForLookUp(lookUpDataPageInfo) {
  return lookUpDataPageInfo && lookUpDataPageInfo.isAlternateKeyStorage;
}

export function getLookUpDataPageInfo(classID) {
  const lookUpDatePage = PCore.getDataTypeUtils().getLookUpDataPage(classID);
  const lookUpDataPageInfo = PCore.getDataTypeUtils().getLookUpDataPageInfo(classID);
  return { lookUpDatePage, lookUpDataPageInfo };
}

export function preparePatchQueryFields(fields, isDataObject = false, classID = '') {
  const queryFields = [];
  const { lookUpDatePage, lookUpDataPageInfo } = getLookUpDataPageInfo(classID);
  fields.forEach((field) => {
    const patchFields = [];
    if (field.cellRenderer === 'WorkLink') {
      if (field.customObject && field.customObject.isAssignmentLink) {
        const associationName = field.name.includes(':') ? `${field.name.split(':')[0]}:` : '';
        patchFields.push(`${associationName}pzInsKey`);
        patchFields.push(`${associationName}pxRefObjectClass`);
      } else if (field.customObject && field.customObject.isAssociation) {
        const associationCategory = field.name.split(':')[0];
        patchFields.push(`${associationCategory}:pyID`);
        patchFields.push(`${associationCategory}:pzInsKey`);
        patchFields.push(`${associationCategory}:pxObjClass`);
      } else if (isDataObject) {
        const dataViewName = PCore.getDataTypeUtils().getSavableDataPage(classID);
        const dataPageKeys = PCore.getDataTypeUtils().getDataPageKeys(dataViewName);
        dataPageKeys?.forEach((item) =>
          item.isAlternateKeyStorage ? patchFields.push(item.linkedField) : patchFields.push(item.keyName)
        );
      } else {
        patchFields.push('pyID');
        patchFields.push('pzInsKey');
        patchFields.push('pxObjClass');
      }
      if (lookUpDatePage && isAlternateKeyStorageForLookUp(lookUpDataPageInfo)) {
        const { parameters } = lookUpDataPageInfo;
        Object.keys(parameters).forEach((param) => {
          const paramValue = parameters[param];
          // eslint-disable-next-line no-unused-expressions
          PCore.getAnnotationUtils().isProperty(paramValue)
            ? patchFields.push(PCore.getAnnotationUtils().getPropertyName(paramValue))
            : null;
        });
      }
    } else if (field.cellRenderer === 'UserReference') {
      const associationCategory = field.customObject.associationID;
      if (associationCategory) {
        patchFields.push(`${associationCategory}:pyUserName`);
      }
    }

    patchFields.forEach((k) => {
      if (!queryFields.find((q) => q === k)) {
        queryFields.push(k);
      }
    });
  });
  return queryFields;
}

export function initializeTableConfig(config, fields) {
  const {
    presetId,
    presetName,
    title,
    icon,
    deltaAdjustment,
    fitHeightToElement,
    basicMode,
    selectionMode,
    relativeDates,
    dateFunctions,
    additionalTableConfig,
    numberOfRows,
    allowMovingRecords,
    selectionCountThreshold,
    disabled,
    required,
    defaultRowHeight,
    inTabbedPage,
    isDataObject,
    classID,
    isQueryable = false,
    reportColumnsSet
  } = config;

  const featuresMap = {};

  return {
    height: {
      minHeight: 600,
      fitHeightToElement: fitHeightToElement ?? 'document',
      deltaAdjustment: deltaAdjustment ?? 50,
      autoSize: true,
      maxHeight: inTabbedPage ? `--content-height-in-view` : undefined
    },
    numberOfRows: numberOfRows ? parseInt(numberOfRows, 10) : undefined,
    reorderItems: allowMovingRecords,
    dragHandle: allowMovingRecords,
    moveListRecords: allowMovingRecords,
    basicMode,
    selectionMode,
    fieldDefs: fields,
    patchQueryFields: preparePatchQueryFields(fields, isDataObject, classID),
    itemKey: getItemKey(fields),
    id: presetId,
    name: presetName,
    ...featuresMap,
    ...additionalTableConfig,
    title,
    icon,
    dateFunctions,
    relativeDates,
    isQueryable,
    timezone: PCore.getEnvironmentInfo().getTimeZone(),
    renderingMode: PCore.getEnvironmentInfo()?.getRenderingMode(),
    selectionCountThreshold,
    disableSelectionOnLoad: disabled,
    requiredOnLoad: required,
    // if defaultRowHeight empty string set undefined to fallback to Row Density OOTB defaulting logic.
    defaultRowHeight: defaultRowHeight || undefined,
    // Export to excel option is shown for list sourced from queryable RD sourced DP.
    showExportToExcelOption: isQueryable && reportColumnsSet.size > 0,
  };
}

export const readContextResponse = async (context, params) => {
  const {
    personalization,
    grouping,
    getPConnect,
    expandGroups,
    reorderFields,
    editing,
    deleting,
    globalSearch,
    toggleFieldVisibility,
    personalizationId,
    showHeaderIcons,
    title,
    basicMode,
    selectionMode,
    allowAddingNewRecords,
    numberOfRows,
    allowMovingRecords,
    apiContext,
    setListContext,
    icon,
    children,
    selectionCountThreshold,
    xRayInfo,
    xRayUid,
    disabled,
    required,
    openCaseViewAfterCreate,
    enableGetNextWork,
    defaultRowHeight,
    showDynamicFields,
    inTabbedPage,
    referenceList,
    create,
    isDataObject
  } = params;
  const xRayApis = PCore.getDebugger().getXRayRuntime();
  const { promisesResponseArray, apiContext: otherContext } = context;
  // eslint-disable-next-line sonarjs/no-unused-collection
  const listOfComponents = [];
  const {
    data: { fields: metaFields, classID, isQueryable }
  } = promisesResponseArray[0];
  let {
    data: { primaryFields }
  } = promisesResponseArray[0];
  // When list is configured with Include all class fields configuration, provide support for Primary fields column
  if (showDynamicFields) {
    const sourceMetadata = PCore.getMetadataUtils().getDataPageMetadata(referenceList);
    if (sourceMetadata?.primaryFields) {
      primaryFields = sourceMetadata.primaryFields;
    }
    // updating metaData fieldID to normal property if it has fieldID starts with !P! or !PL!
    updateMetaEmbeddedFieldID(metaFields);
  }
  updateFieldType(metaFields);


  // Setting fetchRowActionDetails API to null for Data objects
  // preparing composite keys from classKeys for dataObjects CRUD operations, If classKeys are available then itemKey is '$key'
  // using the additionalTableConfig prop and assigning it a new object with itemKey as '$key'
  let { additionalTableConfig } = params;
  if (isDataObject) {
    const compositeKeys = [];
    const dataObjectKey = '$key';
    const dataViewName = PCore.getDataTypeUtils().getSavableDataPage(classID);
    const dataPageKeys = PCore.getDataTypeUtils().getDataPageKeys(dataViewName);
    dataPageKeys?.forEach((item) =>
      item.isAlternateKeyStorage ? compositeKeys.push(item.linkedField) : compositeKeys.push(item.keyName)
    );
    if (compositeKeys.length) {
      otherContext.setCompositeKeys(compositeKeys);
      additionalTableConfig = { ...additionalTableConfig, itemKey: dataObjectKey };
    }
    otherContext.fetchRowActionDetails = null;
  }

  const presetArray = [];
  const rawMetadata = getPConnect().getRawMetadata().config;
  const rawPresets = rawMetadata.presets;
  const isMetaWithPresets = rawPresets && rawPresets.length !== 0;
  const childrenIterator = isMetaWithPresets ? rawPresets : children;
  const resolvedPresets = getPConnect().getConfigProps().presets;
  let fields;
  let tableConfig;
  childrenIterator?.forEach((presetMeta, index) => {
    const template = presetMeta.template || 'Table';
    const {
      presetId,
      presetName,
      filterExpression,
      configFields
    } = getTableConfigFromPresetMeta(
      { ...presetMeta, label: resolvedPresets[index].label },
      isMetaWithPresets,
      getPConnect,
      classID,
      primaryFields,
      metaFields,
      isQueryable
    );
    const pushToComponentsList = (fieldType) => {
      listOfComponents.push(fieldType);
    };
    // read report columns response - in case of nonqueryable ignore the response and rely only on the fields configured at authoing time in presets
    const reportColumnsSet = isQueryable ? getReportColumns(promisesResponseArray[1]) : new Set();

    // in case of queryable, change pagelist field config from filtered-list annotation to property annotation
    // TODO: Remove this conversion if the response is nested and we support scalar list component for pageList properties - queryable
    if (isQueryable) {
      updatePageListFieldsConfig(configFields);
    }
    const configFieldSet = prepareConfigFields(configFields, pushToComponentsList);

    // FIXME #EmbeddedPropertyPatch
    // TODO: Remove this merge logic when the metadata response includes all optimized embedded page and pagelists
    // merging configured embedded properties with metadata so that while preparing extra fields, config fields can get other properties from meta(eg: category, displayAsLink)
    // get configured embedded properties metadata and get new mergedMetaFields
    const configEmbeddedFieldsMeta = getConfigEmbeddedFieldsMeta(configFieldSet, classID);
    const mergedMetaFields = mergeConfigEmbeddedFieldsMeta(configEmbeddedFieldsMeta, metaFields);

    const extraFields = prepareExtraFields(
      mergedMetaFields, // passing new merged meta fields which has meta of configured embedded fields of current preset
      configFields,
      configFieldSet,
      reportColumnsSet,
      classID,
      showDynamicFields,
      isQueryable
    );


    fields = initializeColumns(
      [...configFields, ...extraFields],
      getPConnect().getActionsApi(),
      getPConnect(),

    );
    // Capture the xRay metrics per preset
    xRayInfo.visibleColumns.personalisations[resolvedPresets[index].label] = configFields.length;
    xRayInfo.totalColumns = extraFields.length;
    tableConfig = initializeTableConfig(
      {
        personalization,
        grouping,
        expandGroups,
        reorderFields,
        editing,
        deleting,
        globalSearch,
        toggleFieldVisibility,
        filterExpression,
        personalizationId,
        presetId,
        presetName,
        showHeaderIcons,
        title,
        icon: icon?.replace('pi pi-', ''),
        headerBar: true,
        deltaAdjustment: 20,
        relativeDates: true,
        template,
        basicMode,
        selectionMode,
        additionalTableConfig,
        allowAddingNewRecords,
        numberOfRows,
        allowMovingRecords,
        selectionCountThreshold,
        disabled,
        required,
        openCaseViewAfterCreate,
        enableGetNextWork,
        defaultRowHeight,
        inTabbedPage,
        isDataObject,
        classID,
        isQueryable,
        create,
        showDynamicFields,
        reportColumnsSet
      },
      fields
    );
  });
  // Set the presets info in xRayInfo object
  xRayApis.updateXRay(xRayUid, xRayInfo);
  const meta = tableConfig;
  setListContext({
    meta,
    presets: presetArray,
    apiContext: {
      ...apiContext,
    }
  });
};
