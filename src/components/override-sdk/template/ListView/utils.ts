import getDefaultViewMeta from './DefaultViewMeta';

const USER_REFERENCE = 'UserReference';
const PAGE = '!P!';
const PAGELIST = '!PL!';

export const formatConstants = {
  WorkStatus: 'WorkStatus',
  Integer: 'Integer',
  WorkLink: 'WorkLink'
};

class DataApi {
  mappedPropertyToOriginalProperty: any;
  originalPropertyToMappedProperty: any;
  constructor() {
    this.originalPropertyToMappedProperty = {};
    this.mappedPropertyToOriginalProperty = {};
    this.setPropertyMaps = this.setPropertyMaps.bind(this);
    this.getMappedProperty = this.getMappedProperty.bind(this);
    this.getOriginalProperty = this.getOriginalProperty.bind(this);
  }

  setPropertyMaps(originalToMappedPropertyObj = {}, mappedToOriginalPropertyObj = {}) {
    this.originalPropertyToMappedProperty = {
      ...this.originalPropertyToMappedProperty,
      ...originalToMappedPropertyObj
    };
    this.mappedPropertyToOriginalProperty = {
      ...this.mappedPropertyToOriginalProperty,
      ...mappedToOriginalPropertyObj
    };
  }

  getMappedProperty(propertyName) {
    return this.originalPropertyToMappedProperty[propertyName] ?? propertyName;
  }

  getOriginalProperty(propertyName) {
    return this.mappedPropertyToOriginalProperty[propertyName] ?? propertyName;
  }
}

