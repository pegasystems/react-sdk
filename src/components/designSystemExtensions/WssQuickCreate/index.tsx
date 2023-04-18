import React from 'react';
import { Button } from '@material-ui/core';
import './WssQuickCreate.css';

export default function WssQuickCreate(props) {
  const { heading, actions } = props;

  return (
    <div>
      <h1>{heading}</h1>
      <ul className='quick-link-ul-list'>
        {actions &&
          actions.map(element => {
            return (
            <li className='quick-link-list' key={element.label}>
              <Button className='quick-link-button' onClick={element.onClick}>
                <span className='quick-link-button-span'>
                  {element.icon && <img className='quick-link-icon' src={element.icon}/>}
                  <span>{element.label}</span>
                </span>
              </Button>
            </li>
            );
          })}
      </ul>
    </div>
  );
}
