import React from "react";
import { Button } from '@material-ui/core';
import './ActionButtons.css';

export default function ActionButtons(props) {

  return (
    <div className="psdk-actions">
      <div className="psdk-action-buttons">
        {props.arSecondaryButtons.map(file => (
          <Button className="secondary-button" key={file.actionID} onClick={props.secondaryAction}>{file.name}</Button>
        ))}
      </div>
      <div className="psdk-action-buttons">
        {props.arMainButtons.map(file => (
          <Button className="primary-button" key={file.actionID} onClick={props.primaryAction}>{file.name}</Button>
        ))}
      </div>
    </div>
  )

}
