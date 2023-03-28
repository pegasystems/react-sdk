import React, { createElement } from "react";

import createPConnectComponent from '../../../bridge/react_pconnect';
import isOnlyOneField from '../../../helpers/hooks/QuestionDisplayHooks';

import './DefaultForm.css';

export default function DefaultForm(props) {
  const { getPConnect, readOnly, additionalProps } = props;

  const onlyOneField = isOnlyOneField();

  // repoint the children because they are in a region and we need to not render the region
  // to take the children and create components for them, put in an array and pass as the
  // defaultForm kids
  const arChildren = getPConnect().getChildren()[0].getPConnect().getChildren();
  let hasSingleChildWhichIsReference = false;

  const dfChildren = arChildren.map((kid, idx) =>{
    let extraProps = {};
    const childPConnect = kid.getPConnect();
    if(onlyOneField && childPConnect.getConfigProps().readOnly !== true && idx === 0){
      childPConnect.setInheritedProp('label', getPConnect().getDataObject().caseInfo.assignments[0].name);
    }
    if(readOnly) extraProps = {...extraProps, showLabel:false, labelHiddenForReadOnly:kid.showLabel};
    return createElement(createPConnectComponent(), { ...kid, key: idx, ...extraProps }) // eslint-disable-line react/no-array-index-key
  });


  // PM - This function batches the children of a DefaultForm, to group single in put fields togehter, or with preceeding sets of fields,
  // creating a new 'batch' each time a child is a reference type, and will show label.
  // Used when read only to avoid creating individual <dl> wrappers for individual fields, and to enable the correct wrapping of read only field
  // in a <dl> when a label is being shown (as this needs to be displayed outside of the <dl> wrapper)
  const batchChildren = (children) => {
    let ind = 0;
    const groupedChildren:any = [];

    let group:any = [];

    children.forEach( (child) => {

      if(children.length > 1 && child.props.getPConnect().getMetadata().type === 'reference' && ind !== 0 && child.props.getPConnect().getInheritedProps().showLabel){
        if(group.length > 0) {
          groupedChildren.push(group)
        }
        groupedChildren.push([child]);
        group = [];
        ind+=1;
        return;
      }

      group.push(child)
      ind+=1;
    })
    if(group.length > 0){
      groupedChildren.push(group);
    }
    return groupedChildren;
  }

  hasSingleChildWhichIsReference = (dfChildren?.length === 1 && dfChildren[0].props.getPConnect().getMetadata().type === "reference");

  if(readOnly && !hasSingleChildWhichIsReference) {
    return (batchChildren(dfChildren).map((childGroup, index) => {
      if(childGroup.length < 1){
        return;
      }

      const key = `${getPConnect().getMetadata().name}-${index}`

      const allrefs = childGroup.every(child => child.props.getPConnect().getMetadata().type === 'reference');
      if(additionalProps.hasBeenWrapped || allrefs){
        return(
          <React.Fragment key={key}>{childGroup}</React.Fragment>
        )
      }

      childGroup.forEach( child => child.props.getPConnect().setStateProps({'hasBeenWrapped': true}));

      return (<dl className="govuk-summary-list" key={key}>
        {childGroup}
      </dl>
      )
    }))
  }

  return <>{dfChildren}</>;
}
