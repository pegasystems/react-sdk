import React from "react";
import PropTypes from "prop-types";

// import { TwoColumnPage as TwoColumn } from "@pega/cosmos-react-core";
import TwoColumn from '../TwoColumn';

/*
 * The wrapper handles knowing how to take in just children
 *  and mapping to the TwoColumn template.
 */
export default function TwoColumnPage(props) {

  return (
    <TwoColumn
      {...props}
    />
  );
}

TwoColumnPage.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node).isRequired,
};

TwoColumnPage.defaultProps = {
};
