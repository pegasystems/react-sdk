import React from "react";
import PropTypes from "prop-types";

export default function OneColumnTab(props) {
  const { children} = props;

  return (
    <div id="OneColumnTab">
      {children}
    </div>
  )
}

OneColumnTab.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
  // template: PropTypes.string.isRequired
};
