import React from "react";
import PropTypes from "prop-types";

import ListView from '../ListView';

export default function ListPage(props) {

  return (
    <ListView  {...props}></ListView>
  )
}

ListPage.defaultProps = {
  parameters: undefined
};

ListPage.propTypes = {
  getPConnect: PropTypes.func.isRequired,
  parameters: PropTypes.objectOf(PropTypes.any)
};
