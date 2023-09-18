import {createContext} from 'react';

const HMRCAppContext = createContext({
  singleQuestionPage: false,
  setAssignmentSingleQuestionPage : (a:any) => {return a},


  // -- SINGLE QUESTION PAGE DISPLAY 'State' --
  // Following context values are used to drive the display of page heading/labels for the single question display logic.
  // Should contain list of Default Forms from the first Default Form with 'HidePageLabel' set to true
  SingleQuestionDisplayDFStack: [],
  // Pushes a new Default Form to the SingleQuestion Display DF Stack
  SingleQuestionDisplayDFStackPush: (a:any) => {return a},
});

const DefaultFormContext = createContext({

  // Is this Default Form set to display as single question?
  displayAsSingleQuestion: false,
  // What is the name of this Default Form (should be same as name pushed to HMRCAppContext SingleQuestionDisplayDFStack)
  DFName: -1
});


export { HMRCAppContext, DefaultFormContext };
