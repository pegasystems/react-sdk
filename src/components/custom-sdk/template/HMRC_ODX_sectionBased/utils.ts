import { v4 as uuidv4 } from 'uuid';

export const mapStateToProps: any = (_, ownProps) => {
  const { getPConnect } = ownProps;

  return {
    visibility: getPConnect().getComputedVisibility(),
    getPConnect
  };
};

export const getKeyForMappedField = field => {
  if (Array.isArray(field)) {
    return field
      .map(item => {
        return getKeyForMappedField(item);
      })
      .join('__');
  }

  const pConnect = field?.getPConnect?.();

  if (pConnect?.meta?.type && pConnect?.meta?.config?.name) {
    return `${pConnect.meta.type}_${pConnect.meta.config.name}`;
  }

  // Using label as a fallback if name is not defined.
  if (pConnect?.meta?.type && pConnect?.meta?.config?.label) {
    return `${pConnect.meta.type}_${pConnect.meta.config.label}`;
  }

  return uuidv4();
};