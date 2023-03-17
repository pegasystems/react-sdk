import React from "react";
import PropTypes from "prop-types";

export default function OneColumn(props) {
  const { children} = props;

  return (
    <>
        {children.map(child => { return child; } )}
    </>
  )
}

OneColumn.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
  // template: PropTypes.string.isRequired
};
