import React from "react";
import { Utils } from "../../../helpers/utils";
import './SummaryItem.css'
declare const PCore: any;

export default function SummaryItem(props) {
  let settingsSvgIcon$ = "";
  let imagePath$ = "";
  let menuIconOverride$;
  let item$: any;
  let srcImg;
  menuIconOverride$ = props.menuIconOverride$
  imagePath$ = Utils.getIconPath(PCore.getAssetLoader().getStaticServerUrl());
  settingsSvgIcon$ = Utils.getImageSrc("more", PCore.getAssetLoader().getStaticServerUrl());
  item$ = props.arItems$;
  srcImg = `${imagePath$}${item$.visual.icon}.svg`
  if (menuIconOverride$) {
    menuIconOverride$ = Utils.getImageSrc(menuIconOverride$ , PCore.getAssetLoader().getStaticServerUrl());
  }

  function removeAttachment() {
    props.menuIconOverrideAction$(item$)
  }
  return (
    <div className="psdk-utility-card">
      <div className="psdk-utility-card-icon">
        <img className="psdk-utility-card-svg-icon" src={srcImg}></img>
      </div>
      <div className="psdk-utility-card-main">
        <div className="psdk-utility-card-main-primary-label">{item$.primary.name}</div>
        {item$.secondary.text && (<div>{item$.secondary.text}</div>)}
      </div>
      <div>
        {menuIconOverride$ && (<button className="psdk-utility-button" onClick={removeAttachment}>
            <img className="psdk-utility-card-action-svg-icon" src={menuIconOverride$}></img>
        </button>)}
      </div>
    </div>
  )
}
