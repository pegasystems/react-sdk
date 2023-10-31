import React from 'react';
import PropTypes from 'prop-types';

import ListView from '../ListView';

export default function ListPage(props) {
  // special case for ListView - add in a prop
  const listViewProps = { ...props, bInForm: false };
  return <ListView {...listViewProps}></ListView>;
}

ListPage.defaultProps = {
  parameters: undefined
};

ListPage.propTypes = {
  getPConnect: PropTypes.func.isRequired,
  parameters: PropTypes.objectOf(PropTypes.any)
};
