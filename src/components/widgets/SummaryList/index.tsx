import React from "react";
import SummaryItem from '../SummaryItem/index'

export default function SummaryList(props) {
  return (
    <div>
      {props.arItems$.map(file => (
        <SummaryItem key={file.id} menuIconOverride$={props.menuIconOverride$} arItems$={file} menuIconOverrideAction$={props.menuIconOverrideAction$}></SummaryItem>
      ))}
    </div>
  );
}
