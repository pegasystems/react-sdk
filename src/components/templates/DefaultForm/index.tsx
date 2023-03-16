import React, { createElement } from "react";
import PropTypes from "prop-types";

import createPConnectComponent from '../../../bridge/react_pconnect';

import './DefaultForm.css';

export default function DefaultForm(props) {
  const { getPConnect, NumCols } = props;

  // // eslint-disable-next-line react/default-pro
  let divClass: string;

  const numCols = NumCols || "1";
  switch (numCols) {
    case "1" :
      divClass = 'govuk-grid-column-full';
      break;
    case "2" :
      divClass = 'govuk-grid-column-one-half';
      break;
    case "3" :
      divClass = 'govuk-grid-column-one-third';
      break;
    default :
      divClass = 'govuk-grid-column-full';
      break;
  }

  // debugger;

  // repoint the children because they are in a region and we need to not render the region
  // to take the children and create components for them, put in an array and pass as the
  // defaultForm kids
  const arChildren = getPConnect().getChildren()[0].getPConnect().getChildren();
  // eslint-disable-next-line react/no-array-index-key
  const dfChildren = arChildren.map((kid, idx) => createElement(createPConnectComponent(), {...kid, key: idx}));

  return (
    <>
      {dfChildren}
    </>
  )
}

DefaultForm.propTypes = {
  // children: PropTypes.arrayOf(PropTypes.node).isRequired,
  NumCols: PropTypes.string
};

DefaultForm.defaultProps = {
  NumCols: "1"
};
