import React, { useState } from "react";
import { Utils } from "../../../helpers/utils";
import './SummaryItem.css'
import  { IconButton, Menu, MenuItem } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';

export default function SummaryItem(props) {
  let imagePath$ = "";
  let menuIconOverride$;
  menuIconOverride$ = props.menuIconOverride$
  imagePath$ = Utils.getIconPath(Utils.getSDKStaticConentUrl());
  const item = props.arItems$;
  const srcImg = `${imagePath$}${item.visual.icon}.svg`
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  if (menuIconOverride$) {
    menuIconOverride$ = Utils.getImageSrc(menuIconOverride$ , Utils.getSDKStaticConentUrl());
  }

  function removeAttachment() {
    props.menuIconOverrideAction$(item)
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="psdk-utility-card">
      <div className="psdk-utility-card-icon">
        <img className="psdk-utility-card-svg-icon" src={srcImg}></img>
      </div>
      <div className="psdk-utility-card-main">
        {item.primary.type !== 'URL' && (<div className="psdk-utility-card-main-primary-label">{item.primary.name}</div>)}
        {item.primary.type === 'URL' && (<div className="psdk-utility-card-main-primary-url">
          <button type="button" className="psdk-link-button">
            {item.primary.name}&nbsp;
            <img className="psdk-utility-card-actions-svg-icon" src={`${imagePath$}${item.primary.icon}.svg`}></img>
          </button>
        </div>)}
        {item.secondary.text && (<div style={{ color: item.secondary.error ? 'red' : undefined }}>{item.secondary.text}</div>)}
      </div>
      <div className="psdk-utility-action">
        {menuIconOverride$ && (<button type="button" className="psdk-utility-button" onClick={removeAttachment}>
            <img className="psdk-utility-card-action-svg-icon" src={menuIconOverride$}></img>
        </button>)}
        {!menuIconOverride$ && (<div>
          <IconButton
            id="setting-button"
            aria-controls={open ? 'file-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-haspopup="true"
            onClick={handleClick}
          >
          <MoreVertIcon />
          </IconButton>
          <Menu style={{marginTop: '3rem'}}
            id="file-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
          {item.actions && item.actions.map((option) => (
            <MenuItem style={{fontSize: '14px'}} key={option.id || option.text} onClick={option.onClick}>
              {option.text}
            </MenuItem>
          ))}
          </Menu>
        </div>)}
      </div>
    </div>
  )
}
