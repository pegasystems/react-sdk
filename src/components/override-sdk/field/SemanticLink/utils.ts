function getDataReferenceInfo(pConnect, dataRelationshipContext) {
  if (!pConnect) {
    throw Error('PConnect parameter is required');
  }

  let dataContext = '';
  const payload = {};
  const pageReference = pConnect.getPageReference();
  const annotationUtils = PCore.getAnnotationUtils();
  let fieldMetadata;

  if (pageReference) {
    /*
    For page list the page refernce will be something like caseInfo.content.EmployeeRef[1].
    Need to extract EmployeeRef from caseInfo.content.EmployeeRef[1]
    */
    const propertySplit = pageReference.split('.');

    // Regex to match if the property is list type. Eg: EmployeeRef[1]
    const listPropertyRegex = /([a-z|A-Z]*[[][\d]*)[\]]$/gm;
    // Regex to match [1] part of the property EmployeeRef[1]
    const indexRegex = /([[][\d]*[\]])+/gm;

    let contextProperty = dataRelationshipContext !== null ? dataRelationshipContext : propertySplit.pop();
    const isListProperty = listPropertyRegex.test(contextProperty);
    contextProperty = isListProperty ? contextProperty.replace(indexRegex, '') : contextProperty;
    fieldMetadata = pConnect.getFieldMetadata(contextProperty);
  }

  if (!!fieldMetadata && fieldMetadata.datasource) {
    const { name, parameters } = fieldMetadata.datasource;
    dataContext = name;
    for (const [key, value] of Object.entries(parameters)) {
      const property =
        // @ts-expect-error - Property 'getLeafPropertyName' is private and only accessible within class 'AnnotationUtils'
        dataRelationshipContext !== null ? annotationUtils.getPropertyName(value as string) : annotationUtils.getLeafPropertyName(value);
      payload[key] = pConnect.getValue(`.${property}`);
    }
    return { dataContext, dataContextParameters: payload };
  }

  return {};
}

function isLinkTextEmpty(text) {
  return text === '' || text === undefined || text === null;
}

export default { getDataReferenceInfo, isLinkTextEmpty };
