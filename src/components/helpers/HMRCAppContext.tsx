import {createContext} from 'react';



const DefaultFormContext = createContext({
  // Is this Default Form set to display as single question?
  displayAsSingleQuestion: false,
  // What is the name of this Default Form (should be same as name pushed to HMRCAppContext SingleQuestionDisplayDFStack)
  DFName: -1,
  // Holds assignment name incase needed for single page label
  OverrideLabelValue: ''
});


export default DefaultFormContext;
