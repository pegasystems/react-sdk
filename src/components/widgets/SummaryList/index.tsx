import React from "react";
import SummaryItem from '../SummaryItem/index'
declare const PCore: any;

export default function SummaryList(props) {
  return (
    <div>
      {props.arItems$.map(file => (
        <SummaryItem key={file.id} menuIconOverride$={props.menuIconOverride$} arItems$={file}></SummaryItem>
      ))}
    </div>
  );
}
