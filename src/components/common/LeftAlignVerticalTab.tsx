import React from "react";
import { withStyles } from '@material-ui/core/styles'
import {
  Tab,
  Divider,
} from '@material-ui/core';

// LeftAlignVerticalTab is a specialized Tab that has styles to make it
//  left aligned and full width of the container Tabs

// Aligning the Tab labels left (with & .<class name> syntax) inspired by:
//  https://stackoverflow.com/questions/63307723/how-to-modify-the-wrapper-css-rule-of-a-tabs-component-to-make-the-text-aligned

// In this styling, "root" is the top-level "Tab" object (which is the button)
//  and the button contains spans that will match on the '> span'
const LeftAlignVerticalTab: any = withStyles((/* theme */) => ({
  root: {
    width: '100%',
    maxWidth: '100%',
  },
  wrapper: {
    display: 'block',
    textAlign: 'left',
  },
}))((props) => <div><Tab {...props} /><Divider /></div>);

export default LeftAlignVerticalTab;
