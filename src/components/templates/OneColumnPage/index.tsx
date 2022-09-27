import React from "react";
import PropTypes from "prop-types";

import OneColumn from '../OneColumn';

/*
 * The wrapper handles knowing how to take in just children
 *  and mapping to the TwoColumn template.
 */
export default function OneColumnPage(props) {

  return (
    <OneColumn
       {...props}
    />
  );
}

OneColumnPage.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
};

OneColumnPage.defaultProps = {
};
