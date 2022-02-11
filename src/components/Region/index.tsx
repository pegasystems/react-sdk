import React from "react";
import PropTypes from "prop-types";

export default function Region(props) {
  const { children } = props;

  return <React.Fragment>
    <>
      {/* <div>Region</div> */}
      {children}
    </>
  </React.Fragment>;
}

Region.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node).isRequired
};
