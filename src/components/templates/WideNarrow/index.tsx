import React from "react";

import './WideNarrow.css';

export default function WideNarrow(props) {
  // const {a, b /*, cols, icon, title */ } = props;
  const { a, b, children } = props;

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
    {a && b &&
      <div className="psdk-wide-narrow-column">
        <div className="psdk-wide-column-column">
          {a}
        </div>
        <div className="psdk-narrow-column-column">
          {b}
        </div>
      </div>
    }
    </React.Fragment>

  )

}
