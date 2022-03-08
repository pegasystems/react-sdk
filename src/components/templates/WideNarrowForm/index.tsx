import React from "react";

import './WideNarrow.css';

export default function WideNarrowForm(props) {
  const {children} = props;

  return (
    <React.Fragment>
    {children && children.length === 2 &&
      <div className="psdk-wide-narrow-column">
        <div className="psdk-wide-column-column">
          {children[0]}
        </div>
        <div className="psdk-narrow-column-column">
          {children[1]}
        </div>
      </div>
    }
    </React.Fragment>

  )

}
