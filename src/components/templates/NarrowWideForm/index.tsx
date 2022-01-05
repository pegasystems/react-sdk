import React from "react";

import './NarrowWide.css';

export default function NarrowWideForm(props) {
  const {children} = props;

  return (
    <React.Fragment>
    {children && children.length === 2 &&
      <div className="psdk-narrow-wide-column">
      <div className="psdk-narrow-column-column">
        {children[0]}
      </div>
      <div className="psdk-wide-column-column">
        {children[1]}
      </div>
    </div>
    }
    </React.Fragment>

  )

}
