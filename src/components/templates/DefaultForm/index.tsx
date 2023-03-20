import React, { createElement } from "react";

import createPConnectComponent from '../../../bridge/react_pconnect';
import isOnlyOneField from '../../../helpers/hooks/QuestionDisplayHooks';

import './DefaultForm.css';

export default function DefaultForm(props) {
  const { getPConnect } = props;

  const onlyOneField = isOnlyOneField();

  // repoint the children because they are in a region and we need to not render the region
  // to take the children and create components for them, put in an array and pass as the
  // defaultForm kids
  const arChildren = getPConnect().getChildren()[0].getPConnect().getChildren();

  const dfChildren = arChildren.map((kid, idx) =>{
    const childPConnect = kid.getPConnect();
    if(onlyOneField && childPConnect.getConfigProps().readOnly !== true){
      childPConnect.setInheritedProp('label', getPConnect().getDataObject().caseInfo.assignments[0].name);
    }
    return createElement(createPConnectComponent(), { ...kid, key: idx }) // eslint-disable-line react/no-array-index-key
  });

  return <>{dfChildren}</>;
}
