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

  if (pConnect?.meta) {
    return JSON.stringify(pConnect.meta);
  }

  return crypto.randomUUID();
};
