import React from "react";
import PropTypes from "prop-types";

export default function OneColumn(props) {
  const { children} = props;

  return (
    <div className="govuk-grid-column-full">
        {children.map(child => { return child; } )}
    </div>
  )
}

OneColumn.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
  // template: PropTypes.string.isRequired
};
