import React from "react";

import './NarrowWide.css';

export default function NarrowWide(props) {
  // const {a, b /*, cols, icon, title */ } = props;
  const {a, b, children} = props;

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
    {a && b &&
      <div className="psdk-narrow-wide-column">
      <div className="psdk-narrow-column-column">
        {a}
      </div>
      <div className="psdk-wide-column-column">
        {b}
      </div>
    </div>
    }
    </React.Fragment>

  )

}
