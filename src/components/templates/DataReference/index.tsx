import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
export default function DataReference(props) {
  const { children} = props;
  return (
    // <div>Hello</div>
    <div id="OneColumnTab">
      <div>Hello</div>
      {children}
    </div>
  );
};

DataReference.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
};