export async function getContext(componentConfig) {
  const {
    promisesArray = [] // array of promises which can be invoked paralelly,
  } = componentConfig;
  const promisesResponseArray = await Promise.all(promisesArray);
  const dataApi = new DataApi();
  return {
    promisesResponseArray,
    setPropertyMaps: dataApi.setPropertyMaps,
    getMappedProperty: dataApi.getMappedProperty,
    getOriginalProperty: dataApi.getOriginalProperty
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
  return metaFields.forEach(metaField => {
    if (metaField.fieldID?.startsWith(PAGE) || metaField.fieldID?.startsWith(PAGELIST)) {
      metaField.fieldID = getFieldNameFromEmbeddedFieldName(metaField.fieldID);
    }
  });
}

export const isEmbeddedField = field => {
  if (field?.startsWith('@')) {
    field = field.substring(field.indexOf(' ') + 1);
    if (field[0] === '.') field = field.substring(1);
  }
  return field?.indexOf('.') > 0;
};

/**
 * [isPageListProperty]
 * Description    -        checking if propertyName is pageList or not
 * @ignore
 * @param {string} propertyName   PropertyName
 * @returns {boolean}  true if property is pageList else false
 *
 * @example <caption>Example for isPageListProperty </caption>
 * isPageListProperty('!PL!Employees.Name') return true
 * isPageListProperty('!P!Employees.Name') return false
 * isPageListProperty('Name') return false
 */
export function isPageListProperty(propertyName) {
  return propertyName.startsWith(PAGELIST);
}

export const isPageListInPath = (propertyName, currentClassID) => {
  if (!propertyName.includes('.')) {
    return false;
  }
  const [first, ...rest] = propertyName.split('.');
  const metadata: any = PCore.getMetadataUtils().getPropertyMetadata(first, currentClassID);
  if (metadata?.type === 'Page List') {
    return true;
  }
  return isPageListInPath(rest.join('.'), metadata?.pageClass);
};

/**
 * [getEmbeddedFieldName]
 * Description    -               converting normal field name to embedded field starting with !P! or !PL!
 * @ignore
 * @param {string} propertyName   Field name
 * @param {string} classID        classID of datapage
 * @returns {string}              returns converted string with !P! or !PL! and :
 *
 * @example <caption>Example for getEmbeddedFieldName </caption>
 * For page property, getEmbeddedFieldName('Organisation.Name') return '!P!Organisation:Name'
 * For pageList property, getEmbeddedFieldName('Employees.Name') return '!PL!Employees:Name'
 */

export function getEmbeddedFieldName(propertyName, classID) {
  let value = propertyName;
  if (isPageListInPath(value, classID)) {
    value = `!PL!${value.replace(/\./g, ':')}`;
  } else {
    value = `!P!${value.replace(/\./g, ':')}`;
  }
  return value;
}

/**
 * [preparePropertyMaps]
 * Description    -        preparing maps for property names and set it in dataApi context
 * @ignore
 * @param {Array} fields   fields array
 * @param {string} classID  classID of datapage
 * @param {string} context  dataApi context
 * @returns {boolean} true if pageListProperty is present
 */
export function preparePropertyMaps(fields, classID, context) {
  const { setPropertyMaps } = context;
  const maps = fields.reduce(
    (acc, field) => {
      let { value } = field.config;
      if (value.startsWith('@')) {
        value = value.substring(value.indexOf(' ') + 1);
        if (value[0] === '.') value = value.substring(1);
      }
      let name = value;
      // Preparing name for embedded property
      if (isEmbeddedField(name)) {
        name = getEmbeddedFieldName(name, classID);
      }
      if (isPageListProperty(name) && !acc[2]) {
        acc[2] = true;
      }
      acc[0][value] = name;
      acc[1][name] = value;

      return acc;
    },
    [{}, {}, false]
  );
  setPropertyMaps(maps[0], maps[1]);
  return maps[2];
}

/**
 * [getConfigEmbeddedFieldsMeta]
 * Description    -           Get the metadata for configured embedded fields
 * @ignore
 * @param {Set} configFields  Set of config fields
 * @param {string} classID    clasID of datapage
 * @returns {Array}           Metadata of configured embedded fields
 */
export function getConfigEmbeddedFieldsMeta(configFields, classID) {
  const configEmbeddedFieldsMeta: any[] = [];
  configFields.forEach(field => {
    let value = field;
    if (isEmbeddedField(value)) {
      // conversion Page.PageList[].property => Page.PageList.property
      if (value.includes('[')) {
        value = value.substring(0, value.indexOf('[')) + value.substring(value.indexOf(']') + 1);
      }
      // @ts-ignore - Expected 3 arguments, but got 2.
      const meta: any = PCore.getMetadataUtils().getEmbeddedPropertyMetadata(value, classID);
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
  configEmbeddedFieldsMeta.forEach(configFieldMeta => {
    const fieldMeta = metaFields.find(metaField => metaField.fieldID === configFieldMeta.fieldID);
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
  metaFields.forEach(metaField => {
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
function generateViewMetaData(rawFields, classID, showField) {
  return rawFields.map(item => getDefaultViewMeta(item, classID, showField));
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
function getConfigFields(configFields, primaryFields, metaFields, classID) {
  const presetConfigFields = configFields;
  const primaryFieldsViewIndex = presetConfigFields.findIndex(field => field.config.value === 'pyPrimaryFields');
  if (!primaryFields || !primaryFields.length) {
    if (primaryFieldsViewIndex < 0) return presetConfigFields;

    presetConfigFields.splice(primaryFieldsViewIndex, 1);

    return presetConfigFields;
  }

  if (primaryFieldsViewIndex > -1) {
    // list of uncommon fields - non overlap of primary fields grouped view and independent entity columns of primary type
    const uncommonFieldsList = primaryFields.filter(
      primaryField => !presetConfigFields.some(presetConfigField => presetConfigField.config.value.split('.')[1] === primaryField)
    );
    const uncommonFieldsRawMeta: any[] = [];
    uncommonFieldsList.forEach(uncommonField => {
      const uncommonFieldMeta = metaFields.find(metaField => metaField.fieldID === uncommonField);
      if (uncommonFieldMeta) uncommonFieldsRawMeta.push(uncommonFieldMeta);
    });
    const uncommonFieldsConfigMeta = generateViewMetaData(uncommonFieldsRawMeta, classID, true);

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
export function getTableConfigFromPresetMeta(presetMeta, isMetaWithPresets, getPConnect, classID, primaryFields, metaFields) {
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
      !fieldsMeta.children.find(fieldMeta => {
        return fieldMeta?.config?.value === presetMeta.timelineTitle?.config?.value;
      })
    ) {
      const { type, config } = presetMeta.timelineTitle;
      fieldsMeta.children.push({ type, config: { ...config, show: false } });
    }
    if (
      presetMeta.timelineDate &&
      !fieldsMeta.children.find(fieldMeta => {
        return fieldMeta?.config?.value === presetMeta.timelineDate?.config?.value;
      })
    ) {
      const { type, config } = presetMeta.timelineDate;
      fieldsMeta.children.push({ type, config: { ...config, show: false } });
    }
    configFields = getConfigFields(fieldsMeta.children, primaryFields, metaFields, classID);
  } else {
    fieldsMeta = presetMeta.props;
    configFields = getConfigFields(
      fieldsMeta
        .getPConnect()
        .getChildren()
        ?.map(child => {
          return child.getPConnect().getRawMetadata();
        }),
      primaryFields,
      metaFields,
      classID
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
  reportColumns?.forEach(item => {
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
  configFields.forEach(item => {
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
  return configFields.find(configField => {
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
function prepareExtraFields(metaFields, configFields, configFieldSet, reportColumnsSet, classID, showDynamicFields) {
  // Filter all the extra fields
  const extraFileds = metaFields.filter(item => {
    return isAnExtraField(configFields, configFieldSet, reportColumnsSet, item, classID, showDynamicFields);
  });
  return generateViewMetaData(extraFileds, classID, false);
  // Update the meta object of each of the extra fields.
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
  } else if (name === 'pyStatusWork' || name === 'pyAssignmentStatus') {
    config.cellRenderer = formatConstants.WorkStatus;
  } else if (name === 'pxUrgencyWork') {
    config.cellRenderer = formatConstants.Integer;
  }
}
export function initializeColumns(fields: any[] = [], getMappedProperty: any = null) {
  return fields.map((field, originalColIndex) => {
    let name = field.config.value;

    if (name.startsWith('@')) {
      name = name.substring(name.indexOf(' ') + 1);
      if (name[0] === '.') name = name.substring(1);
    }
    name = getMappedProperty?.(name) ?? name;

    let label = field.config.label || field.config.caption;
    const { show = true, displayAs } = field.config;
    if (label.startsWith('@')) {
      label = label.substring(3);
    }

    const config = {
      name,
      label,
      show,
      classID: field.config.classID,
      id: field.id || name || originalColIndex,
      displayAs,
      associationID: field.config.associationID,
      ...(field.config.classID && { category: field.config.category }),
      customObject: {},
      fieldType: field.config.fieldType,
      meta: {
        ...field
      }
    };

    populateRenderingOptions(name, config, field);

    return config;
  });
}

export const getItemKey = fields => {
  let itemKey;
  if (fields.findIndex(field => field.id === 'pyGUID') > -1) {
    itemKey = 'pyGUID';
  } else {
    itemKey = 'pzInsKey';
  }
  return itemKey;
};

export function preparePatchQueryFields(fields, isDataObject = false, classID = '') {
  const queryFields: any[] = [];
  fields.forEach(field => {
    const patchFields: any[] = [];
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
        dataPageKeys?.forEach(item => (item.isAlternateKeyStorage ? patchFields.push(item.linkedField) : patchFields.push(item.keyName)));
      } else {
        patchFields.push('pyID');
        patchFields.push('pzInsKey');
        patchFields.push('pxObjClass');
      }
    }
    patchFields.forEach(k => {
      if (!queryFields.find(q => q === k)) {
        queryFields.push(k);
      }
    });
  });

  return queryFields;
}

/**
 * Update the renderer type for the properties of type Page.
 */
export function updatePageFieldsConfig(configFields, parentClassID) {
  return configFields.forEach(item => {
    const {
      type,
      config: { value }
    } = item;
    const propertyName = PCore.getAnnotationUtils().getPropertyName(value);
    if (isEmbeddedField(value) && !isPageListInPath(propertyName, parentClassID)) {
      item.config.componentType = type;
      item.type = 'PagePropertyRenderer';
    }
  });
}

export const readContextResponse = async (context, params) => {
  const { getPConnect, apiContext, setListContext, children, showDynamicFields, referenceList, isDataObject } = params;
  const { promisesResponseArray, apiContext: otherContext } = context;
  // eslint-disable-next-line sonarjs/no-unused-collection
  const listOfComponents: any[] = [];
  const {
    data: { fields: metaFields, classID, isQueryable }
  } = promisesResponseArray[0];
  let {
    data: { primaryFields }
  } = promisesResponseArray[0];
  // When list is configured with Include all class fields configuration, provide support for Primary fields column
  if (showDynamicFields) {
    const sourceMetadata: any = PCore.getMetadataUtils().getDataPageMetadata(referenceList);
    if (sourceMetadata?.primaryFields) {
      primaryFields = sourceMetadata.primaryFields;
    }
    // updating metaData fieldID to normal property if it has fieldID starts with !P! or !PL!
    updateMetaEmbeddedFieldID(metaFields);
  }
  updateFieldType(metaFields);

  if (isDataObject) {
    const compositeKeys: any[] = [];
    const dataViewName = PCore.getDataTypeUtils().getSavableDataPage(classID);
    const dataPageKeys = PCore.getDataTypeUtils().getDataPageKeys(dataViewName);
    dataPageKeys?.forEach(item => (item.isAlternateKeyStorage ? compositeKeys.push(item.linkedField) : compositeKeys.push(item.keyName)));
    if (compositeKeys.length) {
      otherContext.setCompositeKeys(compositeKeys);
    }
    if (otherContext) {
      otherContext.fetchRowActionDetails = null;
    }
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
    const { configFields } = getTableConfigFromPresetMeta(
      { ...presetMeta, label: resolvedPresets[index].label },
      isMetaWithPresets,
      getPConnect,
      classID,
      primaryFields,
      metaFields
    );
    const pushToComponentsList = fieldType => {
      listOfComponents.push(fieldType);
    };
    // read report columns response - in case of nonqueryable ignore the response and rely only on the fields configured at authoing time in presets
    const reportColumnsSet = isQueryable ? getReportColumns(promisesResponseArray[1]) : new Set();

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
      showDynamicFields
    );

    if (isQueryable) {
      updatePageFieldsConfig(configFields, classID);
      preparePropertyMaps([...configFields, ...extraFields], classID, context);
    }

    const { getMappedProperty } = context;

    fields = initializeColumns([...configFields, ...extraFields], getMappedProperty);
    const patchQueryFields = preparePatchQueryFields(fields, isDataObject, classID);
    const itemKey = getItemKey(fields);
    tableConfig = { fieldDefs: fields, patchQueryFields, itemKey, isQueryable };
  });
  const meta = tableConfig;
  setListContext({
    meta,
    presets: presetArray,
    apiContext: {
      ...apiContext
    }
  });
};
