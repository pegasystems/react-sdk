//  This file is adapted from React components/Templates/utils.js

export function getAllFields(pConnect: any) {
  const metadata = pConnect.getRawMetadata();
  let allFields = [];
  if (metadata.children && metadata.children.map) {
    allFields = metadata.children.map((fields) => {
      const children = fields.children instanceof Array ? fields.children : [];
      return children.map((field) => field.config);
    });
  }
  return allFields;
}

export function filterForFieldValueList(fields : any) {
  return fields
    .filter(({ visibility }) => visibility !== false)
    .map(({ value, label }) => ({
      id: label.toLowerCase(),
      name: label,
      value
    }));
}
